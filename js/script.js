

const KONFIGURASI = {
  namaBrand: "Kopi Sudut",
 
  whatsapp: "6281696969666",
  kontak: {
    telepon: "+62 81696966699",
    email: "kopisudut@gmail.com",
    alamat: "Jl. Anggrek No. 12, Sudut Kota",
    jam: "09.00 - 22.00 WIB",
  },
  
  sosial: [
    { nama: "Instagram", handle: "@kopisudut", url: "#" },
    { nama: "TikTok", handle: "@kopisudut", url: "#" },
    { nama: "Facebook", handle: "Kopi Sudut", url: "#" },
  ],
  kelompok: {
    nomor: "05",
    anggota: [
      "Adryan Achmad Firstiansyah — 241011701119",
      "Roi Bafi — 241011701128",
      "Faiz Maulana Wahid — 241011701097",
      "Joshua Anwar — 241011700310",
    ],
  },
};


const PRODUK = [
  {
    id: "kopi-susu-gula-aren",
    nama: "Kopi Susu Gula Aren",
    kategori: "kopi",
    harga: 18000,
    deskripsi: "Espresso, susu segar, dan gula aren asli Indonesia.",
    gambar: "assets/products/hero-coffe.png",
    alt: "Minuman kopi susu gula aren dalam gelas dengan lapisan gula aren dan susu.",
    badge: "Best Seller",
    favorit: true,
  },
  {
    id: "iced-americano",
    nama: "Iced Americano",
    kategori: "kopi",
    harga: 15000,
    deskripsi: "Kopi espresso murni dengan air dingin dan es batu segar.",
    gambar: "assets/products/iced-americano.png",
    alt: "Iced americano dalam gelas bening berisi es batu dan espresso hitam.",
    favorit: true,
  },
  {
    id: "iced-cappuccino",
    nama: "Iced Cappuccino",
    kategori: "kopi",
    harga: 20000,
    deskripsi: "Espresso bold dengan susu berbusa lembut dan seimbang.",
    gambar: "assets/products/iced-cappucino.jpg",
    alt: "Iced cappuccino dengan lapisan busa susu lembut dan taburan cokelat.",
    favorit: true,
  },
  {
    id: "matcha-latte",
    nama: "Matcha Latte",
    kategori: "non-kopi",
    harga: 20000,
    deskripsi: "Minuman matcha Jepang autentik berpadu susu creamy.",
    gambar: "assets/products/matcha-latte.jpg",
    alt: "Matcha latte hijau segar berpadu susu dalam gelas bening.",
    favorit: true,
  },
  {
    id: "iced-chocolate",
    nama: "Iced Chocolate",
    kategori: "non-kopi",
    harga: 17000,
    deskripsi: "Cokelat pekat pilihan berkualitas dengan susu creamy lembut.",
    gambar: "assets/products/iced-chocolate.png",
    alt: "Iced chocolate dengan sirup cokelat pekat dan susu creamy.",
    favorit: true,
  },
  {
    id: "thai-tea",
    nama: "Thai Tea",
    kategori: "non-kopi",
    harga: 16000,
    deskripsi: "Teh Thailand manis legit dengan susu dan es yang menyegarkan.",
    gambar: "assets/products/thai-tea.jpg",
    alt: "Thai tea berwarna oranye khas disajikan dingin dengan susu.",
    favorit: false,
  },
];


const ICON_WHATSAPP =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>' +
  "</svg>";


function formatHarga(nilai) {
  return "Rp " + nilai.toLocaleString("id-ID");
}

function pesanWhatsAppUrl(namaProduk) {
  const pesan = `Halo ${KONFIGURASI.namaBrand}, saya ingin memesan ${namaProduk}.`;
  return `https://wa.me/${KONFIGURASI.whatsapp}?text=${encodeURIComponent(pesan)}`;
}

