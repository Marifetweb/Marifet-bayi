import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  MessageCircle,
  Tag,
  ChevronRight,
  ChevronDown,
  Star,
  Award,
  Truck,
  ShieldCheck,
  Phone,
  User,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  urun_adi: string;
  fiyati: string;
  fiyat_sayi: number;
  urun_gorseli: string;
  kategori: string;
  aciklama: string;
  rating: number;
  reviews: number;
}

const SLIDES = [
  {
    eyebrow: "MARIFET ŞARKÜTERİ",
    title: "Kars'ın En Seçkin Lezzetleri",
    subtitle:
      "Doğal, katkısız, geleneksel yöntemlerle üretilmiş yöresel ürünler kapınızda.",
    cta: "Ürünleri İncele",
    href: "/katalog",
    bg: "linear-gradient(135deg, #92400e 0%, #d97706 50%, #78350f 100%)",
  },
  {
    eyebrow: "GÜNCEL FIRSATLAR",
    title: "Size Özel Kampanyalar",
    subtitle:
      "Sınırlı süreli indirimler ve bayi avantajlarıyla en iyi fiyatları yakalayın.",
    cta: "Kampanyaları Gör",
    href: "/kampanyalar",
    bg: "linear-gradient(135deg, #7c2d12 0%, #b45309 50%, #422006 100%)",
  },
];

type NavLink = { href: string; label: string };

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/katalog", label: "Premium Katalog" },
  { href: "/kampanyalar", label: "Kampanyalar" },
];

const KURUMSAL_LINKS: NavLink[] = [
  { href: "/#hakkimizda", label: "Hakkımızda" },
  { href: "/#iletisim", label: "İletişim" },
];

const WHATSAPP_NUMBER = "905404614635";
const PHONE_NUMBER = "05404614635";

