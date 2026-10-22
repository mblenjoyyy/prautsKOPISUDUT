# Kopi Sudut — Website Katalog & Pesan Online

Website company profile dan katalog menu untuk UMKM kedai kopi **Kopi Sudut**.
Dibuat dengan **HTML5, CSS3, dan Vanilla JavaScript** (tanpa framework frontend).
Ditambah fitur opsional **Pesan Online** yang menyimpan pesanan ke **MariaDB**
melalui API **Node.js + Express**.

## Arsitektur

```
                         ┌──────────────────────────────┐
   Browser               │  Nginx (port 80/443)          │
   (index, menu,         │  root /var/www/html           │
    tentang, pesan) ────▶│  - file statis (HTML/CSS/JS)  │
                         │  - /api/       → proxy        │
                         │  - /health     → proxy        │
                         └──────────────┬───────────────┘
                                        │ proxy_pass
                                        ▼
                         ┌──────────────────────────────┐
                         │  Node.js API (127.0.0.1:3000) │
                         │  Express + mysql2 + dotenv    │
                         │  systemd: kopi-sudut-api      │
                         └──────────────┬───────────────┘
                                        │ user kopi_app (localhost)
                                        ▼
                         ┌──────────────────────────────┐
                         │  MariaDB — database kopi_sudut│
                         │  tabel: pesanan (1 tabel)     │
                         └──────────────────────────────┘
```

Alur singkat (cocok untuk video demo):

1. User membuka `pesan.html`, mengisi form, menekan **Kirim Pesanan**.
2. JS (`js/pesan.js`) mengirim `POST /api/pesanan` (JSON).
3. Server memvalidasi, lalu `INSERT` ke tabel `pesanan`.
4. JS memuat ulang daftar lewat `GET /api/pesanan` (nama disamarkan).
5. `/health` khusus untuk memastikan API **dan** database tersambung.

---

## Struktur File Penting

```
/var/www/html
├── index.html
├── menu.html
├── tentang.html
├── pesan.html                 # form pesan + daftar pesanan
├── css/style.css
├── js/script.js               # navbar, footer, produk, dsb.
├── js/pesan.js                # logika form pesan (load setelah script.js)
├── assets/                    # logo & foto
├── backend/
│   ├── server.js              # API Express
│   ├── package.json
│   ├── package-lock.json
│   ├── schema.sql             # buat database + tabel pesanan
│   └── .env.example           # contoh variabel environment (bukan rahasia)
└── deploy/
    ├── nginx-kopi-sudut.conf  # server block Nginx
    ├── nginx-ratelimit.conf   # limit_req_zone (context http)
    ├── kopi-sudut-api.service # unit systemd
    └── db-setup.sql           # buat user DB kopi_app (MariaDB)
```

---

## Setup Server (urutan yang benar)

> Asumsi: Ubuntu, repo sudah di-clone ke `/var/www/html`, dijalankan sebagai
> user yang punya `sudo`.

### 1) Instal MariaDB

```bash
sudo apt update
sudo apt install -y mariadb-server
sudo systemctl enable --now mariadb
```

### 2) Buat database & tabel

```bash
sudo mysql < /var/www/html/backend/schema.sql
```

### 3) Buat user database aplikasi

**Penting:** di server, edit dulu `deploy/db-setup.sql` dan ganti
placeholder `GANTI_DENGAN_PASSWORD_KUAT` dengan password kuat **asli**.
Jangan pernah men-commit password asli ke repo.

```bash
sudo mysql < /var/www/html/deploy/db-setup.sql
```

### 4) Instal Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version   # pastikan >= 18 (Node 20 disarankan)
```

### 5) Siapkan file .env

```bash
cd /var/www/html/backend
sudo cp .env.example .env
sudo nano .env        # isi DB_USER=kopi_app dan DB_PASSWORD=<password asli>
sudo chown www-data:www-data .env
sudo chmod 600 .env
```

Contoh isi `.env` (jangan di-commit):

```
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=kopi_app
DB_PASSWORD=<password-asli-di-server>
DB_NAME=kopi_sudut
```

### 6) Instal dependensi backend (produksi saja)

```bash
cd /var/www/html/backend
sudo npm ci --omit=dev
```

### 7) Hak akses folder website

```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

### 8) Jalankan service systemd

```bash
sudo cp /var/www/html/deploy/kopi-sudut-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now kopi-sudut-api
sudo systemctl status kopi-sudut-api
```

### 9) Konfigurasi Nginx

```bash
sudo cp /var/www/html/deploy/nginx-ratelimit.conf /etc/nginx/conf.d/ratelimit.conf
sudo cp /var/www/html/deploy/nginx-kopi-sudut.conf /etc/nginx/sites-available/kopi-sudut
sudo ln -sf /etc/nginx/sites-available/kopi-sudut /etc/nginx/sites-enabled/kopi-sudut
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 10) Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3306/tcp        # MariaDB TIDAK boleh terbuka ke publik
sudo ufw enable
sudo ufw status
```

Port **3306 tidak boleh dibuka** ke internet. API mengakses database lewat
`127.0.0.1`, jadi tidak perlu akses luar.

---

## Menjalankan Lokal (untuk pengembangan)

```bash
# 1) Backend
cd kopi-sudut/backend
cp .env.example .env      # isi sesuai MariaDB lokal kamu (atau biarkan kosong)
npm install
npm start                 # http://127.0.0.1:3000

# 2) Frontend (serve file statis apa pun)
cd kopi-sudut
python3 -m http.server 8000
# buka http://localhost:8000
```

