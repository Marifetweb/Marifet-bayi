import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Minus, ShoppingBag, X, Menu, Search, Phone,
  ChevronRight, ChevronLeft, MessageCircle, User, LogOut, BadgePercent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { effectivePrice, qtyStep, snapQty, DEALER_DISCOUNT, DEALER_QTY_STEP } from "@/lib/pricing";
import { formatTL } from "@/lib/utils";

const WA_NUMBER = "905404614635";
const PHONE_NUMBER = "05404614635";
const PHONE_LINK = "tel:+905404614635";

const NAV_LINKS = [
  { label: "Anasayfa", href: "#hero" },
  { label: "Urunler", href: "#products" },
  { label: "En Cok Satanlar", href: "#bestsellers" },
  { label: "Hakkimizda", href: "#about" },
  { label: "Iletisim", href: "#contact" },
];

export default function Home() {
  const { products } = useProducts();
  const { user, profile, isDealer, logout } = useAuth();

  const [cart, setCart] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [waMessage, setWaMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tumu");
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Bayi durumu degistiginde sepet adetlerini dogru adim katina sabitle
  useEffect(() => {
    setCart((prev) => {
      const next: Record<string, number> = {};
      for (const [id, qty] of Object.entries(prev)) {
        const snapped = snapQty(qty, isDealer);
        if (snapped > 0) next[id] = snapped;
      }
      return next;
    });
  }, [isDealer]);

  useEffect(() => {
    if (profile?.fullName && !customerName) setCustomerName(profile.fullName);
  }, [profile?.fullName]);

  const HERO_SLIDES = useMemo(() => ([
    { title: "Kars'in En Seckin Lezzetleri", subtitle: "Dogal, katkisiz, geleneksel yontemlerle uretilmis.", cta: "Urunleri Incele", bg: "from-amber-900/80 to-amber-700/60", image: products[0]?.image },
    { title: "Taze Sut'ten Dogal Tereyagi", subtitle: "Koy yontemleriyle yayikta yapilan gercek tereyagi.", cta: "Hemen Siparis Ver", bg: "from-yellow-900/80 to-yellow-600/50", image: products[16]?.image || products[0]?.image },
    { title: "Petek'ten Sofraya Saf Bal", subtitle: "Kars yaylalarinin esiksiz aromasi.", cta: "Bali Kesfet", bg: "from-amber-800/80 to-orange-600/50", image: products[11]?.image || products[0]?.image },
  ]), [products]);

  useEffect(() => {
    heroTimer.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => { if (heroTimer.current) clearInterval(heroTimer.current); };
  }, [HERO_SLIDES.length]);

  const changeHero = (dir: number) => {
    if (heroTimer.current) clearInterval(heroTimer.current);
    setHeroIndex((i) => (i + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
    heroTimer.current = setInterval(() => setHeroIndex((i) => (i + 1) % HERO_SLIDES.length), 5000);
  };

  const step = qtyStep(isDealer);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta * step);
      const updated = { ...prev };
      if (next === 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce((acc, p) => acc + (cart[p.id] || 0) * effectivePrice(p.price, isDealer), 0);
  const FREE_SHIPPING_THRESHOLD = 2500;
  const SHIPPING_FEE = 185;
  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = totalPrice + shippingCost;
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;

  const CATEGORIES = useMemo(() => ["Tumu", ...Array.from(new Set(products.map((p) => p.category)))], [products]);

  const filteredProducts = products.filter((p) => {
    const matchCat = activeCategory === "Tumu" || p.category === activeCategory;
    const matchSearch = (p.name || "").toLowerCase().includes((searchQuery || "").toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOrder = () => {
    if (totalItems === 0) { alert("Lutfen once urun secin."); return; }
    if (!customerName.trim()) { alert("Lutfen adinizi girin."); return; }
    const lines = products.filter((p) => (cart[p.id] || 0) > 0)
      .map((p) => {
        const unit = effectivePrice(p.price, isDealer);
        return `- ${cart[p.id]}x ${p.name} → ${formatTL(unit * cart[p.id])} TL`;
      })
      .join("\n");
    const kargoText = shippingCost === 0 ? "Kargo: Ucretsiz 🎉" : `Kargo: ${SHIPPING_FEE} ₺`;
    const dealerNote = isDealer
      ? `\n*** BAYI SIPARISI ***\nBayi: ${profile?.companyName || "-"}\nIndirim: %${Math.round(DEALER_DISCOUNT * 100)}\n`
      : "";
    const msg = `Merhaba! Siparis vermek istiyorum 🌿${dealerNote}\n\n${lines}\n\nUrun Toplami: ${formatTL(totalPrice)} ₺\n${kargoText}\nGenel Toplam: ${formatTL(grandTotal)} ₺\n\nAd: ${customerName}\nNot: ${note || "Yok"}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleWaSend = () => {
    const text = waMessage.trim() || "Merhaba, bilgi almak istiyorum.";
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* OVERLAYS */}
      <AnimatePresence>
        {(menuOpen || waOpen) && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => { setMenuOpen(false); setWaOpen(false); }}
          />
        )}
      </AnimatePresence>

      {/* SLIDE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            key="menu"
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] z-50 bg-card shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex flex-col leading-none">
                <span className="text-[8px] font-medium tracking-[0.2em] uppercase text-primary/60">Kars'tan</span>
                <span className="font-serif font-black text-base text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #92400e 0%, #d97706 50%, #78350f 100%)" }}>Marifet Şarküteri</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-secondary text-foreground font-medium transition-colors text-left group"
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-border space-y-1">
                {isDealer ? (
                  <>
                    <div className="px-4 py-2 text-xs">
                      <div className="text-muted-foreground">Giris yapildi</div>
                      <div className="font-semibold text-foreground truncate">{profile?.companyName || profile?.fullName}</div>
                      <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <BadgePercent className="w-3 h-3" /> Bayi · %{Math.round(DEALER_DISCOUNT * 100)}
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-secondary text-foreground font-medium transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Cikis Yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/giris" className="w-full flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-secondary text-foreground font-medium transition-colors">
                      <User className="w-4 h-4" /> Bayi Girisi
                    </Link>
                    <Link href="/kayit" className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold transition-colors">
                      <BadgePercent className="w-4 h-4" /> Bayi Kayit · %{Math.round(DEALER_DISCOUNT * 100)} indirim
                    </Link>
                  </>
                )}
              </div>
            </nav>
            <div className="p-6 border-t border-border space-y-3">
              <a href={PHONE_LINK} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">
                <Phone className="w-4 h-4" /> {PHONE_NUMBER}
              </a>
              <button onClick={() => { setMenuOpen(false); setWaOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 text-green-700 font-medium hover:bg-green-100 transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp ile Yaz
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* WHATSAPP PANEL */}
      <AnimatePresence>
        {waOpen && (
          <motion.aside
            key="wa"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-50 bg-card shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border bg-green-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><MessageCircle className="w-5 h-5" /></div>
                <div>
                  <div className="font-semibold text-sm">Marifet Sarkuteri</div>
                  <div className="text-xs text-green-100">WhatsApp ile yaz</div>
                </div>
              </div>
              <button onClick={() => setWaOpen(false)} className="p-1.5 rounded-full hover:bg-white/20 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <a href={PHONE_LINK} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-secondary transition-colors">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center"><Phone className="w-4 h-4 text-blue-600" /></div>
                <div>
                  <div className="text-xs text-muted-foreground">Telefon ile Ara</div>
                  <div className="font-semibold text-sm">{PHONE_NUMBER}</div>
                </div>
              </a>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-800 font-medium mb-1">Merhaba!</p>
                <p className="text-sm text-green-700">Size nasil yardimci olabiliriz? Asagiya mesajinizi yazin.</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Mesajiniz</label>
                <Textarea placeholder="Mesaj yazin..." value={waMessage} onChange={(e) => setWaMessage(e.target.value)} className="min-h-[120px] resize-none" />
              </div>
            </div>
            <div className="p-5 border-t border-border space-y-2">
              <Button onClick={handleWaSend} className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp'ta Ac</Button>
              <p className="text-xs text-center text-muted-foreground">{PHONE_NUMBER}</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
        {isDealer && (
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
            <BadgePercent className="w-3.5 h-3.5" />
            Bayi modu aktif — Tum fiyatlar %{Math.round(DEALER_DISCOUNT * 100)} indirimli, sepete {DEALER_QTY_STEP}'lu paketler halinde
          </div>
        )}
        <div className="px-4 h-16 flex items-center justify-between max-w-screen-xl mx-auto">
          <button onClick={() => setMenuOpen(true)} className="p-2 -ml-1 rounded-xl hover:bg-secondary transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          <button onClick={() => scrollTo("#hero")} className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none">
            <span className="text-[9px] font-medium tracking-[0.25em] uppercase text-primary/70 mb-0.5">Kars'tan</span>
            <span className="font-serif font-black whitespace-nowrap text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #92400e 0%, #d97706 40%, #b45309 70%, #78350f 100%)", fontSize: "1.15rem", letterSpacing: "-0.01em" }}>
              Marifet Şarküteri
            </span>
            <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground mt-0.5">Dogal &amp; Organik</span>
          </button>

          <div className="flex items-center gap-1">
            {!user ? (
              <Link href="/giris" className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 text-xs font-semibold rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
                <BadgePercent className="w-3.5 h-3.5" /> Bayi Girisi
              </Link>
            ) : (
              <button onClick={() => logout()} title="Cikis" className="p-2 rounded-xl hover:bg-secondary transition-colors text-foreground">
                <LogOut className="w-5 h-5" />
              </button>
            )}
            <button onClick={() => setWaOpen(true)} className="p-2 rounded-xl hover:bg-green-50 text-green-600 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button onClick={() => scrollTo("#checkout")} className="p-2 rounded-xl hover:bg-secondary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold">{totalItems}</span>
              )}
            </button>
          </div>
        </div>

        <div className="px-4 pb-2.5 max-w-screen-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Urun ara... (kasar, bal, tereyagi...)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9 text-sm bg-secondary/50 border-0 rounded-xl focus-visible:ring-1" />
          </div>
        </div>
      </header>

      <main className={isDealer ? "pt-32 pb-28" : "pt-28 pb-28"}>

        {/* HERO */}
        <section id="hero" className="relative h-[60vw] min-h-64 max-h-[480px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={heroIndex} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.7 }} className="absolute inset-0">
              {HERO_SLIDES[heroIndex]?.image && <img src={HERO_SLIDES[heroIndex].image} alt="" className="w-full h-full object-cover" />}
              <div className={`absolute inset-0 bg-gradient-to-r ${HERO_SLIDES[heroIndex]?.bg}`} />
            </motion.div>
          </AnimatePresence>
          <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10">
            <motion.div key={`text-${heroIndex}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">Marifet Sarkuteri</p>
              <h1 className="text-white text-2xl md:text-4xl font-serif font-bold leading-tight mb-2">{HERO_SLIDES[heroIndex]?.title}</h1>
              <p className="text-white/80 text-sm mb-4">{HERO_SLIDES[heroIndex]?.subtitle}</p>
              <Button onClick={() => scrollTo("#products")} className="bg-white text-amber-900 hover:bg-white/90 h-10 px-6 rounded-full text-sm font-semibold">
                {HERO_SLIDES[heroIndex]?.cta}
              </Button>
            </motion.div>
          </div>
          <button onClick={() => changeHero(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => changeHero(1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setHeroIndex(i)} className={`h-1.5 rounded-full transition-all ${i === heroIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        </section>

        {/* DEALER CTA when not logged in */}
        {!user && (
          <section className="px-4 mt-6">
            <div className="max-w-screen-xl mx-auto bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <BadgePercent className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-bold text-lg leading-snug">Bayi misiniz?</div>
                <div className="text-xs text-amber-50/90">Hemen kaydolun, tum urunlerde %{Math.round(DEALER_DISCOUNT * 100)} indirim ve {DEALER_QTY_STEP}'lu toptan paketleri kullanin.</div>
              </div>
              <Link href="/kayit" className="flex-shrink-0">
                <Button variant="secondary" className="h-9 rounded-full text-xs font-bold bg-white text-amber-800 hover:bg-amber-50 px-4">Kaydol</Button>
              </Link>
            </div>
          </section>
        )}

        {/* BEST SELLERS */}
        {products.some((p) => p.badge) && (
          <section id="bestsellers" className="py-10 px-4">
            <div className="max-w-screen-xl mx-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-serif font-bold text-foreground">En Cok Satanlar</h2>
                <button onClick={() => scrollTo("#products")} className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                  Tumunu Gor <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                {products.filter((p) => p.badge).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    qty={cart[product.id] || 0}
                    isDealer={isDealer}
                    step={step}
                    onChange={updateQty}
                    compact
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CATEGORIES */}
        <section id="products" className="px-4 mb-2">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4">Tum Urunler</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="py-4 px-4">
          <div className="max-w-screen-xl mx-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Aramanizla eslesen urun bulunamadi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    qty={cart[product.id] || 0}
                    isDealer={isDealer}
                    step={step}
                    onChange={updateQty}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-12 px-4 bg-secondary/30 mt-6">
          <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {products[0]?.image && <img src={products[0].image} alt="Kars Kaşarı" className="w-full max-w-sm mx-auto rounded-2xl shadow-lg object-cover aspect-square" />}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Marifet Sarkuteri Hakkinda</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kars'in emsalsiz dogasindan, goz nurumuz olan hayvanlarimizan elde edilen urünleri sizlere sunmaktan buyuk gurur duyuyoruz. Geleneksel yontemlerimiz, nesiller boyu aktarilan bilgi birikimi ile bulusarak her bir urunumuzu ozel kiliyor.
              </p>
              <ul className="space-y-3">
                {["100% Dogal ve Katkisiz", "Gercek Koy Uretimi", "Tum Turkiye'ye Ucretsiz Kargo", "EFT / Havale / Kart ile Odeme"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* CHECKOUT */}
        <section id="checkout" className="py-12 px-4">
          <div className="max-w-lg mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-3xl border border-border shadow-lg overflow-hidden">
              <div className="bg-primary p-6 text-primary-foreground text-center">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <h2 className="text-2xl font-serif font-bold">Siparisi Tamamla</h2>
                <p className="text-primary-foreground/70 text-sm mt-1">WhatsApp uzerinden profesyonel siparis</p>
                {isDealer && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                    <BadgePercent className="w-3.5 h-3.5" /> Bayi · %{Math.round(DEALER_DISCOUNT * 100)} indirim uygulandi
                  </p>
                )}
              </div>

              <div className="p-6">
                {totalItems === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-medium">Sepetiniz bos</p>
                    <p className="text-sm mt-1">Urunlere gidip secim yapin.</p>
                    <Button variant="outline" onClick={() => scrollTo("#products")} className="mt-4 rounded-full">Urunleri Goster</Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {remainingForFreeShipping > 0 ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                        <div className="flex justify-between text-xs font-medium text-amber-800 mb-1.5">
                          <span>Ucretsiz kargoya</span>
                          <span>{formatTL(remainingForFreeShipping)} ₺ kaldi</span>
                        </div>
                        <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500" style={{ width: `${Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-2">
                        <span className="text-green-600 text-lg">🎉</span>
                        <span className="text-green-700 text-sm font-medium">Kargonuz ucretsiz!</span>
                      </div>
                    )}

                    <div className="bg-secondary/50 rounded-2xl p-4 space-y-2.5">
                      {products.filter((p) => (cart[p.id] || 0) > 0).map((p) => {
                        const unit = effectivePrice(p.price, isDealer);
                        return (
                          <div key={p.id} className="flex justify-between items-center text-sm">
                            <span className="text-foreground flex-1 pr-2">{cart[p.id]}x {p.name}</span>
                            <span className="font-bold text-primary flex-shrink-0">{formatTL(unit * cart[p.id])} ₺</span>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t border-border/60 flex justify-between text-sm text-muted-foreground">
                        <span>Urun Toplami</span><span>{formatTL(totalPrice)} ₺</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={shippingCost === 0 ? "text-green-600 font-medium" : "text-muted-foreground"}>Kargo {shippingCost === 0 && "(Ucretsiz)"}</span>
                        <span className={shippingCost === 0 ? "text-green-600 font-bold" : "text-foreground"}>{shippingCost === 0 ? "0 ₺" : `${formatTL(SHIPPING_FEE)} ₺`}</span>
                      </div>
                      <div className="pt-2 border-t border-border flex justify-between items-center">
                        <span className="font-serif font-bold text-foreground">Genel Toplam</span>
                        <span className="text-primary font-bold text-lg">{formatTL(grandTotal)} ₺</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Adiniz Soyadiniz</label>
                        <Input placeholder="Ornegin: Ahmet Yilmaz" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="rounded-xl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Siparis Notu (Istege Bagli)</label>
                        <Textarea placeholder="Adres, ozel istek, teslimat notu..." value={note} onChange={(e) => setNote(e.target.value)} className="rounded-xl min-h-[90px] resize-none" />
                      </div>
                    </div>

                    <Button onClick={handleOrder} className="w-full h-14 text-base rounded-2xl gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25">
                      <MessageCircle className="w-5 h-5" /> WhatsApp ile Siparis Ver
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">2.500 ₺ uzeri siparislerde kargo ucretsiz · Kargo: 185 ₺</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-10 px-4 bg-foreground text-background">
          <div className="max-w-screen-xl mx-auto text-center space-y-4">
            <div className="flex flex-col items-center leading-none mb-2">
              <span className="text-[9px] font-medium tracking-[0.25em] uppercase text-background/50 mb-0.5">Kars'tan</span>
              <span className="font-serif font-black text-2xl text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #fbbf24 100%)" }}>Marifet Şarküteri</span>
              <span className="text-[8px] tracking-[0.3em] uppercase text-background/40 mt-0.5">Dogal &amp; Organik</span>
            </div>
            <p className="text-background/60 text-sm max-w-xs mx-auto">Gercek, dogal, koyden sofraniza. Tum Turkiye'ye ucretsiz kargo.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a href={PHONE_LINK} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-background/20 hover:bg-background/10 transition-colors text-sm font-medium">
                <Phone className="w-4 h-4" /> {PHONE_NUMBER}
              </a>
              <button onClick={() => setWaOpen(true)} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-500 transition-colors text-sm font-medium">
                <MessageCircle className="w-4 h-4" /> WhatsApp'tan Yaz
              </button>
            </div>
            <p className="text-background/30 text-xs pt-4">EFT / Havale / Kart ile Odeme Kabul Edilir</p>
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-card/95 backdrop-blur-md border-t border-border/60">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <a href={PHONE_LINK} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-foreground">
            <Phone className="w-4 h-4 text-blue-600" /> Ara
          </a>
          <button onClick={() => setWaOpen(true)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-green-600 hover:bg-green-700 transition-colors text-sm font-medium text-white">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => scrollTo("#checkout")}
                className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-primary hover:bg-primary/90 transition-colors text-sm font-bold text-primary-foreground"
              >
                <ShoppingBag className="w-4 h-4" /> {totalItems} Adet · {formatTL(grandTotal)} ₺
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product, qty, isDealer, step, onChange, compact = false,
}: {
  product: { id: string; name: string; category: string; price: number; image: string; badge?: string };
  qty: number;
  isDealer: boolean;
  step: number;
  onChange: (id: string, delta: number) => void;
  compact?: boolean;
}) {
  const unit = effectivePrice(product.price, isDealer);
  const discounted = isDealer && unit !== product.price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={
        compact
          ? "flex-shrink-0 w-44 snap-start bg-card rounded-2xl shadow-sm border border-border/60 overflow-hidden"
          : "bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      }
    >
      <div className="relative aspect-square">
        {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">{product.badge}</span>
        )}
        {discounted && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <BadgePercent className="w-3 h-3" /> -%{Math.round(DEALER_DISCOUNT * 100)}
          </span>
        )}
        {!compact && !discounted && (
          <div className="absolute top-2 right-2">
            <span className="bg-black/30 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">{product.category}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className={`text-xs font-${compact ? "medium" : "semibold"} text-foreground leading-snug ${compact ? "line-clamp-2 mb-2" : "mb-2 line-clamp-2 min-h-[2.5rem]"}`}>{product.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            {discounted && (
              <span className="text-[10px] text-muted-foreground line-through">{formatTL(product.price)} ₺</span>
            )}
            <span className="text-primary font-bold text-sm">{formatTL(unit)} ₺</span>
          </div>
          <div className="flex items-center gap-1 bg-secondary rounded-full px-1.5 py-1">
            <button
              onClick={() => onChange(product.id, -1)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-background transition-colors"
              aria-label="azalt"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold min-w-[1.5rem] text-center px-1">
              {qty}
              {isDealer && qty > 0 && <span className="text-[8px] text-muted-foreground block leading-none">×{step}</span>}
            </span>
            <button
              onClick={() => onChange(product.id, 1)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-background transition-colors"
              aria-label="arttir"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
        {isDealer && (
          <p className="mt-1.5 text-[10px] text-muted-foreground text-right">Adim: {step}</p>
        )}
      </div>
    </motion.div>
  );
}
