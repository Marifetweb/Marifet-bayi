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
  Heart,
  Share2,
  Check,
  Minus,
  Plus,
  Zap,
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

/* ============================================================
   SEPET HOOK - Cart.tsx ile aynı localStorage anahtarı
   ============================================================ */
const CART_KEY = "marifet_cart";
type CartItem = {
  id: number;
  urun_adi: string;
  fiyati: string;
  fiyat_sayi: number;
  urun_gorseli: string;
  kategori?: string;
  qty: number;
};
function readCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}
function useCart() {
  const [items, setItems] = useState<CartItem[]>(() =>
    typeof window === "undefined" ? [] : readCart()
  );
  useEffect(() => {
    const sync = () => setItems(readCart());
    window.addEventListener("cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const add = (p: Omit<CartItem, "qty">, qty = 1) => {
    const cur = readCart();
    const idx = cur.findIndex((i) => i.id === p.id);
    if (idx >= 0) cur[idx].qty += qty;
    else cur.push({ ...p, qty });
    writeCart(cur);
  };
  const setQty = (id: number, qty: number) => {
    const cur = readCart();
    const idx = cur.findIndex((i) => i.id === id);
    if (qty <= 0) {
      if (idx >= 0) writeCart(cur.filter((i) => i.id !== id));
      return;
    }
    if (idx >= 0) {
      cur[idx].qty = qty;
      writeCart(cur);
    }
  };
  const getQty = (id: number) => items.find((i) => i.id === id)?.qty || 0;
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { items, add, setQty, getQty, count };
}

/* ============================================================
   ÜRÜN KARTI BUTON + MIKTAR (sepete bağlı)
   ============================================================ */
function ProductCardActions({
  product,
  add,
  qty,
  setQty,
}: {
  product: Product;
  add: (p: Product, qty: number) => void;
  qty: number;
  setQty: (id: number, qty: number) => void;
}) {
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          add(product, 1);
        }}
        className="w-full inline-flex items-center justify-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[11px] font-bold py-1.5 rounded-md transition shadow"
        aria-label={`${product.urun_adi} sepete ekle`}
      >
        <ShoppingCart className="w-3 h-3" />
        Sepete Ekle
      </button>
    );
  }
  return (
    <div
      className="w-full flex items-center justify-between gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md p-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setQty(product.id, qty - 1)}
        aria-label="Azalt"
        className="w-7 h-7 rounded bg-white/20 hover:bg-white/30 font-bold text-base flex items-center justify-center"
      >
        −
      </button>
      <span className="font-bold text-xs">{qty}</span>
      <button
        type="button"
        onClick={() => setQty(product.id, qty + 1)}
        aria-label="Artır"
        className="w-7 h-7 rounded bg-white/20 hover:bg-white/30 font-bold text-base flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}

/* ============================================================
   ÜRÜN DETAY MODALI
   ============================================================ */
function ProductDetailModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleAddToCart = () => {
    onAdd(qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Merhaba, "${product.urun_adi}" (${qty} adet) hakkında bilgi almak istiyorum.`
  )}`;

  const totalPrice = (product.fiyat_sayi * qty).toFixed(2);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white w-full md:max-w-5xl md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:grid md:grid-cols-2"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden">
            <div className="aspect-square md:aspect-auto md:h-full w-full">
              <img
                src={product.urun_gorseli}
                alt={product.urun_adi}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/600?text=Ürün";
                }}
              />
            </div>
            <span className="absolute top-4 left-4 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow">
              {product.kategori}
            </span>
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">
                Doğal & Katkısız
              </span>
            </div>
          </div>

          <div className="flex flex-col overflow-y-auto p-6 md:p-8">
            <p className="text-[10px] tracking-[0.3em] text-amber-700 font-semibold mb-2">
              KARS'TAN · MARIFET ŞARKÜTERİ
            </p>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-slate-900 leading-tight">
              {product.urun_adi}
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500">
                ({product.reviews} değerlendirme)
              </span>
            </div>

            <div className="mt-5 bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-xs text-amber-700 font-semibold tracking-wide">
                    BİRİM FİYAT
                  </div>
                  <div className="font-serif font-black text-3xl md:text-4xl text-amber-900 leading-none mt-1">
                    {product.fiyati}
                  </div>
                </div>
                {qty > 1 && (
                  <div className="text-right">
                    <div className="text-[10px] text-amber-700 font-semibold tracking-wide">
                      TOPLAM
                    </div>
                    <div className="font-bold text-xl text-amber-900">
                      {totalPrice}₺
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-emerald-700">
                <Check className="w-4 h-4" />
                <span className="text-xs font-semibold">
                  Stokta var · 24 saat içinde kargoda
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
                Ürün Açıklaması
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {product.aciklama ||
                  "Kars'ın doğal otlaklarında, geleneksel yöntemlerle, hiçbir katkı maddesi kullanılmadan üretilmiştir. Üreticiden doğrudan sofranıza gelir."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
              <div className="flex flex-col items-center text-center bg-slate-50 border border-slate-100 rounded-xl px-2 py-3">
                <Truck className="w-5 h-5 text-amber-700 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                  Hızlı Teslimat
                </span>
              </div>
              <div className="flex flex-col items-center text-center bg-slate-50 border border-slate-100 rounded-xl px-2 py-3">
                <Award className="w-5 h-5 text-amber-700 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                  Doğal Üretim
                </span>
              </div>
              <div className="flex flex-col items-center text-center bg-slate-50 border border-slate-100 rounded-xl px-2 py-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                  Güvenli Ödeme
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="flex items-center bg-slate-100 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Azalt"
                  className="w-9 h-9 rounded-full bg-white shadow-sm hover:bg-amber-50 text-slate-700 flex items-center justify-center transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-slate-900 w-10 text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  aria-label="Artır"
                  className="w-9 h-9 rounded-full bg-white shadow-sm hover:bg-amber-50 text-slate-700 flex items-center justify-center transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFavorite((f) => !f)}
                  aria-label="Favori"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
                    favorite
                      ? "border-red-300 bg-red-50 text-red-500"
                      : "border-slate-200 bg-white text-slate-500 hover:border-amber-300 hover:text-amber-700"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${favorite ? "fill-red-500" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  aria-label="Paylaş"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.urun_adi,
                        text: product.aciklama,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-500 hover:border-amber-300 hover:text-amber-700 flex items-center justify-center transition"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  onAdd(qty);
                  window.location.href = "/sepet";
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-sm md:text-base py-3.5 rounded-xl shadow-lg shadow-amber-900/20 transition-all hover:shadow-amber-900/40 hover:-translate-y-0.5"
              >
                <Zap className="w-5 h-5" />
                Hemen Satın Al
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full inline-flex items-center justify-center gap-2 font-bold text-sm md:text-base py-3.5 rounded-xl border-2 transition-all hover:-translate-y-0.5 ${
                  added
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                    : "bg-white border-amber-600 text-amber-800 hover:bg-amber-50"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Sepete Eklendi
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Sepete Ekle ({qty})
                  </>
                )}
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm py-3 rounded-xl border border-green-200 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp ile Sipariş Ver
              </a>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <a href={`tel:${PHONE_NUMBER}`} className="hover:text-amber-700">
                  {PHONE_NUMBER}
                </a>
              </div>
              <div>SKU: MR-{product.id.toString().padStart(4, "0")}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [location] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [slideIdx, setSlideIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [kurumsalOpen, setKurumsalOpen] = useState(false);
  const [kurumsalMobileOpen, setKurumsalMobileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { add, setQty, getQty, count } = useCart();

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

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const featured = products.slice(0, 8);
  const slide = SLIDES[slideIdx];

  const handleAddToCart = (p: Product, qty: number) => {
    add(
      {
        id: p.id,
        urun_adi: p.urun_adi,
        fiyati: p.fiyati,
        fiyat_sayi: p.fiyat_sayi,
        urun_gorseli: p.urun_gorseli,
        kategori: p.kategori,
      },
      qty
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
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

          <div className="flex items-center gap-2 md:gap-4">
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

              <div
                className="relative"
                onMouseEnter={() => setKurumsalOpen(true)}
                onMouseLeave={() => setKurumsalOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setKurumsalOpen((v) => !v)}
                  className="group relative flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold text-amber-800 hover:text-amber-900 hover:bg-amber-50/70 transition-colors"
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
            {/* SEPET BUTONU + CANLI SAYAÇ */}
            <Link
              href="/sepet"
              className="relative p-2 rounded-lg hover:bg-amber-50"
              aria-label="Sepet"
            >
              <ShoppingCart className="w-5 h-5 text-amber-900" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          </div>
        </div>

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

      {/* MOBİL DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 z-50 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
            >
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
                >
                  <X className="w-6 h-6 text-amber-900" />
                </button>
              </div>
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
                  <li>
                    <Link
                      href="/sepet"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-amber-900 font-semibold hover:bg-amber-50"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Sepetim {count > 0 && `(${count})`}
                      </span>
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setKurumsalMobileOpen((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-amber-900 font-semibold hover:bg-amber-50 transition-colors"
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

                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-900 font-semibold hover:bg-amber-50"
                >
                  <User className="w-5 h-5" />
                  Bayi Girişi
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 text-amber-900 font-bold hover:bg-amber-100 border border-amber-200"
                >
                  <Percent className="w-5 h-5" />
                  Bayi Kayıt · %10 indirim
                </Link>
              </nav>

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
            <p className="text-xs tracking-[0.3em] text-amber-700">VİTRİN</p>
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
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="group flex flex-col bg-white rounded-2xl border border-amber-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
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
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white/95 backdrop-blur text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                      Detayları Gör
                    </span>
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-semibold text-xs text-slate-900 line-clamp-2 min-h-[2rem] group-hover:text-amber-800">
                    {p.urun_adi}
                  </h3>
                  <div className="flex items-center justify-between mt-2 mb-2">
                    <span className="font-bold text-amber-700 text-base">
                      {p.fiyati}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {p.rating}
                    </div>
                  </div>
                  <ProductCardActions
                    product={p}
                    add={handleAddToCart}
                    qty={getQty(p.id)}
                    setQty={setQty}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HAKKIMIZDA */}
      <section id="hakkimizda" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-32">
        <div className="bg-amber-50/60 border border-amber-100 rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] text-amber-700 mb-2">HAKKIMIZDA</p>
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

      {/* FOOTER */}
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
              <li><Link href="/" className="hover:text-amber-300">Ana Sayfa</Link></li>
              <li><Link href="/katalog" className="hover:text-amber-300">Ürünler</Link></li>
              <li><Link href="/kampanyalar" className="hover:text-amber-300">Kampanyalar</Link></li>
              <li><Link href="/sepet" className="hover:text-amber-300">Sepetim</Link></li>
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
              Kars / Türkiye<br />info@marifetsarkuteri.tr
            </p>
            <div className="mt-3 space-y-2">
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-2 text-sm text-amber-200 hover:text-amber-300">
                <Phone className="w-4 h-4" />
                {PHONE_NUMBER}
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-green-300 hover:text-green-200">
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

      {/* DETAY MODALI */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={(qty) => handleAddToCart(selectedProduct, qty)}
        />
      )}
    </div>
  );
}