Catatan: jika backend/DB tidak menyala, halaman `pesan.html` tetap tampil dan
menampilkan pesan ramah (tidak error). Tombol WhatsApp tetap berfungsi.

---

## Referensi API

### `POST /api/pesanan`

Body JSON:

```json
{
  "nama_pelanggan": "Budi Santoso",
  "no_whatsapp": "081234567890",
  "produk": "Kopi Susu Gula Aren",
  "jumlah": 2,
  "catatan": "less sugar"
}
```

Aturan validasi:

| Field            | Aturan                                                        |
|------------------|---------------------------------------------------------------|
| `nama_pelanggan` | string, 2–60 karakter                                         |
| `no_whatsapp`    | string; spasi/dash/`+` di awal dibuang; harus cocok `^(08|62)\d{7,13}$` (9–15 digit) |
| `produk`         | salah satu dari 6 produk: Kopi Susu Gula Aren, Iced Americano, Iced Cappuccino, Matcha Latte, Iced Chocolate, Thai Tea |
| `jumlah`         | bilangan bulat 1–20                                           |
| `catatan`        | opsional, maksimal 200 karakter                               |

Respons:

- `201 {"ok":true}` — berhasil disimpan
- `400 {"error":"..."}` — kesalahan validasi (pesan Bahasa Indonesia)
- `400 {"error":"Format data tidak valid."}` — body JSON rusak
- `500 {"error":"Terjadi kesalahan server."}` — error server/DB (tanpa detail)

### `GET /api/pesanan`

Mengembalikan **15 pesanan terbaru** sebagai array JSON:

```json
[
  {
    "id": 1,
    "nama": "Budi S.",
    "produk": "Kopi Susu Gula Aren",
    "jumlah": 2,
    "catatan": "less sugar",
    "dibuat_pada": "2026-10-21T09:00:00.000Z"
  }
]
```

- `nama` disamarkan (nama depan + huruf awal kata terakhir + titik).
- **`no_whatsapp` tidak pernah dikembalikan.**

### `GET /health`

Mengecek API + database (`SELECT 1` dengan timeout ±2 detik).

- `200 {"status":"OK","database":"connected"}`
- `503 {"status":"ERROR","database":"disconnected"}`

Detail error hanya ditulis ke log server (journald), tidak ke response.

---

## Checklist Verifikasi (curl)

```bash
# 1) Health (lewat Nginx atau langsung ke Node)
curl -i http://127.0.0.1:3000/health
curl -i http://<IP-SERVER>/health

# 2) Kirim pesanan valid
curl -i -X POST http://127.0.0.1:3000/api/pesanan \
  -H "Content-Type: application/json" \
  -d '{"nama_pelanggan":"Budi Santoso","no_whatsapp":"081234567890","produk":"Iced Americano","jumlah":1,"catatan":""}'
# harapan: HTTP 201 {"ok":true}

# 3) Validasi gagal (contoh: nomor salah)
curl -i -X POST http://127.0.0.1:3000/api/pesanan \
  -H "Content-Type: application/json" \
  -d '{"nama_pelanggan":"Budi","no_whatsapp":"123","produk":"Iced Americano","jumlah":1}'
# harapan: HTTP 400 + pesan error

# 4) Lihat daftar pesanan
curl -s http://127.0.0.1:3000/api/pesanan

# 5) Uji /health saat DB mati
sudo systemctl stop mariadb
curl -i http://127.0.0.1:3000/health      # harapan: 503 dalam ~2 detik
sudo systemctl start mariadb
curl -i http://127.0.0.1:3000/health      # harapan: 200 OK
```

---

## Troubleshooting

- **API tidak jalan / error:**
  `sudo journalctl -u kopi-sudut-api -f`
  (cek pesan `Environment variable hilang`, akses `.env`, atau error DB).
- **Cek konfigurasi Nginx:** `sudo nginx -t`, lalu `sudo systemctl reload nginx`.
- **Cek apakah API mendengar di 3000:** `sudo ss -tlnp | grep 3000`.
- **Cek izin .env:** `sudo ls -l /var/www/html/backend/.env` → harus
  `www-data` dan `-rw-------` (600).
- **Form gagal kirim / `pesan.html` bilang "tidak bisa terhubung":**
  pastikan service aktif (`systemctl status kopi-sudut-api`) dan Nginx meneruskan
  `/api/`.
- **/health 503 padahal MariaDB hidup:** cek `DB_USER`/`DB_PASSWORD` di `.env`
  cocok dengan user `kopi_app`, dan user punya grant `SELECT, INSERT`.
- **Respons 403 dari Nginx:** path seperti `/backend/`, `/deploy/`, dan dotfile
  memang sengaja diblok.
- **Firewall:** pastikan **dua lapis** terbuka untuk 80/443:
  - `ufw status`
  - *Security group / firewall* di panel penyedia cloud (mis. AWS SG,
    GCP firewall rule, DigitalOcean firewall). Port 3306 tetap ditutup di keduanya.

---

## Catatan Keamanan

- Password DB hanya ada di `.env` (tidak di-commit, `chmod 600`, milik `www-data`).
- `.env.example` hanya berisi placeholder kosong.
- Semua query memakai prepared statement (parameterized).
- Input divalidasi ulang di server; pesan error tidak membocorkan SQL/stack trace.
- Nama pelanggan disamarkan pada daftar publik; nomor WhatsApp tidak pernah dikirim ke frontend.
- Rate limit `/api/pesanan` (5 request/menit per IP, burst 5).

> Fitur MariaDB diuji secara lokal untuk validasi & perilaku error
> (tanpa DB aktif). Uji alur penyimpanan penuh (INSERT + SELECT) harus
> dilakukan di server yang sudah punya MariaDB.