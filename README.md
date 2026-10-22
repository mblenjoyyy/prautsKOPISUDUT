# Proyek Cloud Computing: Migrasi Aplikasi "Kopi Sudut"

Proyek ini merupakan implementasi migrasi web aplikasi untuk UMKM "Kopi Sudut" menuju infrastruktur Tencent Cloud VPS (Region: Jakarta, Indonesia). Proyek dirancang untuk memenuhi spesifikasi tugas mata kuliah Cloud Computing.

## Anggota Tim & Peran

1.  **Roi bafi** - Cloud Architect
2.  **Adryan achmad f** - Infrastructure Engineer
3.  **joshua anwar** - Security & Governance Officer
4.  **Faiz maulana W** - Cost & Operations Analyst

## Arsitektur Sistem

Aplikasi menggunakan arsitektur frontend-backend yang di-*deploy* dalam satu Virtual Machine (VM):

*   **Web Server & Reverse Proxy:** Nginx (Port 80/443).
*   **Backend API:** Node.js (Port lokal 3000).
*   **Database:** MariaDB (Hanya dapat diakses dari `127.0.0.1`).

## Implementasi Keamanan

*   **Firewall:** UFW mengizinkan port 22 (SSH), 80 (HTTP), dan 443 (HTTPS). Port 3306 (MariaDB) ditutup untuk akses publik.
*   **SSL/HTTPS:** Dikonfigurasi menggunakan sertifikat SSL (Certbot/Let's Encrypt).
*   **Access Control:** Nginx memblokir akses publik ke direktori sensitif (`/backend/`, `/.git/`).
*   **Manajemen Kredensial:** Konfigurasi database diamankan di file `.env` (permission 600) dan diabaikan dari repositori melalui `.gitignore`.

## Runbook: Panduan Deployment

### 1. Kloning Repositori

```bash
cd /var/www/html
sudo git pull origin main
