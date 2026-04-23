import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Heart,
  ChevronDown,
  ChevronRight,
  Star,
  Filter,
  X,
  Menu,
  MessageCircle,
  Phone,
  User,
  Percent,
  Share2,
  Check,
  Minus,
  Plus,
  Zap,
  Truck,
  ShieldCheck,
  Award,
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
        className="w-full inline-flex items-center justify-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold text-[11px] py-1.5 px-2 rounded-md transition-all shadow"
        aria-label={`${product.urun_adi} sepete ekle`}
      >
        <ShoppingCart className="w-3 h-3" />
        Sepete Ekle
      </button>
    );
  }
  return (
    <div
      className="w-full flex items-center justify-between gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-md p-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setQty(product.id, qty - 1)}
        aria-label="Azalt"
        className="w-7 h-7 rounded bg-slate-900/10 hover:bg-slate-900/20 font-bold text-base flex items-center justify-center"
      >
        −
      </button>
      <span className="font-bold text-xs">{qty}</span>
      <button
        type="button"
        onClick={() => setQty(product.id, qty + 1)}
        aria-label="Artır"
        className="w-7 h-7 rounded bg-slate-900/10 hover:bg-slate-900/20 font-bold text-base flex items-center justify-center"
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
  isFavorite,
  onToggleFavorite,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAdd: (qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

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
          aria-label={product.urun_adi}
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
                  onClick={onToggleFavorite}
                  aria-label="Favori"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
                    isFavorite
                      ? "border-red-300 bg-red-50 text-red-500"
                      : "border-slate-200 bg-white text-slate-500 hover:border-amber-300 hover:text-amber-700"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`}
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

export default function ProductListing() {
  const [location] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [kurumsalOpen, setKurumsalOpen] = useState(false);
  const [kurumsalMobileOpen, setKurumsalMobileOpen] = useState(false);

  const { add, setQty, getQty, count } = useCart();

  const categories = ["Tümü", "Peynir", "Bal", "Pekmez", "Yağ", "Et"];

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ürünler yüklenemedi:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.urun_adi
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Tümü" || product.kategori === selectedCategory;
      const matchesPrice =
        product.fiyat_sayi >= priceRange[0] &&
        product.fiyat_sayi <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.fiyat_sayi - b.fiyat_sayi);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.fiyat_sayi - a.fiyat_sayi);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const addToCart = (p: Product, qty: number) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
                  className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold text-amber-800 hover:text-amber-900 hover:bg-amber-50/70 transition-colors"
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

      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Premium ürünler yükleniyor...</p>
          </div>
        </div>
      ) : (
        <>
          <section className="bg-slate-950/90 border-b border-amber-400/20">
            <div className="container py-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                      Premium Ürün Kataloğu
                    </h1>
                    <p className="text-sm text-slate-400 mt-2">
                      Seçkin yöresel ürünlerin en iyi seçimi
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-amber-400/20">
                      <ShoppingCart className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-300">
                        {filteredProducts.length} ürün
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-amber-400/20">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span className="text-sm font-semibold text-red-300">
                        {favorites.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Ürün adına göre ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-amber-400/30 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 rounded-lg border border-amber-400/30 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer appearance-none pr-10"
                    >
                      <option value="featured">Öne Çıkanlar</option>
                      <option value="newest">En Yeni</option>
                      <option value="price-low">Fiyat (Düşük)</option>
                      <option value="price-high">Fiyat (Yüksek)</option>
                      <option value="rating">Puanı En Yüksek</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="hidden px-4 py-3 rounded-lg border border-amber-400/30 bg-slate-800/50 text-amber-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filtreler
                  </button>
                </div>
              </div>
            </div>
          </section>

          <main className="container py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside
                className={`lg:w-64 flex-shrink-0 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
              >
                <div className="bg-slate-800/30 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-amber-300">Filtreler</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
                      Kategori
                    </h4>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                            selectedCategory === cat
                              ? "bg-amber-400/20 text-amber-300 border border-amber-400/50"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
                      Fiyat Aralığı
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 mb-2 block">
                          Min: {priceRange[0]}₺
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([
                              parseInt(e.target.value),
                              priceRange[1],
                            ])
                          }
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-2 block">
                          Max: {priceRange[1]}₺
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              parseInt(e.target.value),
                            ])
                          }
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategory("Tümü");
                      setPriceRange([0, 5000]);
                      setSearchTerm("");
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-amber-400/30 text-amber-300 hover:bg-amber-400/10 transition-colors text-sm font-medium"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              </aside>

              <div className="flex-1">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-slate-400 text-lg">
                      "{searchTerm}" ile eşleşen ürün bulunamadı.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-3 sm:px-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="group flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-amber-400/20 hover:border-amber-400/50 cursor-pointer"
                      >
                        <div className="relative overflow-hidden bg-slate-900 aspect-square">
                          <img
                            src={product.urun_gorseli}
                            alt={product.urun_adi}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/300?text=Görsel+Yok";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(product.id);
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 backdrop-blur-sm hover:bg-slate-900 transition-all border border-amber-400/30 hover:border-red-400/50"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                favorites.includes(product.id)
                                  ? "fill-red-400 text-red-400"
                                  : "text-slate-400"
                              }`}
                            />
                          </button>

                          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 backdrop-blur-sm">
                            <span className="text-[10px] font-semibold text-amber-300">
                              {product.kategori}
                            </span>
                          </div>

                          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-amber-400/95 backdrop-blur text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full shadow">
                              Detayları Gör
                            </span>
                          </div>
                        </div>

                        <div className="p-3 flex flex-col flex-1">
                          <h3 className="font-bold text-slate-100 text-xs line-clamp-2 mb-2 group-hover:text-amber-300 transition-colors min-h-[2rem]">
                            {product.urun_adi}
                          </h3>

                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2 mb-2 mt-auto">
                            <span className="text-lg font-bold text-amber-300">
                              {product.fiyati}
                            </span>
                          </div>

                          <ProductCardActions
                            product={product}
                            add={addToCart}
                            qty={getQty(product.id)}
                            setQty={setQty}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>

          <footer className="bg-slate-950/80 backdrop-blur-md border-t border-amber-400/20 mt-16">
            <div className="container py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h4 className="font-bold text-amber-300 mb-4">Hakkımızda</h4>
                  <p className="text-sm text-slate-400">
                    Seçkin yöresel ürünleri doğrudan üreticiden müşteriye
                    ulaştırıyoruz.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-amber-300 mb-4">Hızlı Linkler</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><Link href="/sepet" className="hover:text-amber-300">Sepetim</Link></li>
                    <li><a href="#" className="hover:text-amber-300">İletişim</a></li>
                    <li><a href="#" className="hover:text-amber-300">Gizlilik Politikası</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-amber-300 mb-4">Kategoriler</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>Peynir</li>
                    <li>Bal</li>
                    <li>Yağ &amp; Pekmez</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-amber-300 mb-4">İletişim</h4>
                  <p className="text-sm text-slate-400">
                    Email: info@premium-urunler.com
                    <br />
                    Telefon: +90 (XXX) XXX-XXXX
                    <br />
                    Adres: Kars, Türkiye
                  </p>
                </div>
              </div>
              <div className="border-t border-amber-400/20 pt-8 text-center text-sm text-slate-500">
                <p>&copy; 2025 Premium Ürün Kataloğu. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
          onAdd={(qty) => addToCart(selectedProduct, qty)}
        />
      )}
    </div>
  );
}
