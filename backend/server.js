/**
 * Backend API untuk Kopi Sudut — pemesanan melalui MariaDB.
 * Hanya menggunakan: express, mysql2, dotenv.
 * Semua query gunakan prepared statement (parameterized query).
 */

import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "node:url";

// Gunakan fileURLToPath agar __dirname berfungsi di ES module (Node >= 18)
const currentFilePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(currentFilePath);

// Load .env dari direktori backend (akan didetect ulang di sistem berbeda)
const result = dotenv.config({ path: path.join(__dirname, ".env") });

if (result.error) {
  console.error("❌ Gagal memuat file .env. Pastikan file .env ada di folder backend.");
  process.exit(1);
}

// Validasi environment variables yang wajib ada
const requiredEnvs = ["PORT", "DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missing = requiredEnvs.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(
    `❌ Environment variable hilang: ${missing.join(", ")}. ` +
    "Pastikan file .env lengkap sebelum menyalankan server."
  );
  process.exit(1);
}

// Konfigurasi Express
const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

// Middleware: parse JSON dengan limit dan handler error parse
app.use(express.json({ limit: "10kb" }));
app.disable("x-powered-by");

// Handler error parse JSON yang gagal
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Format data tidak valid." });
  }
  next();
});

// Membuat koneksi pool MySQL dengan parameterized query saja
// gunakan connectionLimit (bukan max)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  idleTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 2000,
});

// Tangani error koneksi dari pool agar proses tidak crash
// (mis. MariaDB mati / kredensial salah). Detail hanya di log server.
pool.on("error", (err) => {
  console.error("❌ Pool database error:", err && err.message ? err.message : err);
});

// Known product names (dari data PRODUK di frontend)
const PRODUK_NAMES = [
  "Kopi Susu Gula Aren",
  "Iced Americano",
  "Iced Cappuccino",
  "Matcha Latte",
  "Iced Chocolate",
  "Thai Tea",
];

