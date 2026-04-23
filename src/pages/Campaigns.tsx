import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  MessageCircle,
  Calendar,
  Tag,
  Sparkles,
  Truck,
  Check,
  BadgePercent,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "905XXXXXXXXX";

type CampaignItem = { name: string; image: string };
type Campaign = {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  discountPercent?: number;
  items: CampaignItem[];
  totalPrice: number;
  freeShipping?: boolean;
};

const CAMPAIGNS: Campaign[] = [
  {
    id: "kampanya-1",
    title: "Kars Klasikleri Paketi",
    subtitle: "Eski kaşar ve kahvaltı seti — Kars'tan kapınıza",
    badge: "En Çok Tercih Edilen",
    items: [
      {
        name: "1 kg Eski Kaşar",
        image:
          "https://avatars.mds.yandex.net/i?id=5c71925daff1e52bcee998e48e46ed68d89ba315-5330491-images-thumbs&n=13",
      },
      {
        name: "1 kg Kahvaltılık Tereyağı",
        image:
          "https://beylerbeyisut.com/cdn/shop/files/6c49a0219af94fdb5e9ba51a41e04ead_1000x.jpg?v=1759950291",
      },
      {
        name: "1 kg Yağlı Peynir",
        image:
          "https://vanotlupeyniri.net/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-22-at-15.02.40.jpeg",
      },
      {
        name: "1 kg Süzme Bal",
        image:
          "https://cdn.myikas.com/images/0bbe685f-304d-44f2-acac-6f0cf25cde07/2732ac63-9f46-4f8f-a406-679cf33504a6/3840/img-20250519-1428161.webp",
      },
    ],
    totalPrice: 1850,
    freeShipping: true,
  },
  {
    id: "kampanya-2",
    title: "Taze Kahvaltı Paketi",
    subtitle: "Taze kaşar severlere özel set",
    badge: "Yeni",
    items: [
      {
        name: "1 kg Taze Kaşar",
        image:
          "https://cdn.myikas.com/images/4ef9f449-638c-43b4-afe3-fb211708dfd0/e5fba6f7-efed-41df-a237-90c2ec9f028f/3840/taze-kars-kasari.webp",
      },
      {
        name: "1 kg Kahvaltılık Tereyağı",
        image:
          "https://beylerbeyisut.com/cdn/shop/files/6c49a0219af94fdb5e9ba51a41e04ead_1000x.jpg?v=1759950291",
      },
      {
        name: "1 kg Yağlı Peynir",
        image:
          "https://vanotlupeyniri.net/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-22-at-15.02.40.jpeg",
      },
      {
        name: "1 kg Süzme Bal",
        image:
          "https://cdn.myikas.com/images/0bbe685f-304d-44f2-acac-6f0cf25cde07/2732ac63-9f46-4f8f-a406-679cf33504a6/3840/img-20250519-1428161.webp",
      },
    ],
    totalPrice: 1750,
    freeShipping: true,
  },
  {
    id: "kampanya-3",
    title: "3 kg Eski Kaşar Avantaj Paketi",
    subtitle: "Toplu alımlar için özel fiyat",
    badge: "Fırsat",
    discountPercent: 15,
    items: [
      {
        name: "3 kg Eski Kaşar",
        image:
          "https://avatars.mds.yandex.net/i?id=5c71925daff1e52bcee998e48e46ed68d89ba315-5330491-images-thumbs&n=13",
      },
    ],
    totalPrice: 1650,
    freeShipping: true,
  },
];

const NAV_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Premium Katalog", href: "/katalog" },
  { label: "Kampanyalar", href: "/kampanyalar" },
  { label: "Kurumsal", href: "/kurumsal" },
];

function formatPrice(n: number) {
  try {
    return new Intl.NumberFormat("tr-TR").format(n);
  } catch {
    return String(n);
  }
}