export default function Home() {
  const [location] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [slideIdx, setSlideIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [kurumsalOpen, setKurumsalOpen] = useState(false);
  const [kurumsalMobileOpen, setKurumsalMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/products.json")
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setSlideIdx((i) => (i + 1) % SLIDES.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  // Drawer açıkken arka planı kaydırmayı engelle
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const featured = products.slice(0, 8);
  const slide = SLIDES[slideIdx];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* SOL: Hamburger (sadece mobil) + Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-amber-50 lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu className="w-6 h-6 text-amber-900" />
            </button>

            <Link href="/" className="text-center md:text-left leading-tight">
              <div className="text-[10px] tracking-[0.3em] text-amber-700">
                KARS'TAN
              </div>
              <div className="font-serif font-bold text-2xl text-amber-900">
                Marifet Şarküteri
              </div>
              <div className="text-[9px] tracking-[0.3em] text-amber-600">
                DOĞAL &amp; ORGANİK
              </div>
            </Link>
          </div>

          {/* SAĞ: Masaüstü Menü + Bayi Girişi + ikonlar */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* MASAÜSTÜ MENÜ - sağa yaslı */}
            <nav className="hidden lg:flex items-center gap-1 mr-2">
              {NAV_LINKS.map((link) => {
                const isHash = link.href.startsWith("/#");
                const active = isHash ? false : location === link.href;
                const className = `group relative px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active
                    ? "text-amber-900 bg-amber-50"
                    : "text-amber-800 hover:text-amber-900 hover:bg-amber-50/70"
                }`;
                const inner = (
                  <>
                    <span>{link.label}</span>
                    <span
                      className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] bg-gradient-to-r from-amber-500 to-amber-700 rounded-full transition-all duration-300 origin-left ${
                        active
                          ? "scale-x-100 opacity-100"
                          : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                      }`}
                    />
                  </>
                );
                return isHash ? (
                  <a key={link.href} href={link.href} className={className}>
                    {inner}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className={className}>
                    {inner}
                  </Link>
                );
              })}

              {/* KURUMSAL DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setKurumsalOpen(true)}
                onMouseLeave={() => setKurumsalOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setKurumsalOpen((v) => !v)}
                  className="group relative flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold text-amber-800 hover:text-amber-900 hover:bg-amber-50/70 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={kurumsalOpen}
                >
                  <span>Kurumsal</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      kurumsalOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {kurumsalOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full pt-2 w-56"
                    >
                      <ul className="py-2 bg-white border border-amber-100 rounded-2xl shadow-xl overflow-hidden">
                        {KURUMSAL_LINKS.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              onClick={() => setKurumsalOpen(false)}
                              className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-50"
                            >
                              <span>{link.label}</span>
                              <ChevronRight className="w-4 h-4 text-amber-500" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <Link href="/login">
              <Button
                variant="outline"
                className="hidden sm:inline-flex border-amber-600 text-amber-800 hover:bg-amber-50 rounded-full"
              >
                Bayi Girişi
              </Button>
            </Link>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-amber-50"
              aria-label="Mesaj"
            >
              <MessageCircle className="w-5 h-5 text-amber-900" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-amber-50"
              aria-label="Sepet"
            >
              <ShoppingCart className="w-5 h-5 text-amber-900" />
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün ara... (kaşar, bal, tereyağı...)"
              className="w-full bg-amber-50/60 border border-amber-100 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      </header>

      {/* SOLDAN KAYAN HAMBURGER DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Karartma */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 z-50 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
            >
              {/* Drawer Başlık */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-amber-100">
                <div className="leading-tight">
                  <div className="text-[10px] tracking-[0.3em] text-amber-700">
                    KARS'TAN
                  </div>
                  <div className="font-serif font-bold text-xl text-amber-900">
                    Marifet Şarküteri
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-amber-50"
                  aria-label="Menüyü kapat"
                >
                  <X className="w-6 h-6 text-amber-900" />
                </button>
              </div>

              {/* Linkler */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => {
                    const isHash = link.href.startsWith("/#");
                    const cls =
                      "flex items-center justify-between px-4 py-3 rounded-xl text-amber-900 font-semibold hover:bg-amber-50 transition-colors";
                    const content = (
                      <>
                        <span>{link.label}</span>
                        <ChevronRight className="w-4 h-4 text-amber-500" />
                      </>
                    );
                    return (
                      <li key={link.href}>
                        {isHash ? (
                          <a
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cls}
                          >
                            {content}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cls}
                          >
                            {content}
                          </Link>
                        )}
                      </li>
                    );
                  })}

                  {/* KURUMSAL - alta açılan grup */}
                  <li>
                    <button
                      type="button"
                      onClick={() => setKurumsalMobileOpen((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-amber-900 font-semibold hover:bg-amber-50 transition-colors"
                      aria-expanded={kurumsalMobileOpen}
                    >
                      <span>Kurumsal</span>
                      <ChevronDown
                        className={`w-4 h-4 text-amber-500 transition-transform ${
                          kurumsalMobileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {kurumsalMobileOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden pl-3"
                        >
                          {KURUMSAL_LINKS.map((sub) => (
                            <li key={sub.href}>
                              <a
                                href={sub.href}
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setKurumsalMobileOpen(false);
                                }}
                                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-amber-800 font-medium hover:bg-amber-50"
                              >
                                <span>{sub.label}</span>
                                <ChevronRight className="w-4 h-4 text-amber-400" />
                              </a>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                </ul>

                <div className="my-4 border-t border-amber-100" />

                {/* Bayi Girişi */}
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-900 font-semibold hover:bg-amber-50"
                >
                  <User className="w-5 h-5" />
                  Bayi Girişi
                </Link>

                {/* Bayi Kayıt CTA */}
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 text-amber-900 font-bold hover:bg-amber-100 border border-amber-200"
                >
                  <Percent className="w-5 h-5" />
                  Bayi Kayıt · %10 indirim
                </Link>
              </nav>

              {/* Telefon + WhatsApp */}
              <div className="border-t border-amber-100 p-4 space-y-2">
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 text-amber-900 font-semibold hover:bg-amber-100"
                >
                  <Phone className="w-5 h-5" />
                  {PHONE_NUMBER}
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 text-green-700 font-semibold hover:bg-green-100"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp ile Yaz
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* HERO SLIDER */}
      <section className="relative overflow-hidden">
        <motion.div
          key={slideIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          style={{ backgroundImage: slide.bg }}
        />
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 text-white">
          <motion.div
            key={`text-${slideIdx}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-xs tracking-[0.3em] text-amber-100/90 mb-3">
              {slide.eyebrow}
            </p>
            <h1 className="font-serif font-black text-4xl md:text-6xl leading-tight">
              {slide.title}
            </h1>
            <p className="mt-4 text-lg text-amber-50/95 max-w-xl">
              {slide.subtitle}
            </p>
            <Link href={slide.href}>
              <Button className="mt-7 bg-white text-amber-900 hover:bg-amber-50 rounded-full px-8 py-6 text-base font-semibold shadow-xl">
                {slide.cta}
              </Button>
            </Link>
          </motion.div>

          {/* dots */}
          <div className="flex gap-2 mt-10">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                className={`h-2 rounded-full transition-all ${
                  i === slideIdx ? "w-10 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BAYI BANNER */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-4 shrink-0">
              <Tag className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold">
                Bayi misiniz?
              </div>
              <div className="text-sm md:text-base opacity-95 mt-1">
                Hemen kaydolun, tüm ürünlerde %10 indirim ve 10'lu toptan
                paketleri kullanın.
              </div>
            </div>
          </div>
          <Link href="/katalog" className="shrink-0">
            <Button className="bg-white text-orange-600 hover:bg-orange-50 rounded-full px-8 py-6 font-semibold">
              Kaydol
            </Button>
          </Link>
        </div>
      </section>

      {/* AVANTAJLAR */}
      <section className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Truck, title: "Hızlı Teslimat", sub: "Türkiye geneli kargo" },
          { icon: ShieldCheck, title: "Güvenli Alışveriş", sub: "Üreticiden direkt" },
          { icon: Award, title: "Doğal Üretim", sub: "Katkısız & geleneksel" },
          { icon: Star, title: "Bayi Avantajı", sub: "Toptan fiyat fırsatı" },
        ].map((a, i) => (
          <div
            key={i}
            className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="bg-amber-100 rounded-full p-3">
              <a.icon className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="font-bold text-sm text-amber-900">{a.title}</div>
              <div className="text-xs text-amber-700/80">{a.sub}</div>
            </div>
          </div>
        ))}
      </section>

      {/* EN ÇOK SATANLAR */}
      <section id="en-cok-satanlar" className="max-w-7xl mx-auto px-4 py-10 scroll-mt-32">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs tracking-[0.3em] text-amber-700">
              VİTRİN
            </p>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-amber-900">
              En Çok Satanlar
            </h2>
          </div>
          <Link
            href="/katalog"
            className="text-amber-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Tümünü Gör <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-amber-50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <Link
                key={p.id}
                href="/katalog"
                className="group block bg-white rounded-2xl border border-amber-100 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-amber-50">
                  <img
                    src={p.urun_gorseli}
                    alt={p.urun_adi}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300?text=Ürün";
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {p.kategori}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 min-h-[2.5rem] group-hover:text-amber-800">
                    {p.urun_adi}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-amber-700 text-lg">
                      {p.fiyati}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {p.rating}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* HAKKIMIZDA */}
      <section id="hakkimizda" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-32">
        <div className="bg-amber-50/60 border border-amber-100 rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] text-amber-700 mb-2">
              HAKKIMIZDA
            </p>
            <h2 className="font-serif font-black text-3xl md:text-4xl text-amber-900">
              Kars'tan Sofranıza
            </h2>
            <p className="mt-4 text-amber-900/80 leading-relaxed">
              Marifet Şarküteri, Kars'ın doğal otlaklarında üretilen geleneksel
              lezzetleri Türkiye'nin dört bir yanına ulaştırır. Üreticiden
              doğrudan, katkısız ve geleneksel yöntemlerle hazırlanmış
              ürünlerimizle damağınızda iz bırakıyoruz.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-2xl p-4 border border-amber-100">
              <div className="font-serif font-black text-2xl text-amber-900">15+</div>
              <div className="text-xs text-amber-700 mt-1">Yıllık Tecrübe</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-amber-100">
              <div className="font-serif font-black text-2xl text-amber-900">100+</div>
              <div className="text-xs text-amber-700 mt-1">Ürün Çeşidi</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-amber-100">
              <div className="font-serif font-black text-2xl text-amber-900">5K+</div>
              <div className="text-xs text-amber-700 mt-1">Mutlu Müşteri</div>
            </div>
          </div>
        </div>
      </section>

      {/* KAMPANYA TEASER */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/kampanyalar">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 p-10 md:p-14 text-center text-white hover:shadow-2xl transition-shadow cursor-pointer">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
            <p className="text-xs tracking-[0.3em] text-amber-200 mb-3">
              FIRSATLARI KAÇIRMAYIN
            </p>
            <h3 className="font-serif font-black text-3xl md:text-5xl">
              Güncel Kampanyalar
            </h3>
            <p className="mt-3 text-amber-100 max-w-xl mx-auto">
              Size özel indirimler, bayi avantajları ve sezonluk fırsatlar.
            </p>
            <Button className="mt-6 bg-white text-amber-900 hover:bg-amber-50 rounded-full px-8 py-6 font-semibold">
              Kampanyaları Gör
            </Button>
          </div>
        </Link>
      </section>

      {/* FOOTER (İLETİŞİM) */}
      <footer id="iletisim" className="bg-amber-950 text-amber-100 mt-12 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-serif font-bold text-xl text-white">
              Marifet Şarküteri
            </div>
            <p className="text-sm text-amber-200/80 mt-2">
              Kars'ın en seçkin lezzetleri, doğal ve katkısız.
            </p>
          </div>
          <div>
            <div className="font-bold text-white mb-3">Sayfalar</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-300">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-amber-300">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/kampanyalar" className="hover:text-amber-300">
                  Kampanyalar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white mb-3">Kategoriler</div>
            <ul className="space-y-2 text-sm">
              <li>Peynir</li>
              <li>Bal</li>
              <li>Pekmez</li>
              <li>Yağ &amp; Tereyağı</li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white mb-3">İletişim</div>
            <p className="text-sm text-amber-200/80">
              Kars / Türkiye
              <br />
              info@marifetsarkuteri.tr
            </p>
            <div className="mt-3 space-y-2">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-2 text-sm text-amber-200 hover:text-amber-300"
              >
                <Phone className="w-4 h-4" />
                {PHONE_NUMBER}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-300 hover:text-green-200"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp ile Yaz
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-amber-900/60 py-4 text-center text-xs text-amber-300/70">
          © {new Date().getFullYear()} Marifet Şarküteri. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
