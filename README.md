# Kopi Sudut - Tugas Praktikum Cloud Computing

Website company profile dan katalog menu statis untuk UMKM Kopi Sudut.
Dibuat menggunakan HTML5, CSS3, dan Vanilla JS.

## Cara Instalasi (Deployment ke VPS Ubuntu Nginx)

1. Perbarui sistem dan instal Nginx beserta Git:
   `sudo apt update && sudo apt install nginx git -y`

2. Kosongkan folder bawaan Nginx:
   `sudo rm -rf /var/www/html/*`

3. Tarik (clone) repository ini ke dalam folder web server:
   `sudo git clone https://github.com/link-repo-kalian/kopi-sudut.git /var/www/html`

4. Berikan hak akses kepada Nginx:
   `sudo chown -R www-data:www-data /var/www/html`
   `sudo chmod -R 755 /var/www/html`

5. Buka IP Publik VPS di browser untuk melihat hasilnya.