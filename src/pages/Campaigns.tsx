import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgePercent,
  Calendar,
  Tag,
  Sparkles,
  Truck,
  ShoppingBag,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCampaigns } from "@/hooks/useCampaigns";

function formatDate(d?: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function formatPrice(n: number) {
  try {
    return new Intl.NumberFormat("tr-TR").format(n);
  } catch {
    return String(n);
  }
}

export default function Campaigns() {
  const { campaigns, loading } = useCampaigns();

  return (
    <div className="min-h-screen bg-amber-50/30 font-sans">
      {/* HEADER */}
      <header className="px-4 h-16 flex items-center border-b border-amber-100 bg-white/90 backdrop-blur sticky top-0 z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-amber-900 hover:text-amber-700"
        >
          <ArrowLeft className="w-4 h-4" /> Anasayfa
        </Link>
        <div className="flex-1 text-center">
          <span className="font-serif font-bold text-base text-amber-900">
            Kampanyalar
          </span>
        </div>
        <div className="w-20" />
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #92400e 0%, #d97706 50%, #78350f 100%)",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 py-14 text-center text-white">
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
            className="font-serif font-black text-3xl md:text-5xl mt-2"
          >
            Kampanya Paketleri
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-amber-50/95 max-w-xl mx-auto"
          >
            Kars'ın en seçkin lezzetlerini bir arada sunan özel paketler. Tek
            siparişle hepsi kapınızda.
          </motion.p>
        </div>
      </section>

      {/* PAKETLER */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-amber-100 bg-white p-6 animate-pulse h-96"
              />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {campaigns.map((c, idx) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="group relative rounded-3xl bg-white border border-amber-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                {/* Üst rozetler */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {c.badge && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white px-3 py-1 rounded-full shadow">
                      <Tag className="w-3 h-3" /> {c.badge}
                    </span>
                  )}
                  {typeof c.discountPercent === "number" &&
                    c.discountPercent > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-600 text-white px-3 py-1 rounded-full shadow">
                        <BadgePercent className="w-3 h-3" /> %
                        {c.discountPercent} İndirim
                      </span>
                    )}
                </div>

                {/* Başlık şeridi */}
                <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-6 pt-12 pb-6">
                  <h2 className="font-serif font-bold text-2xl leading-tight">
                    {c.title}
                  </h2>
                  {c.subtitle && (
                    <p className="text-sm text-amber-50/90 mt-1.5">
                      {c.subtitle}
                    </p>
                  )}
                </div>

                {/* Paket içeriği */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[11px] tracking-[0.25em] text-amber-700 font-semibold mb-3">
                    PAKET İÇERİĞİ
                  </p>
                  <ul className="space-y-3">
                    {c.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 bg-amber-50/50 rounded-xl p-2.5 border border-amber-100"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-amber-100 shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-amber-400" />
                          )}
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

                  {(c.startDate || c.endDate) && (
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-amber-700/80">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {c.startDate && formatDate(c.startDate)}
                        {c.startDate && c.endDate && " — "}
                        {c.endDate && formatDate(c.endDate)}
                      </span>
                    </div>
                  )}

                  {/* Toplam ve kargo */}
                  <div className="mt-5 pt-5 border-t border-amber-100">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="text-xs text-amber-700/80 uppercase tracking-wider">
                          Paket Toplamı
                        </div>
                        <div className="font-serif font-black text-3xl text-amber-900 leading-tight">
                          {formatPrice(c.totalPrice)} ₺
                        </div>
                      </div>
                      {c.freeShipping && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full">
                          <Truck className="w-3.5 h-3.5" /> Kargo Ücretsiz
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      {c.ctaLink ? (
                        <a
                          href={c.ctaLink}
                          target={
                            c.ctaLink.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            c.ctaLink.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="block"
                        >
                          <Button className="w-full h-11 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold">
                            {c.ctaLabel || "Sepete Ekle"}
                          </Button>
                        </a>
                      ) : (
                        <Link href="/katalog" className="block">
                          <Button className="w-full h-11 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold">
                            {c.ctaLabel || "Sepete Ekle"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto flex items-center justify-center mb-4">
        <Sparkles className="w-7 h-7 text-amber-700" />
      </div>
      <h2 className="font-serif font-bold text-xl text-amber-900">
        Şu anda aktif kampanya paketi yok
      </h2>
      <p className="text-sm text-amber-700/80 mt-2">
        Yakında sürpriz fırsatlarla burada olacağız. Bizi takipte kalın.
      </p>
      <div className="mt-6">
        <Link href="/">
          <Button className="rounded-full bg-amber-700 hover:bg-amber-800">
            Anasayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