function buildWhatsAppLink(c: Campaign) {
  const lines = [
    `Merhaba, *${c.title}* kampanyasından sipariş vermek istiyorum.`,
    "",
    "Paket içeriği:",
    ...c.items.map((i) => `• ${i.name}`),
    "",
    `Toplam: ${formatPrice(c.totalPrice)} ₺${c.freeShipping ? " (Ücretsiz Kargo)" : ""}`,
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => setOpen(true)}
            aria-label="Menü"
            className="lg:hidden p-2 -ml-2 text-amber-900"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex flex-col items-center lg:items-start leading-tight">
            <span className="text-[9px] tracking-[0.3em] text-amber-700 font-semibold">
              KARS'TAN
            </span>
            <span className="font-serif font-black text-lg sm:text-xl text-amber-900">
              Marifet Şarküteri
            </span>
            <span className="text-[8px] tracking-[0.25em] text-amber-600">
              DOĞAL & ORGANİK
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  l.href === "/kampanyalar"
                    ? "text-amber-700 border-b-2 border-amber-600 pb-1"
                    : "text-amber-900 hover:text-amber-700"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden lg:inline-flex items-center px-4 py-2 rounded-full border-2 border-amber-600 text-amber-700 font-semibold text-sm hover:bg-amber-600 hover:text-white transition-colors"
            >
              Bayi Girişi
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="p-2 text-amber-700 hover:text-amber-900"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <Link href="/sepet" aria-label="Sepet" className="p-2 text-amber-700 hover:text-amber-900">
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute left-0 top-0 bottom-0 w-72 max-w-[85%] bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-serif font-bold text-amber-900">Menü</span>
                <button onClick={() => setOpen(false)} aria-label="Kapat" className="p-1 text-amber-900">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-lg text-amber-900 hover:bg-amber-50 font-medium"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="mt-4 text-center px-4 py-3 rounded-full border-2 border-amber-600 text-amber-700 font-semibold hover:bg-amber-600 hover:text-white"
                >
                  Bayi Girişi
                </Link>
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Campaigns() {
  return (
    <div className="min-h-screen bg-amber-50/30 font-sans">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #92400e 0%, #d97706 50%, #78350f 100%)",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] tracking-[0.3em] uppercase text-amber-100/90"
          >
            Marifet Şarküteri
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-serif font-black text-3xl sm:text-4xl md:text-5xl mt-2"
          >
            Kampanya Paketleri
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-amber-50/95 max-w-xl mx-auto text-sm sm:text-base"
          >
            Kars'ın en seçkin lezzetlerini bir arada sunan özel paketler. Tek
            siparişle hepsi kapınızda.
          </motion.p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CAMPAIGNS.map((c, idx) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="group relative rounded-3xl bg-white border border-amber-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
            >
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {c.badge && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white px-3 py-1 rounded-full shadow">
                    <Tag className="w-3 h-3" /> {c.badge}
                  </span>
                )}
                {typeof c.discountPercent === "number" && c.discountPercent > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-600 text-white px-3 py-1 rounded-full shadow">
                    <BadgePercent className="w-3 h-3" /> %{c.discountPercent} İndirim
                  </span>
                )}
              </div>

              <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-5 sm:px-6 pt-12 pb-5 sm:pb-6">
                <h2 className="font-serif font-bold text-xl sm:text-2xl leading-tight">
                  {c.title}
                </h2>
                {c.subtitle && (
                  <p className="text-xs sm:text-sm text-amber-50/90 mt-1.5">
                    {c.subtitle}
                  </p>
                )}
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <p className="text-[11px] tracking-[0.25em] text-amber-700 font-semibold mb-3">
                  PAKET İÇERİĞİ
                </p>
                <ul className="space-y-2.5">
                  {c.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 bg-amber-50/50 rounded-xl p-2 border border-amber-100"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-amber-100 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-amber-900 truncate">
                          {item.name}
                        </div>
                      </div>
                      <Check className="w-4 h-4 text-amber-700 shrink-0" />
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-5 border-t border-amber-100">
                  <div className="flex items-end justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-xs text-amber-700/80 uppercase tracking-wider">
                        Paket Toplamı
                      </div>
                      <div className="font-serif font-black text-2xl sm:text-3xl text-amber-900 leading-tight">
                        {formatPrice(c.totalPrice)} ₺
                      </div>
                    </div>
                    {c.freeShipping && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full">
                        <Truck className="w-3.5 h-3.5" /> Kargo Ücretsiz
                      </span>
                    )}
                  </div>

                  <a
                    href={buildWhatsAppLink(c)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4"
                  >
                    <Button className="w-full h-11 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold gap-2">
                      <Send className="w-4 h-4" /> Sepete Ekle
                    </Button>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
