/**
 * Schema database untuk Kopi Sudut.
 * File ini hanya membuat tabel. Pengguna database (user) harus dibuat
 * terpisah di server produksi dengan password yang kuat.
 *
 * Jalankan setelah MariaDB terinstal:
 *   mysql -u root < backend/schema.sql
 */

-- Buat database jika belum ada (utf8mb4 untuk emoji dan karakter international)
CREATE DATABASE IF NOT EXISTS kopi_sudut
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

-- Gunakan database ini
USE kopi_sudut;

-- Tabel pesanan: satu tabel saja untuk menyimpan data pesanan
CREATE TABLE IF NOT EXISTS pesanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_pelanggan VARCHAR(60) NOT NULL,
  no_whatsapp VARCHAR(20) NOT NULL,
  produk VARCHAR(60) NOT NULL,
  jumlah TINYINT UNSIGNED NOT NULL,
  catatan VARCHAR(200) NULL,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);