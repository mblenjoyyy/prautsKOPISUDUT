/**
 * Script untuk halaman Pesan Online (pesan.html).
 * Di-load AFTER js/script.js agar PRODUK tersedia.
 * Melakukan populate dropdown, submit form via API, dan reload daftar pesanan.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Referensi DOM - deklarasikan paling awal agar aman dipakai di mana pun
  const produkSelect = document.getElementById("produk");
  const pesanForm = document.getElementById("pesanForm");
  const pesanBtn = document.getElementById("pesanBtn");
  const orderList = document.getElementById("orderList");
  const namaInput = document.getElementById("namaPelanggan");
  const whatsappInput = document.getElementById("noWhatsApp");
  const formMessage = document.getElementById("formMessage");

  // Pastikan PRODUK tersedia dari script.js (sudah di-load sebelumnya)
  if (typeof PRODUK === "undefined") {
    console.error("❌ PRODUK belum tersedia. Pastikan script.js sudah dimuat dulu.");
    if (orderList) {
      orderList.textContent = "";
      const p = document.createElement("p");
      p.className = "no-data";
      p.textContent = "Gagal memuat data produk. Muat ulang halaman.";
      orderList.appendChild(p);
    }
    return;
  }

  // Fungsi: populate dropdown dari array PRODUK
  function populateProdukDropdown() {
    const fragment = document.createDocumentFragment();

    PRODUK.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.nama;
      option.textContent = p.nama;
      fragment.appendChild(option);
    });

    produkSelect.innerHTML = "";
    produkSelect.appendChild(fragment);
  }

  // Fungsi: tampilkan pesan di form (success/error)
  function showFormMessage(text, isSuccess) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className = `form-message form-message${isSuccess ? "--success" : "--error"}`;
    formMessage.style.display = "block";
  }

  // Fungsi: sembunyikan pesan form setelah waktu tertentu
  function hideFormMessage() {
    if (!formMessage) return;
    setTimeout(() => {
      formMessage.style.display = "none";
    }, 5000);
  }

  // Fungsi: render daftar pesanan ke DOM menggunakan DOM APIs (tidak innerHTML)
  function renderOrderList(orders) {
    orderList.innerHTML = "";

    if (!orders || orders.length === 0) {
      const p = document.createElement("p");
      p.className = "no-data";
      p.textContent = "Belum ada pesanan terbaru.";
      orderList.appendChild(p);
      return;
    }

    const ul = document.createElement("ul");
    ul.className = "order-list-entries";

    orders.forEach((order) => {
      const li = document.createElement("li");
      li.className = "order-item";

      // Nama pelanggan (already masked di API)
      const namaSpan = document.createElement("span");
      namaSpan.className = "order-name";
      namaSpan.textContent = order.nama;
      li.appendChild(namaSpan);

      // Produk
      const produkSpan = document.createElement("span");
      produkSpan.className = "order-produk";
      produkSpan.textContent = order.produk;
      li.appendChild(produkSpan);

      // Jumlah
      const jumlahSpan = document.createElement("span");
      jumlahSpan.className = "order-jumlah";
      jumlahSpan.textContent = `${order.jumlah} cup`;
      li.appendChild(jumlahSpan);

      // Catatan (jika ada)
      if (order.catatan) {
        const noteSpan = document.createElement("span");
        noteSpan.className = "order-note";
        noteSpan.textContent = order.catatan;
        li.appendChild(noteSpan);
      }

      // Waktu dibuat (dibuat_pada formatted)
      const waktuSpan = document.createElement("span");
      waktuSpan.className = "order-time";
      const date = new Date(order.dibuat_pada);
      waktuSpan.textContent = date.toLocaleString("id-ID");
      li.appendChild(waktuSpan);

      ul.appendChild(li);
    });

    orderList.appendChild(ul);
  }

  // Fungsi: fetch GET /api/pesanan dan render list
  async function loadOrderList() {
    try {
      const response = await fetch("/api/pesanan");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const orders = await response.json();
      renderOrderList(orders);
    } catch (error) {
      // API tidak reachable (misal backend mati, atau running locally tanpa server)
      console.warn("⚠️ Tidak bisa memuat daftar pesanan:", error);
      showFormMessage("Tidak bisa terhubung ke server backend. Fungsi WhatsApp tetap tersedia.", false);
      // Bersihkan lalu tampilkan pesan "belum ada" sebagai teks (bukan HTML)
      orderList.textContent = "";
      const p = document.createElement("p");
      p.className = "no-data";
      p.textContent = "Belum ada pesanan terbaru.";
      orderList.appendChild(p);
    }
  }

  // Fungsi: submit form via fetch POST /api/pesanan
  async function handleSubmit(event) {
    event.preventDefault();

    // Disable tombol sementara dan sembunyikan pesan lama
    pesanBtn.disabled = true;
    pesanBtn.textContent = "Mengirim...";
    if (formMessage) {
      formMessage.style.display = "none";
    }

    const formData = {
      nama_pelanggan: namaInput.value.trim(),
      no_whatsapp: whatsappInput.value.trim(),
      produk: produkSelect.value,
      jumlah: Number(document.getElementById("jumlah").value),
      catatan: document.getElementById("catatan").value.trim(),
    };

    try {
      const response = await fetch("/api/pesanan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Success: tampilkan pesan, reset form, reload list
        showFormMessage("Pesanan berhasil dikirim!", true);
        hideFormMessage();
        namaInput.value = "";
        whatsappInput.value = "";
        produkSelect.selectedIndex = 0;
        document.getElementById("jumlah").value = "1";
        document.getElementById("catatan").value = "";
        loadOrderList();
      } else {
        // Error dari server (validasi 400)
        const errorData = await response.json();
        showFormMessage(errorData.error || "Gagal mengirim pesanan. Cek inputannya.", false);
      }
    } catch (err) {
      console.error("❌ Error kirim form:", err);
      showFormMessage("Tidak bisa terhubung ke server. Pastikan backend menyala.", false);
    } finally {
      // Re-enable tombol
      pesanBtn.disabled = false;
      pesanBtn.textContent = "Kirim Pesanan";
    }
  }

  // Inisialisasi
  populateProdukDropdown();
  loadOrderList();

  // Event listener form
  pesanForm.addEventListener("submit", handleSubmit);
});