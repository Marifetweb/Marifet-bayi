import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Ürün",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Ürün Adı",
      type: "string",
      validation: (R) => R.required().min(2).max(120),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Kaşar Peyniri", value: "Kaşar Peyniri" },
          { title: "Peynir", value: "Peynir" },
          { title: "Bal", value: "Bal" },
          { title: "Pekmez", value: "Pekmez" },
          { title: "Tereyağı / Yağ", value: "Tereyagi / Yag" },
          { title: "Et Ürünü", value: "Et Urunu" },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "price",
      title: "Fiyat (₺)",
      description: "Perakende fiyat. Bayi otomatik %10 indirim alır.",
      type: "number",
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: "image",
      title: "Görsel",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageUrl",
      title: "Görsel URL (alternatif)",
      description: "Eğer Görsel yüklemek yerine internetten link kullanmak isterseniz.",
      type: "url",
    }),
    defineField({
      name: "badge",
      title: "Rozet (opsiyonel)",
      description: "Örn: Çok Satan, Popüler, Özel, Premium",
      type: "string",
    }),
    defineField({
      name: "orderRank",
      title: "Sıralama",
      description: "Küçük sayı önce gelir.",
      type: "number",
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
      price: "price",
      imageUrl: "imageUrl",
    },
    prepare({ title, subtitle, media, price, imageUrl }) {
      return {
        title: title || "İsimsiz Ürün",
        subtitle: `${subtitle ?? ""} · ${price ?? "?"} ₺`,
        media: media || (imageUrl ? undefined : undefined),
      };
    },
  },
});
