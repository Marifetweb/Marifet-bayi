import { useEffect, useState } from "react";
import { sanity, isSanityConfigured, urlFor } from "@/lib/sanity";
import { FALLBACK_PRODUCTS, type Product } from "@/data/products";

const PRODUCTS_QUERY = `*[_type == "product"] | order(orderRank asc, _createdAt asc){
  "id": _id,
  name,
  title,
  category,
  price,
  badge,
  "image": image,
  "imageAssetUrl": image.asset->url,
  imageUrl
}`;

type SanityProduct = {
  id: string;
  name?: string;
  title?: string;
  category?: string;
  price?: number;
  badge?: string;
  image?: any;
  imageAssetUrl?: string;
  imageUrl?: string;
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(isSanityConfigured);
  const [source, setSource] = useState<"sanity" | "fallback">("fallback");

  useEffect(() => {
    if (!isSanityConfigured || !sanity) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    sanity
      .fetch<SanityProduct[]>(PRODUCTS_QUERY)
      .then((data) => {
        if (cancelled) return;
        if (!data || data.length === 0) {
          setSource("fallback");
        } else {
          const mapped: Product[] = data.map((p) => {
            const builtUrl = p.image ? urlFor(p.image) : "";
            return {
              id: p.id,
              name: p.name || p.title || p.category || "Urun",
              category: p.category || "Diger",
              price: typeof p.price === "number" ? p.price : 0,
              badge: p.badge,
              image: builtUrl || p.imageAssetUrl || p.imageUrl || "",
            };
          });
          setProducts(mapped);
          setSource("sanity");
        }
      })
      .catch((err) => {
        console.error("Sanity fetch hatasi", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, source };
}
