import { defineField, defineType, defineArrayMember } from "sanity";

export default defineType({
  name: "campaign",
  title: "Kampanya Paketi",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Paket Adı",
      type: "string",
      description: "Örn: Klasik Kahvaltı Paketi",
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "subtitle",
      title: "Alt Başlık (opsiyonel)",
      type: "string",
      description: "Örn: 4 ürün bir arada — Kars'ın en sevilen lezzetleri",
    }),
    defineField({
      name: "items",
      title: "Paket İçeriği (Ürünler)",
      type: "array",
      validation: (r) => r.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "packageItem",
          title: "Ürün",
          fields: [
            defineField({
              name: "name",
              title: "Ürün Adı",
              type: "string",
              description: "Örn: 1 kg Eski Kaşar",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "image",
              title: "Ürün Görseli",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "name", media: "image" },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Toplam Fiyat (₺)",
      type: "number",
      description: "Örn: 1850",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "freeShipping",
      title: "Kargo Ücretsiz mi?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "badge",
      title: "Etiket (opsiyonel)",
      type: "string",
      description: "Örn: YENİ, EN ÇOK SATAN, FIRSAT",
    }),
    defineField({
      name: "discountPercent",
      title: "İndirim Yüzdesi (opsiyonel)",
      type: "number",
      description: "Örn: 15 — kart üzerinde %15 İndirim olarak görünür",
    }),
    defineField({
      name: "startDate",
      title: "Başlangıç Tarihi (opsiyonel)",
      type: "datetime",
    }),
    defineField({
      name: "endDate",
      title: "Bitiş Tarihi (opsiyonel)",
      type: "datetime",
    }),
    defineField({
      name: "isActive",
      title: "Aktif mi?",
      type: "boolean",
      initialValue: true,
      description: "Kapatırsanız sitede gösterilmez",
    }),
    defineField({
      name: "order",
      title: "Sıralama",
      type: "number",
      description: "Küçük olan üstte görünür",
      initialValue: 0,
    }),
    defineField({
      name: "ctaLabel",
      title: "Buton Yazısı (opsiyonel)",
      type: "string",
      description: "Boş bırakılırsa 'Sepete Ekle' yazar",
    }),
    defineField({
      name: "ctaLink",
      title: "Buton Linki (opsiyonel)",
      type: "string",
      description: "Boş bırakılırsa /katalog yönlendirir",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "totalPrice", media: "items.0.image" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle} ₺` : "",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Sıralama",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
