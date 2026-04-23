import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  Phone,
  User,
  Percent,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Tag,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
   SEPET HOOK - localStorage tabanlı, tüm sayfalar arası senkron
   ============================================================ */
const CART_KEY = "marifet_cart";

export type CartItem = {
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

export function useCart() {
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
  const remove = (id: number) =>
    writeCart(readCart().filter((i) => i.id !== id));
  const setQty = (id: number, qty: number) => {
    if (qty <= 0) return remove(id);
    const cur = readCart();
    const idx = cur.findIndex((i) => i.id === id);
    if (idx >= 0) {
      cur[idx].qty = qty;
      writeCart(cur);
    }
  };
  const clear = () => writeCart([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.fiyat_sayi * i.qty, 0);

  return { items, add, remove, setQty, clear, count, total };
}

/* ============================================================
   SEPET SAYFASI
   ============================================================ */
export default function Cart() {
  const [location] = useLocation();
  const { items, remove, setQty, clear, count, total } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [kurumsalOpen, setKurumsalOpen] = useState(false);
  const [kurumsalMobileOpen, setKurumsalMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const SHIPPING_THRESHOLD = 500;
  const shipping = total >= SHIPPING_THRESHOLD || total === 0 ? 0 : 39.9;
  const grandTotal = total + shipping;
  const remainingForFree = Math.max(0, SHIPPING_THRESHOLD - total);
  const freeShippingProgress = Math.min(
    100,
    (total / SHIPPING_THRESHOLD) * 100
  );

  const whatsappOrderText = encodeURIComponent(
    `Merhaba, aşağıdaki ürünleri sipariş etmek istiyorum:\n\n${items
      .map((i) => `• ${i.urun_adi} x${i.qty} = ${(i.fiyat_sayi * i.qty).toFixed(2)}₺`)
      .join("\n")}\n\nToplam: ${grandTotal.toFixed(2)}₺`
  );
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappOrderText}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-amber-50/30 text-slate-900 font-sans">
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
                return isHash ? (
                  <a key={link.href} href={link.href} className={className}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className={className}>
                    {link.label}
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
            <Link href="/sepet" className="relative p-2 rounded-lg hover:bg-amber-50">
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
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-amber-900 font-semibold hover:bg-amber-50"
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-4 h-4 text-amber-500" />
                      </Link>
                    </li>
                  ))}
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
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-amber-900 font-semibold hover:bg-amber-50"
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

      {/* SAYFA İÇERİĞİ */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb + Başlık */}
        <div className="flex items-center gap-2 text-sm text-amber-700 mb-4">
          <Link href="/" className="hover:text-amber-900 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Alışverişe Devam Et
          </Link>
        </div>

        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-xs tracking-[0.3em] text-amber-700">SEPETİM</p>
            <h1 className="font-serif font-black text-3xl md:text-4xl text-amber-900 mt-1">
              Sepetiniz
            </h1>
          </div>
          {count > 0 && (
            <div className="text-sm text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full font-semibold">
              {count} ürün
            </div>
          )}
        </div>

        {items.length === 0 ? (
          /* BOŞ SEPET */
          <div className="bg-white rounded-3xl border border-amber-100 p-10 md:p-16 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-5">
              <ShoppingCart className="w-10 h-10 text-amber-700" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-amber-900 mb-2">
              Sepetiniz boş
            </h2>
            <p className="text-slate-600 mb-6">
              Henüz sepete ürün eklemediniz. Premium katalogtaki seçkin
              lezzetlere göz atın.
            </p>
            <Link href="/katalog">
              <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full px-8 py-6 font-semibold shadow-lg">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ürünleri İncele
              </Button>
            </Link>
          </div>
        ) : (
          /* DOLU SEPET — 2 sütun: liste + özet */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* SOL: ÜRÜN LİSTESİ */}
            <div className="lg:col-span-2 space-y-4">
              {/* Kargo barı */}
              <div className="bg-white border border-amber-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-amber-700" />
                  {remainingForFree > 0 ? (
                    <span className="text-sm text-slate-700">
                      Ücretsiz kargo için{" "}
                      <span className="font-bold text-amber-700">
                        {remainingForFree.toFixed(2)}₺
                      </span>{" "}
                      daha ekleyin
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-emerald-700 inline-flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Tebrikler! Kargo ücretsiz
                    </span>
                  )}
                </div>
                <div className="h-2 bg-amber-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-amber-100 rounded-2xl p-4 shadow-sm flex gap-4"
                  >
                    {/* Görsel */}
                    <Link href="/katalog" className="shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-amber-50 rounded-xl overflow-hidden">
                        <img
                          src={item.urun_gorseli}
                          alt={item.urun_adi}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/120?text=Ürün";
                          }}
                        />
                      </div>
                    </Link>

                    {/* Bilgi */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {item.kategori && (
                            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-700">
                              {item.kategori}
                            </span>
                          )}
                          <h3 className="font-bold text-sm md:text-base text-slate-900 line-clamp-2">
                            {item.urun_adi}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          aria-label="Sepetten çıkar"
                          className="shrink-0 w-8 h-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1" />

                      <div className="flex items-end justify-between gap-3 mt-2">
                        {/* Miktar */}
                        <div className="flex items-center bg-slate-100 rounded-full p-1">
                          <button
                            type="button"
                            onClick={() => setQty(item.id, item.qty - 1)}
                            aria-label="Azalt"
                            className="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-amber-50 text-slate-700 flex items-center justify-center transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-slate-900 w-8 text-center text-sm">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(item.id, item.qty + 1)}
                            aria-label="Artır"
                            className="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-amber-50 text-slate-700 flex items-center justify-center transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Fiyat */}
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500 font-semibold">
                            {item.fiyati} × {item.qty}
                          </div>
                          <div className="font-bold text-amber-800 text-base md:text-lg">
                            {(item.fiyat_sayi * item.qty).toFixed(2)}₺
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Sepeti temizle */}
              <button
                type="button"
                onClick={clear}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-red-600 font-semibold py-2 px-4 transition"
              >
                <Trash2 className="w-4 h-4" />
                Sepeti Temizle
              </button>
            </div>

            {/* SAĞ: ÖZET */}
            <aside className="lg:col-span-1">
              <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="font-serif font-bold text-xl text-amber-900 mb-5">
                  Sipariş Özeti
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Ara toplam</span>
                    <span className="font-semibold text-slate-900">
                      {total.toFixed(2)}₺
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Kargo</span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-emerald-600">
                        Ücretsiz
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-900">
                        {shipping.toFixed(2)}₺
                      </span>
                    )}
                  </div>

                  <div className="border-t border-amber-100 pt-3 flex items-end justify-between">
                    <span className="text-amber-900 font-bold">Toplam</span>
                    <div className="text-right">
                      <div className="font-serif font-black text-2xl text-amber-900 leading-none">
                        {grandTotal.toFixed(2)}₺
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        KDV dahil
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kupon */}
                <div className="mt-5 flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                    <input
                      type="text"
                      placeholder="İndirim kodu"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-amber-200 bg-amber-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-lg bg-amber-100 text-amber-800 font-semibold text-sm hover:bg-amber-200 transition"
                  >
                    Uygula
                  </button>
                </div>

                {/* Aksiyon butonları */}
                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-900/20 transition-all hover:shadow-amber-900/40 hover:-translate-y-0.5"
                  >
                    Siparişi Tamamla
                    <ChevronRight className="w-4 h-4" />
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

                {/* Güven satırı */}
                <div className="mt-5 pt-4 border-t border-amber-100 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-semibold text-slate-600 leading-tight">
                      Güvenli Ödeme
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span className="text-[10px] font-semibold text-slate-600 leading-tight">
                      Hızlı Kargo
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Phone className="w-4 h-4 text-amber-700" />
                    <a
                      href={`tel:${PHONE_NUMBER}`}
                      className="text-[10px] font-semibold text-slate-600 hover:text-amber-700 leading-tight"
                    >
                      Destek
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-amber-950 text-amber-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-amber-300/70">
          © {new Date().getFullYear()} Marifet Şarküteri. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