// ============================================================
// POST /api/pesanan — validasi sisi server dan simpan ke DB
// ============================================================
app.post("/api/pesanan", async (req, res) => {
  try {
    const body = req.body;

    // Pastikan body adalah object
    if (typeof body !== "object" || body === null) {
      return res.status(400).json({ error: "Format data tidak valid." });
    }

    // Type-safe validation: pastikan field yang expected string memang berupa string
    const nama = typeof body.nama_pelanggan === "string" ? body.nama_pelanggan.trim() : "";
    const noWhatsApp = typeof body.no_whatsapp === "string" ? body.no_whatsapp.trim() : "";
    const produk = typeof body.produk === "string" ? body.produk.trim() : "";
    const jumlah = body.jumlah !== undefined ? Number(body.jumlah) : undefined;
    const catatan = typeof body.catatan === "string" ? body.catatan.trim() : "";

    // 1. Validasi nama_pelanggan: 2-60 karakter (hanya string yang valid)
    if (nama.length < 2 || nama.length > 60) {
      return res.status(400).json({
        error: "Nama pelanggan harus antara 2 sampai 60 karakter.",
      });
    }

    // 2. Validasi no_whatsapp:
    //    - Hapus whitespace, dash, dan leading "+" menggunakan /[\s-]/g
    //    - lalu test /^(08|62)\d{7,13}$/ (total length 9-15)
    const whatsappClean = noWhatsApp.replace(/[\s-]/g, "").replace(/^\+/, "");
    const whatsappRegex = /^(08|62)\d{7,13}$/;
    const whatsappValid = whatsappRegex.test(whatsappClean);

    if (!whatsappValid) {
      return res.status(400).json({
        error: "No. WhatsApp tidak valid. Harus berupa angka, dimulai dengan 08 atau 62, dan panjang 9-15 digit (setelah dibersihkan).",
      });
    }

    // 3. Validasi produk: harus salah satu dari 6 produk yang dikenal
    if (!PRODUK_NAMES.includes(produk)) {
      return res.status(400).json({
        error: "Produk tidak dikenal. Pilih salah satu dari daftar yang tersedia.",
      });
    }

    // 4. Validasi jumlah: integer 1-20
    if (
      !Number.isInteger(jumlah) ||
      jumlah < 1 ||
      jumlah > 20
    ) {
      return res.status(400).json({
        error: "Jumlah harus berupa bilangan bulat antara 1 sampai 20.",
      });
    }

    // 5. Validasi catatan: opsional, max 200 karakter
    if (catatan.length > 200) {
      return res.status(400).json({
        error: "Catatan terlalu panjang (maksimal 200 karakter).",
      });
    }

    // Simpan ke database menggunakan prepared statement
    const [rows] = await pool.execute(
      `INSERT INTO pesanan (nama_pelanggan, no_whatsapp, produk, jumlah, catatan, dibuat_pada)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nama, whatsappClean, produk, jumlah, catatan.length > 0 ? catatan : null]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    // Jika terjadi error database, jangan leak ke client
    console.error("❌ Error POST /api/pesanan:", err);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// ============================================================
// GET /api/pesanan — ambil 15 pesanan terbaru (dengan masking nama)
// ============================================================
app.get("/api/pesanan", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, nama_pelanggan, produk, jumlah, catatan, dibuat_pada
         FROM pesanan
         ORDER BY dibuat_pada DESC
         LIMIT 15`
    );

    const maskedRows = rows.map((row) => {
      const fullName = row.nama_pelanggan || "";
      // Masking: tampilkan nama lengkap di awal, lalu satu huruf pertama dan titik
      // Contoh: "Adryan Achmad Firstiansyah" -> "Adryan A."
      const parts = fullName.trim().split(/\s+/);
      let maskedNama;
      if (parts.length >= 2) {
        maskedNama = `${parts[0]} ${parts[parts.length - 1][0]}.`;
      } else {
        maskedNama = fullName;
      }

      return {
        id: row.id,
        nama: maskedNama,
        produk: row.produk,
        jumlah: row.jumlah,
        catatan: row.catatan || null,
        dibuat_pada: row.dibuat_pada,
      };
    });

    res.json(maskedRows);
  } catch (err) {
    console.error("❌ Error GET /api/pesanan:", err);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// ============================================================
// GET /health — verifikasi koneksi database dengan timeout 2 detik
// ============================================================
app.get("/health", async (req, res) => {
  let connection = null;
  let responded = false;

  // Helper: kirim respons hanya sekali
  const finish = (statusCode, payload) => {
    if (responded) return;
    responded = true;
    res.status(statusCode).json(payload);
  };

  // Timeout 2 detik untuk SELURUH proses (getConnection + SELECT 1)
  const timer = setTimeout(() => {
    // Jika waktu habis, anggap database tidak terhubung
    if (connection) {
      try {
        connection.release();
      } catch (_) {}
      connection = null;
    }
    finish(503, { status: "ERROR", database: "disconnected" });
  }, 2000);

  try {
    // Ambil SATU koneksi
    connection = await pool.getConnection();

    // Jalankan SELECT 1 pada koneksi yang sama
    await connection.query("SELECT 1 AS test");

    clearTimeout(timer);

    // Release selalu sebelum kirim sukses
    try {
      connection.release();
    } catch (_) {}
    connection = null;

    finish(200, { status: "OK", database: "connected" });
  } catch (err) {
    clearTimeout(timer);

    // Release koneksi jika sempat didapat
    if (connection) {
      try {
        connection.release();
      } catch (_) {}
      connection = null;
    }

    // Detail error hanya di log server, TIDAK di body respons
    console.error("❌ Error /health:", err && err.code ? err.code : err);
    finish(503, { status: "ERROR", database: "disconnected" });
  }
});

// ============================================================
// Error handler umum — jangan leak stack trace ke client
// ============================================================
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ error: "Terjadi kesalahan server." });
});

// ============================================================
// Start server
// ============================================================
app.listen(port, "127.0.0.1", () => {
  console.log(`🚚 API Kopi Sudut berjalan di http://127.0.0.1:${port}`);
  console.log("📍 Endpoint: POST /api/pesanan, GET /api/pesanan, GET /health");
});

// Handle process exit graceful
process.on("SIGTERM", async () => {
  try {
    await pool.end();
  } catch (_) {}
  process.exit(0);
});

process.on("SIGINT", async () => {
  try {
    await pool.end();
  } catch (_) {}
  process.exit(0);
});