function pesanUmumUrl() {
  const pesan = `Halo ${KONFIGURASI.namaBrand}, saya ingin memesan.`;
  return `https://wa.me/${KONFIGURASI.whatsapp}?text=${encodeURIComponent(pesan)}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}


function renderNavbar(halamanAktif) {
  const linkBeranda = `<a class="nav__link${halamanAktif === "beranda" ? " is-active" : ""}" href="index.html">Beranda</a>`;
  const linkMenu = `<a class="nav__link${halamanAktif === "menu" ? " is-active" : ""}" href="menu.html">Menu</a>`;
  const linkTentang = `<a class="nav__link${halamanAktif === "tentang" ? " is-active" : ""}" href="tentang.html">Tentang Kami</a>`;
  const linkPesanAttr = halamanAktif === "pesan" ? ' aria-current="page"' : "";

  const header = document.getElementById("site-header");
  if (!header) return;

  header.innerHTML = `
    <nav class="navbar container" aria-label="Navigasi utama">
      <a class="brand" href="index.html">
        <img src="assets/logo.svg" alt="Logo ${KONFIGURASI.namaBrand}" width="32" height="32" />
        <span>${KONFIGURASI.namaBrand}</span>
      </a>
      <ul class="nav">
        <li>${linkBeranda}</li>
        <li>${linkMenu}</li>
        <li>${linkTentang}</li>
      </ul>
      <div class="nav__actions">
        <a class="btn btn--nav-online nav__cta"${linkPesanAttr} href="pesan.html">Pesan Online</a>
        <a class="btn btn--whatsapp nav__cta" href="${pesanUmumUrl()}" target="_blank" rel="noopener noreferrer">
          ${ICON_WHATSAPP}<span>Pesan Sekarang</span>
        </a>
      </div>
      <button class="nav__toggle" type="button" aria-controls="nav-panel" aria-expanded="false" aria-label="Buka menu navigasi">
        <span class="nav__toggle-bar"></span>
        <span class="nav__toggle-bar"></span>
        <span class="nav__toggle-bar"></span>
      </button>
    </nav>
    <div class="nav__panel container" id="nav-panel">
      ${linkBeranda}
      ${linkMenu}
      ${linkTentang}
      <a class="btn btn--nav-online nav__cta"${linkPesanAttr} href="pesan.html">Pesan Online</a>
      <a class="btn btn--whatsapp nav__cta" href="${pesanUmumUrl()}" target="_blank" rel="noopener noreferrer">
        ${ICON_WHATSAPP}<span>Pesan Sekarang</span>
      </a>
    </div>
  `;
}

/* ---------- Render Footer ---------- */
function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  const sosial = KONFIGURASI.sosial
    .map(
      (s) =>
        `<a class="footer__link" href="${s.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.nama)} (${escapeHtml(s.handle)})</a>`
    )
    .join("");

  const anggota = KONFIGURASI.kelompok.anggota
    .map((a) => `<span>${escapeHtml(a)}</span>`)
    .join("");

  footer.innerHTML = `
    <div class="container footer__grid">
      <div class="footer__col">
        <span class="footer__brand">
          <img src="assets/logo.svg" alt="" width="32" height="32" />
          <span>${KONFIGURASI.namaBrand}</span>
        </span>
        <p class="footer__text">
          ${KONFIGURASI.namaBrand} — kopi enak, harga bersahabat. Teman terbaik untuk setiap aktivitasmu.
        </p>
      </div>
      <div class="footer__col">
        <span class="footer__heading">Kontak</span>
        <span class="footer__link">${escapeHtml(KONFIGURASI.kontak.telepon)}</span>
        <a class="footer__link" href="mailto:${escapeHtml(KONFIGURASI.kontak.email)}">${escapeHtml(KONFIGURASI.kontak.email)}</a>
        <span class="footer__link">${escapeHtml(KONFIGURASI.kontak.alamat)}</span>
        <span class="footer__link">Buka: ${escapeHtml(KONFIGURASI.kontak.jam)}</span>
      </div>
      <div class="footer__col">
        <span class="footer__heading">Ikuti Kami</span>
        ${sosial}
      </div>
    </div>
    <div class="container footer__bottom">
      <p><strong>Kelompok ${escapeHtml(KONFIGURASI.kelompok.nomor)}</strong></p>
      <div class="footer__members">${anggota}</div>
    </div>
  `;
}

/* ---------- Render Kartu Produk ---------- */
function kartuProduk(produk) {
  const badge = produk.badge ? `<span class="card__badge">${escapeHtml(produk.badge)}</span>` : "";
  return `
    <article class="card" data-kategori="${produk.kategori}">
      <div class="card__media">
        <img class="card__img" src="${produk.gambar}" alt="${escapeHtml(produk.alt)}" loading="lazy" />
        ${badge}
      </div>
      <div class="card__body">
        <h3 class="card__title">${escapeHtml(produk.nama)}</h3>
        <p class="card__desc">${escapeHtml(produk.deskripsi)}</p>
        <div class="card__foot">
          <span class="card__price">${formatHarga(produk.harga)}</span>
          <a class="card__order" href="${pesanWhatsAppUrl(produk.nama)}" target="_blank" rel="noopener noreferrer" aria-label="Pesan ${escapeHtml(produk.nama)} via WhatsApp">
            ${ICON_WHATSAPP}<span>Pesan</span>
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderFavorit() {
  const container = document.getElementById("menu-favorit");
  if (!container) return;
  const favorit = PRODUK.filter((p) => p.favorit);
  container.innerHTML = favorit.map(kartuProduk).join("");
}

function renderMenu() {
  const gridKopi = document.getElementById("grid-kopi");
  const gridNonKopi = document.getElementById("grid-non-kopi");

  if (gridKopi) {
    gridKopi.innerHTML = PRODUK.filter((p) => p.kategori === "kopi").map(kartuProduk).join("");
  }
  if (gridNonKopi) {
    gridNonKopi.innerHTML = PRODUK.filter((p) => p.kategori === "non-kopi").map(kartuProduk).join("");
  }
}

/* ---------- Filter kategori (halaman menu) ---------- */
function setupFilter() {
  const filter = document.getElementById("filter-kategori");
  if (!filter) return;

  const sections = [
    document.getElementById("section-kopi"),
    document.getElementById("section-nonkopi"),
  ].filter(Boolean);

  filter.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;

    filter.querySelectorAll(".chip").forEach((c) => {
      c.classList.remove("is-active");
      c.setAttribute("aria-pressed", "false");
    });
    chip.classList.add("is-active");
    chip.setAttribute("aria-pressed", "true");

    const kategori = chip.dataset.filter;
    sections.forEach((section) => {
      const cocok = kategori === "semua" || section.dataset.kategori === kategori;
      section.hidden = !cocok;
    });
  });
}

/* ---------- Mobile navigation toggle ---------- */
function setupMobileNav() {
  const header = document.getElementById("site-header");
  if (!header) return;

  header.addEventListener("click", (e) => {
    const toggle = e.target.closest(".nav__toggle");
    if (toggle) {
      const isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      return;
    }

    if (e.target.closest(".nav__link") || e.target.closest(".nav__cta")) {
      header.classList.remove("nav-open");
      const toggle = header.querySelector(".nav__toggle");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const halaman = document.body.dataset.page || "beranda";
  renderNavbar(halaman);
  renderFooter();
  renderFavorit();
  renderMenu();
  setupFilter();
  setupMobileNav();

  document.querySelectorAll(".js-wa-umum").forEach((a) => {
    a.href = pesanUmumUrl();
  });
});
