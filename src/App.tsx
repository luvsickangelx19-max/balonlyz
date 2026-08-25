import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  CircleUserRound,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  Zap,
} from 'lucide-react';

const WHATSAPP_NUMBER = '6285864107298';
const INSTAGRAM_URL = 'https://instagram.com/balonlyz';
const LOGO = '/Balloonlyz-modified.png';

const photos = [
  'https://images.pexels.com/photos/28786205/pexels-photo-28786205.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/17285664/pexels-photo-17285664.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/17330085/pexels-photo-17330085.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/37853897/pexels-photo-37853897.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7910901/pexels-photo-7910901.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

type Kategori = 'Semua' | 'Ulang Tahun' | 'Wisuda' | 'Romantis' | 'Bayi' | 'Perayaan';
type Produk = { id: number; nama: string; kategori: Kategori; harga: number; gambar: string; deskripsi: string; badge?: string; warna: string[] };
type ItemKeranjang = Produk & { jumlah: number };

const daftarKategori: { nama: Kategori; label: string }[] = [
  { nama: 'Semua', label: 'Semua' },
  { nama: 'Ulang Tahun', label: 'Ulang Tahun' },
  { nama: 'Wisuda', label: 'Wisuda' },
  { nama: 'Romantis', label: 'Romantis' },
  { nama: 'Bayi', label: 'Bayi' },
  { nama: 'Perayaan', label: 'Perayaan' },
];

const produkList: Produk[] = [
  { id: 1, nama: 'Bucket Ulang Tahun Manis', kategori: 'Ulang Tahun', harga: 285000, gambar: photos[0], deskripsi: 'Balon pastel, bunga segar, dan kejutan kecil dalam satu bucket.', badge: 'Terlaris', warna: ['Pink lembut', 'Kuning mentega', 'Putih'] },
  { id: 2, nama: 'Bucket Ulang Tahun Pink', kategori: 'Ulang Tahun', harga: 245000, gambar: photos[1], deskripsi: 'Susunan balon pink untuk orang spesial di hari spesialnya.', warna: ['Pink', 'Lila', 'Peach'] },
  { id: 3, nama: 'Bucket Wisuda', kategori: 'Wisuda', harga: 310000, gambar: photos[2], deskripsi: 'Rayakan kelulusan dengan bucket balon yang berkesan.', badge: 'Baru', warna: ['Lila', 'Biru', 'Putih'] },
  { id: 4, nama: 'Bucket Bayi Perempuan', kategori: 'Bayi', harga: 275000, gambar: photos[3], deskripsi: 'Balon lembut untuk menyambut buah hati baru.', warna: ['Pink lembut', 'Krim', 'Sage'] },
  { id: 5, nama: 'Bucket Balon Romantis', kategori: 'Romantis', harga: 325000, gambar: photos[4], deskripsi: 'Kejutan manis dengan balon dan bunga untuk orang tersayang.', badge: 'Untuk Dia', warna: ['Merah', 'Pink', 'Putih'] },
  { id: 6, nama: 'Bucket Anniversary', kategori: 'Romantis', harga: 350000, gambar: photos[0], deskripsi: 'Peringatkan hari spesial kalian dengan bucket balon yang romantis.', warna: ['Pink', 'Putih', 'Merah'] },
  { id: 7, nama: 'Bucket Selamat', kategori: 'Perayaan', harga: 295000, gambar: photos[2], deskripsi: 'Ucapkan selamat dengan balon ceria dan penuh warna.', badge: 'Baru', warna: ['Kuning', 'Biru', 'Putih'] },
  { id: 8, nama: 'Bucket Cepat Sembuh', kategori: 'Perayaan', harga: 265000, gambar: photos[3], deskripsi: 'Balon ceria untuk membuat hari pemulihan jadi lebih hangat.', warna: ['Lavender', 'Kuning', 'Putih'] },
];

const formatHarga = (harga: number) => `Rp ${harga.toLocaleString('id-ID')}`;
const urlWa = (pesan: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pesan)}`;
const pesanDefault = (produk: Produk, jumlah = 1) => `Halo kak, saya mau pesan Balloon Bucket dari Balonlyz\n\nProduk: ${produk.nama}\nHarga: ${formatHarga(produk.harga)}\nJumlah: ${jumlah}\nWarna: \nTulisan: \nCatatan: \n\nMohon info ketersediaan dan total pesanannya ya kak. Terima kasih`;

function App() {
  const [kategoriTerpilih, setKategoriTerpilih] = useState<Kategori>('Semua');
  const [produkTerpilih, setProdukTerpilih] = useState<Produk | null>(null);
  const [keranjang, setKeranjang] = useState<ItemKeranjang[]>(() => {
    try { return JSON.parse(localStorage.getItem('balonlyz-cart') || '[]') as ItemKeranjang[]; } catch { return []; }
  });
  const [keranjangBuka, setKeranjangBuka] = useState(false);
  const [menuBuka, setMenuBuka] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [tampilkanIosHint, setTampilkanIosHint] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { localStorage.setItem('balonlyz-cart', JSON.stringify(keranjang)); }, [keranjang]);
  useEffect(() => {
    const handler = (event: Event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2500); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => {
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isIos && !isStandalone) {
      const dismissed = localStorage.getItem('balonlyz-ios-hint-dismissed') !== 'true';
      if (dismissed) setTampilkanIosHint(true);
    }
  }, []);
  const tutupIosHint = () => { setTampilkanIosHint(false); localStorage.setItem('balonlyz-ios-hint-dismissed', 'true'); };

  const produkTerfilter = useMemo(() => kategoriTerpilih === 'Semua' ? produkList : produkList.filter((produk) => produk.kategori === kategoriTerpilih), [kategoriTerpilih]);
  const jumlahKeranjang = keranjang.reduce((total, item) => total + item.jumlah, 0);
  const subtotal = keranjang.reduce((total, item) => total + item.harga * item.jumlah, 0);

  const gulirKe = (id: string) => { setMenuBuka(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  const tambahKeKeranjang = (produk: Produk) => {
    setKeranjang((items) => items.some((item) => item.id === produk.id) ? items.map((item) => item.id === produk.id ? { ...item, jumlah: item.jumlah + 1 } : item) : [...items, { ...produk, jumlah: 1 }]);
    setToast(`${produk.nama} masuk keranjang`);
  };
  const ubahJumlah = (id: number, selisih: number) => setKeranjang((items) => items.map((item) => item.id === id ? { ...item, jumlah: Math.max(0, item.jumlah + selisih) } : item).filter((item) => item.jumlah > 0));
  const pesanKeranjang = () => {
    const pesan = `Halo kak, saya mau pesan beberapa Balloon Gift dari Balonlyz\n\n${keranjang.map((item) => `- ${item.nama} (${item.jumlah}x) - ${formatHarga(item.harga * item.jumlah)}`).join('\n')}\n\nSubtotal: ${formatHarga(subtotal)}\nCatatan: \n\nMohon info ketersediaan dan total pesanannya ya kak. Terima kasih`;
    window.open(urlWa(pesan), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#ffe4f0] text-[#4a2535]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f9c6db] bg-[#ffe4f0]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-10">
          <button onClick={() => gulirKe('beranda')} aria-label="Beranda Balonlyz" className="h-9 w-20 overflow-hidden sm:h-11 sm:w-24"><img src={LOGO} alt="Balonlyz" className="h-full w-full object-contain" /></button>
          <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#9c4e6e] md:flex">
            <button onClick={() => gulirKe('belanja')} className="nav-link">Belanja</button><button onClick={() => gulirKe('custom')} className="nav-link">Custom</button><button onClick={() => gulirKe('tentang')} className="nav-link">Tentang</button><button onClick={() => gulirKe('kontak')} className="nav-link">Kontak</button>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2"><button onClick={() => setKeranjangBuka(true)} className="relative rounded-full p-2.5 transition hover:bg-[#fff0f6] sm:p-3" aria-label="Buka keranjang"><ShoppingBag size={18} strokeWidth={1.7} />{jumlahKeranjang > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ec3e7e] px-1 text-[9px] font-bold text-white">{jumlahKeranjang}</span>}</button><button className="hidden rounded-full bg-[#ec3e7e] px-5 py-2.5 text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(236,62,126,.25)] transition hover:-translate-y-0.5 hover:bg-[#d62a6c] sm:block" onClick={() => window.open(urlWa('Halo kak, saya mau tanya tentang balloon gift Balonlyz'), '_blank', 'noopener,noreferrer')}>Chat WhatsApp</button><button onClick={() => setMenuBuka(!menuBuka)} className="rounded-full p-2 md:hidden" aria-label="Buka menu">{menuBuka ? <X size={22} /> : <Menu size={22} />}</button></div>
        </div>
        {menuBuka && <div className="border-t border-[#f9c6db] bg-[#ffe4f0] px-5 py-4 md:hidden"><div className="flex flex-col gap-4 text-sm text-[#9c4e6e]"><button onClick={() => gulirKe('belanja')} className="text-left">Belanja</button><button onClick={() => gulirKe('custom')} className="text-left">Custom</button><button onClick={() => gulirKe('tentang')} className="text-left">Tentang</button><button onClick={() => gulirKe('kontak')} className="text-left">Kontak</button><button onClick={() => window.open(urlWa('Halo kak, saya mau tanya tentang balloon gift Balonlyz'), '_blank', 'noopener,noreferrer')} className="rounded-full bg-[#ec3e7e] px-5 py-3 text-center text-[12px] font-semibold text-white">Chat WhatsApp</button></div></div>}
      </header>

      <main>
        <section id="beranda" className="relative mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-5 sm:pb-16 sm:pt-28 lg:px-10 lg:pb-20 lg:pt-36">
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14">
            <div className="max-w-xl">
              <h1 className="font-serif text-[2.4rem] leading-[1.02] tracking-[-.04em] text-[#5c1f3a] sm:text-5xl lg:text-[4rem]">Hadiah balon untuk setiap momenmu</h1>
              <p className="mt-5 max-w-md text-[14px] leading-7 text-[#9c4e6e] sm:mt-6 sm:text-[15px]">Balloon bucket cantik untuk ulang tahun, perayaan, kejutan, dan setiap momen kecil yang patut diingat.</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button onClick={() => gulirKe('belanja')} className="btn-primary">Lihat balloon bucket <ArrowRight size={16} /></button>
                <button onClick={() => gulirKe('custom')} className="btn-quiet">Buat sendiri</button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[380px] sm:max-w-[520px] lg:max-w-[560px]">
              <div className="hero-image"><img src={photos[0]} alt="Rangkaian hadiah balon pastel" /></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-5 sm:pb-20 lg:px-10">
          <div className="online-note">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0f6] text-[#ec3e7e]"><Zap size={17} fill="currentColor" /></div>
            <div>
              <p className="text-[11px] font-bold tracking-[.15em] text-[#d62a6c]">PESANAN ONLINE SAJA</p>
              <p className="mt-1 text-[13px] text-[#9c4e6e]">Pilih hadiah balonmu di sini, pesan langsung lewat WhatsApp.</p>
            </div>
          </div>
        </section>

        <section id="belanja" className="bg-[#ffd5e8] px-4 py-16 sm:px-5 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 sm:mb-10">
              <h2 className="font-serif text-[1.9rem] leading-tight text-[#5c1f3a] sm:text-4xl lg:text-[2.8rem]">Balloon Bucket Pilihan</h2>
              <p className="mt-3 text-[14px] text-[#9c4e6e]">Pilih favoritmu, sesuaikan, dan pesan langsung lewat WhatsApp.</p>
            </div>
            <div className="category-row">{daftarKategori.map((kategori) => <button key={kategori.nama} onClick={() => setKategoriTerpilih(kategori.nama)} className={`category-pill ${kategoriTerpilih === kategori.nama ? 'active' : ''}`}>{kategori.label}</button>)}</div>
            <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-7 sm:mt-8 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4 lg:gap-5">
              {produkTerfilter.map((produk) => <KartuProduk key={produk.id} produk={produk} onLihat={() => setProdukTerpilih(produk)} onTambah={() => tambahKeKeranjang(produk)} />)}
            </div>
          </div>
        </section>

        <section id="custom" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-20 lg:px-10 lg:py-24">
          <div className="custom-panel">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="font-serif text-[1.9rem] leading-tight text-[#5c1f3a] sm:text-4xl lg:text-[2.8rem]">Buat Bucket Sendiri</h2>
                <p className="mt-4 max-w-md text-[14px] leading-7 text-[#9c4e6e]">Mau sesuatu yang lebih personal? Ceritakan suasana, warna, dan pesannya. Kami akan buatkan balloon bucket khusus untuk mereka.</p>
                <div className="mt-6 space-y-3.5 text-[13px] text-[#6b2a48]">
                  <div className="benefit-item">Pilih warna dan tema sesukamu</div>
                  <div className="benefit-item">Tambahkan nama, umur, atau pesan manis</div>
                  <div className="benefit-item">Kami konfirmasi tiap detail lewat WhatsApp</div>
                </div>
                <button onClick={() => gulirKe('form-custom')} className="btn-primary mt-7">Buat bucket custom <ArrowRight size={16} /></button>
              </div>
              <div className="custom-photo"><img src={photos[3]} alt="Hadiah balon custom" /></div>
            </div>
          </div>
        </section>

        <section id="tentang" className="bg-[#ffd5e8] px-4 py-16 sm:px-5 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-[1.9rem] leading-tight text-[#5c1f3a] sm:text-4xl lg:text-[2.8rem]">Kenapa Balonlyz?</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              <div>
                <h3 className="font-serif text-lg text-[#5c1f3a]">Dibuat dengan Cinta</h3>
                <p className="mt-2 text-[13px] leading-6 text-[#a8788a]">Setiap hadiah balon disiapkan dengan penuh perhatian.</p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#5c1f3a]">Bisa Disesuaikan</h3>
                <p className="mt-2 text-[13px] leading-6 text-[#a8788a]">Buat hadiah balonmu jadi lebih personal.</p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#5c1f3a]">Untuk Semua Momen</h3>
                <p className="mt-2 text-[13px] leading-6 text-[#a8788a]">Ulang tahun, wisuda, kejutan, dan lainnya.</p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#5c1f3a]">Pesan Online Mudah</h3>
                <p className="mt-2 text-[13px] leading-6 text-[#a8788a]">Pilih hadiahmu dan pesan lewat WhatsApp.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-20 lg:px-10 lg:py-24">
          <h2 className="font-serif text-[1.9rem] leading-tight text-[#5c1f3a] sm:text-4xl lg:text-[2.8rem]">Cara Pesan</h2>
          <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div className="step-card"><span className="step-number">01</span><h3 className="mt-5 font-serif text-lg text-[#5c1f3a]">Pilih balonmu</h3><p className="mt-2 text-[13px] leading-6 text-[#a8788a]">Temukan yang paling pas.</p></div>
            <div className="step-card"><span className="step-number">02</span><h3 className="mt-5 font-serif text-lg text-[#5c1f3a]">Buat personal</h3><p className="mt-2 text-[13px] leading-6 text-[#a8788a]">Pilih warna, tulisan, dan tambahan.</p></div>
            <div className="step-card"><span className="step-number">03</span><h3 className="mt-5 font-serif text-lg text-[#5c1f3a]">Kirim permintaan</h3><p className="mt-2 text-[13px] leading-6 text-[#a8788a]">Masukkan ke keranjang atau chat kami.</p></div>
            <div className="step-card"><span className="step-number">04</span><h3 className="mt-5 font-serif text-lg text-[#5c1f3a]">Konfirmasi WhatsApp</h3><p className="mt-2 text-[13px] leading-6 text-[#a8788a]">Kami bantu sisanya dari sana.</p></div>
          </div>
        </section>

        <section id="kontak" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-20 lg:px-10 lg:py-24">
          <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-[#f7cede] px-6 py-10 text-center sm:px-12 sm:py-12 lg:flex-row lg:text-left">
            <div>
              <h2 className="font-serif text-2xl text-[#5c1f3a] sm:text-3xl">Lihat momen balon lainnya di Instagram</h2>
              <p className="mt-3 text-[13px] text-[#9c4e6e]">Design baru, custom creation, dan kejutan dari Balonlyz.</p>
            </div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn-primary shrink-0">Ikuti @balonlyz <ArrowRight size={16} /></a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#f9c6db] bg-[#ffd9ec] px-4 pb-10 pt-12 sm:px-5 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={LOGO} alt="Balonlyz" className="h-12 w-28 object-contain object-left sm:h-14 sm:w-32" />
            <p className="mt-3 max-w-xs text-[13px] leading-6 text-[#a8788a]">Hadiah balon, untuk setiap momenmu.<br />Pesanan online saja.</p>
          </div>
          <div>
            <p className="footer-heading">Jelajahi</p>
            <div className="footer-links">
              <button onClick={() => gulirKe('belanja')}>Belanja</button>
              <button onClick={() => gulirKe('custom')}>Custom</button>
              <button onClick={() => gulirKe('tentang')}>Tentang</button>
            </div>
          </div>
          <div>
            <p className="footer-heading">Hubungi Kami</p>
            <div className="footer-links">
              <button onClick={() => window.open(urlWa('Halo kak, saya mau tanya tentang Balonlyz'), '_blank', 'noopener,noreferrer')}>WhatsApp</button>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
              <span>Pesanan online saja</span>
            </div>
          </div>
          <div>
            <p className="footer-heading">Info</p>
            <p className="text-[13px] leading-6 text-[#a8788a]">Setiap pesanan disiapkan dengan cinta. Konfirmasi ketersediaan langsung lewat WhatsApp.</p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-[#f9c6db] pt-5 text-[11px] text-[#b68b9f]">© 2026 Balonlyz</div>
      </footer>

      <button onClick={() => window.open(urlWa('Halo kak, saya mau tanya tentang balloon gift Balonlyz'), '_blank', 'noopener,noreferrer')} className="floating-wa" aria-label="Chat WhatsApp">
        <span className="hidden sm:inline">Chat WhatsApp</span>
        <CircleUserRound size={19} />
      </button>
      {toast && <div className="toast"><Check size={15} /> {toast}</div>}
      {produkTerpilih && <ModalProduk produk={produkTerpilih} onTutup={() => setProdukTerpilih(null)} onTambah={() => { tambahKeKeranjang(produkTerpilih); setProdukTerpilih(null); }} />}
      {keranjangBuka && <DrawerKeranjang keranjang={keranjang} subtotal={subtotal} onTutup={() => setKeranjangBuka(false)} ubahJumlah={ubahJumlah} onPesan={pesanKeranjang} onKosongkan={() => setKeranjang([])} />}
      <FormCustom />
      {installPrompt && <button className="install-prompt" onClick={async () => { await (installPrompt as BeforeInstallPromptEvent).prompt(); setInstallPrompt(null); }}>Pasang Balonlyz</button>}
      {!installPrompt && tampilkanIosHint && <div className="ios-hint"><button onClick={tutupIosHint}><X size={16} /></button><strong>Cara memasang Balonlyz</strong><span>Ketuk Share, pilih "Add to Home Screen", lalu ketuk Add.</span></div>}
    </div>
  );
}

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> };

function KartuProduk({ produk, onLihat, onTambah }: { produk: Produk; onLihat: () => void; onTambah: () => void }) {
  return (
    <article className="product-card">
      <button onClick={onLihat} className="product-image">
        <img src={produk.gambar} alt={produk.nama} loading="lazy" />
        {produk.badge && <span className="product-badge">{produk.badge}</span>}
        <span className="quick-view">Lihat detail</span>
      </button>
      <div className="pt-3 sm:pt-4">
        <button onClick={onLihat} className="text-left w-full">
          <h3 className="product-name">{produk.nama}</h3>
          <p className="product-desc">{produk.deskripsi}</p>
        </button>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold text-[#5c1f3a]">{formatHarga(produk.harga)}</span>
          <button onClick={onTambah} className="add-button" aria-label={`Tambah ${produk.nama} ke keranjang`}><Plus size={16} /></button>
        </div>
      </div>
    </article>
  );
}

function ModalProduk({ produk, onTutup, onTambah }: { produk: Produk; onTutup: () => void; onTambah: () => void }) {
  const [jumlah, setJumlah] = useState(1);
  const [warna, setWarna] = useState(produk.warna[0]);
  return (
    <div className="modal-backdrop" onMouseDown={onTutup}>
      <div className="modal-card" onMouseDown={(event) => event.stopPropagation()}>
        <button onClick={onTutup} className="modal-close"><X size={18} /></button>
        <div className="grid gap-5 md:grid-cols-2 md:gap-7">
          <div className="modal-photo"><img src={produk.gambar} alt={produk.nama} /></div>
          <div className="flex flex-col justify-center">
            <h2 className="font-serif text-2xl leading-tight text-[#5c1f3a] sm:text-3xl">{produk.nama}</h2>
            <p className="mt-3 text-lg font-semibold text-[#ec3e7e]">{formatHarga(produk.harga)}</p>
            <p className="mt-4 text-[14px] leading-7 text-[#9c4e6e]">{produk.deskripsi} Disusun dengan hati-hati, siap membuat hari seseorang jadi lebih cerah.</p>
            <div className="mt-5">
              <p className="text-xs font-semibold text-[#6b2a48]">Pilih warna</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {produk.warna.map((item) => <button key={item} onClick={() => setWarna(item)} className={`option-chip ${warna === item ? 'selected' : ''}`}>{item}</button>)}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="quantity">
                <button onClick={() => setJumlah(Math.max(1, jumlah - 1))}><Minus size={14} /></button>
                <span>{jumlah}</span>
                <button onClick={() => setJumlah(jumlah + 1)}><Plus size={14} /></button>
              </div>
              <button onClick={() => { for (let index = 0; index < jumlah; index += 1) onTambah(); }} className="btn-primary flex-1 justify-center">Masukkan keranjang <ShoppingBag size={16} /></button>
            </div>
            <button onClick={() => window.open(urlWa(`${pesanDefault(produk, jumlah)}\nWarna: ${warna}`), '_blank', 'noopener,noreferrer')} className="mt-3 text-center text-xs font-semibold text-[#ec3e7e]">Pesan lewat WhatsApp <ArrowRight className="ml-1 inline" size={13} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DrawerKeranjang({ keranjang, subtotal, onTutup, ubahJumlah, onPesan, onKosongkan }: { keranjang: ItemKeranjang[]; subtotal: number; onTutup: () => void; ubahJumlah: (id: number, selisih: number) => void; onPesan: () => void; onKosongkan: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={onTutup}>
      <aside className="cart-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#f9c6db] pb-5">
          <h2 className="font-serif text-2xl text-[#5c1f3a]">Keranjang</h2>
          <button onClick={onTutup} className="modal-close static"><X size={18} /></button>
        </div>
        {keranjang.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingBag className="text-[#f4c4da]" size={36} strokeWidth={1.3} />
            <p className="mt-4 font-serif text-xl text-[#5c1f3a]">Keranjang masih kosong</p>
            <p className="mt-2 max-w-xs text-[13px] leading-6 text-[#a8788a]">Yuk pilih balloon bucket untuk orang spesial.</p>
            <button onClick={onTutup} className="btn-primary mt-6">Lihat produk</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto py-6">
              {keranjang.map((item) => (
                <div className="flex gap-3" key={item.id}>
                  <img src={item.gambar} alt={item.nama} className="h-20 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-[#5c1f3a]">{item.nama}</h3>
                    <p className="mt-1 text-xs text-[#a8788a]">{formatHarga(item.harga)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="quantity small">
                        <button onClick={() => ubahJumlah(item.id, -1)}><Minus size={11} /></button>
                        <span>{item.jumlah}</span>
                        <button onClick={() => ubahJumlah(item.id, 1)}><Plus size={11} /></button>
                      </div>
                      <button onClick={() => ubahJumlah(item.id, -item.jumlah)} className="text-[#c9a5b4] hover:text-[#ec3e7e]"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#5c1f3a]">{formatHarga(item.harga * item.jumlah)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#f9c6db] pt-5">
              <div className="flex justify-between text-sm"><span className="text-[#a8788a]">Subtotal</span><strong className="text-[#5c1f3a]">{formatHarga(subtotal)}</strong></div>
              <button onClick={onPesan} className="btn-primary mt-5 w-full justify-center">Pesan semua lewat WhatsApp <ArrowRight size={16} /></button>
              <button onClick={onKosongkan} className="mt-4 block w-full text-center text-xs text-[#b68b9f] hover:text-[#ec3e7e]">Kosongkan keranjang</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function FormCustom() {
  const [tema, setTema] = useState('Ulang Tahun');
  const [warna, setWarna] = useState('Pink');
  const [tulisan, setTulisan] = useState('');
  const [tambahan, setTambahan] = useState<string[]>([]);
  const [catatan, setCatatan] = useState('');
  const [terkirim, setTerkirim] = useState(false);
  const toggle = (item: string) => setTambahan((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item]);
  const kirim = () => {
    const pesan = `Halo kak, saya mau custom Balloon Bucket dari Balonlyz\n\nTema: ${tema}\nWarna balon: ${warna}\nTulisan: ${tulisan || '-'}\nTambahan: ${tambahan.join(', ') || '-'}\nCatatan: ${catatan || '-'}\n\nMohon dibantu info harga dan ketersediaannya ya kak. Terima kasih`;
    window.open(urlWa(pesan), '_blank', 'noopener,noreferrer');
    setTerkirim(true);
  };
  return (
    <section id="form-custom" className="bg-[#ffd5e8] px-4 py-16 sm:px-5 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="custom-form-card">
          <h2 className="font-serif text-[1.7rem] text-[#5c1f3a] sm:text-3xl">Buat Bucket Custom</h2>
          <p className="mt-3 text-[14px] leading-7 text-[#9c4e6e]">Isi detail di bawah, kami akan wujudkan ideamu. Bisa disesuaikan lagi bersama kami di WhatsApp.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="field"><span>Tema</span><select value={tema} onChange={(event) => setTema(event.target.value)}>{['Ulang Tahun', 'Wisuda', 'Romantis', 'Anniversary', 'Bayi', 'Selamat', 'Cepat Sembuh', 'Lainnya'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="field"><span>Warna balon</span><select value={warna} onChange={(event) => setWarna(event.target.value)}>{['Pink', 'Lavender', 'Putih', 'Biru', 'Kuning', 'Custom'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="field"><span>Tulisan di balon</span><input value={tulisan} onChange={(event) => setTulisan(event.target.value)} placeholder="Nama, umur, atau pesan" /></label>
            <div className="field"><span>Tambahan</span><div className="flex flex-wrap gap-2 pt-2">{['Bunga', 'Boneka', 'Snack', 'Kartu ucapan'].map((item) => <button type="button" onClick={() => toggle(item)} key={item} className={`option-chip ${tambahan.includes(item) ? 'selected' : ''}`}>{item}</button>)}</div></div>
            <label className="field md:col-span-2"><span>Catatan</span><textarea value={catatan} onChange={(event) => setCatatan(event.target.value)} placeholder="Ceritakan hal lain yang perlu kami tahu" rows={3} /></label>
          </div>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button onClick={kirim} className="btn-primary">Kirim permintaan <ArrowRight size={16} /></button>
            {terkirim && <span className="text-xs text-[#5c986c]">Permintaan WhatsApp sudah siap.</span>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
