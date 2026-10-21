-- ============================================================
--  Kopi Sudut - pembuatan user database aplikasi (MariaDB)
-- ============================================================
--
--  !! PERINGATAN  !!
--  Jalankan file ini SETELAH backend/schema.sql (database &
--  tabel `pesanan` harus sudah ada lebih dulu).
--
--  Password di bawah ini HANYA PLACEHOLDER:
--      GANTI_DENGAN_PASSWORD_KUAT
--  Ganti password tersebut LANGSUNG di server (edit file di
--  server, buka editor teks) -- JANGAN pernah commit file ini
--  dengan password asli. Password asli juga harus sama dengan
--  nilai DB_PASSWORD pada /var/www/html/backend/.env.
--
--  Untuk MariaDB (bukan MySQL). Jalankan sebagai root:
--      sudo mysql < /var/www/html/deploy/db-setup.sql
-- ============================================================

-- Buat user khusus aplikasi (hanya bisa dari localhost)
CREATE USER IF NOT EXISTS 'kopi_app'@'localhost' IDENTIFIED BY 'GANTI_DENGAN_PASSWORD_KUAT';

-- Beri akses minimal: hanya SELECT & INSERT pada tabel pesanan
GRANT SELECT, INSERT ON kopi_sudut.pesanan TO 'kopi_app'@'localhost';

FLUSH PRIVILEGES;