import { useEffect, useState } from "react";
import { client, urlFor } from "@/lib/sanity";

export interface CampaignItem {
  name: string;
  image?: string;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle?: string;
  items: CampaignItem[];
  totalPrice: number;
  freeShipping: boolean;
  badge?: string;
  discountPercent?: number;
  startDate?: string;
  endDate?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

const QUERY = `*[_type == "campaign" && (isActive == true || !defined(isActive))
  && (!defined(startDate) || startDate <= now())
  && (!defined(endDate) || endDate >= now())
] | order(order asc, _createdAt desc) {
  _id,
  title,
  subtitle,
  items[]{
    name,
    image
  },
  totalPrice,
  freeShipping,
  badge,
  discountPercent,
  startDate,
  endDate,
  ctaLabel,
  ctaLink
}`;

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    client
      .fetch(QUERY)
      .then((data: any[]) => {
        if (cancelled) return;
        const mapped: Campaign[] = (data || []).map((d) => ({
          id: d._id,
          title: d.title,
          subtitle: d.subtitle,
          items: (d.items || []).map((it: any) => ({
            name: it?.name || "",
            image: it?.image ? urlFor(it.image).width(200).height(200).url() : undefined,
          })),
          totalPrice: typeof d.totalPrice === "number" ? d.totalPrice : 0,
          freeShipping: d.freeShipping !== false,
          badge: d.badge,
          discountPercent: d.discountPercent,
          startDate: d.startDate,
          endDate: d.endDate,
          ctaLabel: d.ctaLabel,
          ctaLink: d.ctaLink,
        }));
        setCampaigns(mapped);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        console.error("Kampanyalar yüklenemedi:", e);
        setError(e?.message || "Hata");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { campaigns, loading, error };
}
