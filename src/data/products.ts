export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
};

/**
 * Sanity'de henuz urun yoksa fallback olarak kullanilir.
 * Sanity'ye urun ekledikten sonra bu liste devre disi kalir.
 */
export const FALLBACK_PRODUCTS: Product[] = [
  { id: "p1", name: "Kars Eski Kaşarı 1 kg", category: "Kaşar Peyniri", price: 575, image: "https://avatars.mds.yandex.net/i?id=5c71925daff1e52bcee998e48e46ed68d89ba315-5330491-images-thumbs&n=13", badge: "Çok Satan" },
  { id: "p2", name: "Kars Taze Kaşarı 1 kg", category: "Kaşar Peyniri", price: 475, image: "https://cdn.myikas.com/images/4ef9f449-638c-43b4-afe3-fb211708dfd0/e5fba6f7-efed-41df-a237-90c2ec9f028f/3840/taze-kars-kasari.webp" },
  { id: "p3", name: "Kars Göbek Kaşarı 1 kg", category: "Kaşar Peyniri", price: 475, image: "https://static.ticimax.cloud/56884/uploads/urunresimleri/buyuk/gobek-kasar-peyniri-1kg--45f2-.png" },
  { id: "p4", name: "Eski Kaşar Jumbo 1 kg", category: "Kaşar Peyniri", price: 675, image: "https://static.ticimax.cloud/65248/uploads/urunresimleri/buyuk/eski-kasar-peyniri-1ba-c0.jpg", badge: "Premium" },
  { id: "p5", name: "Göle Eski Kaşarı 1 kg", category: "Kaşar Peyniri", price: 545, image: "https://avatars.mds.yandex.net/i?id=e8809ae336548cdaaf0015efcb0ef5a59af4e8cd-16342248-images-thumbs&n=13" },
  { id: "p6", name: "Kars Teker Kaşarı 12 kg", category: "Kaşar Peyniri", price: 6425, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFzBUC659uN2dyGsbmIU9XV6nhpBmAKqcELw&s", badge: "Tam Teker" },
  { id: "p7", name: "Beyaz Çeçil Peyniri 1 kg", category: "Peynir", price: 415, image: "https://cdn.qukasoft.com/f/323014/cG96WmFtNG0vcUp3SzJGdEg4MXZKZWxESUE9PQ/p/yoresel-kars-beyaz-cecil-peyniri-72090152-sw2048sh2048.webp" },
  { id: "p8", name: "Gogermis Cecil Peyniri 1 kg", category: "Peynir", price: 445, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmG9f0CVSHa4GxxX6ikRytHIzA9tqMC1CtDA&s" },
  { id: "p9", name: "Beyaz Koy Peyniri 500 gr", category: "Peynir", price: 275, image: "https://vanotlupeyniri.net/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-22-at-15.02.40.jpeg" },
  { id: "p10", name: "Kars Gravyer Peyniri 500 gr", category: "Peynir", price: 725, image: "https://www.yasamarket.com/idea/lc/40/myassets/products/067/kars-gravyeri-2.jpg?revision=1764569770", badge: "Ozel" },
  { id: "p11", name: "Kars Suzme Bali 1 kg", category: "Bal", price: 575, image: "https://cdn.myikas.com/images/0bbe685f-304d-44f2-acac-6f0cf25cde07/2732ac63-9f46-4f8f-a406-679cf33504a6/3840/img-20250519-1428161.webp", badge: "Cok Satan" },
  { id: "p12", name: "Kars Petek Bali 2,5 kg", category: "Bal", price: 1625, image: "https://static.ticimax.cloud/cdn-cgi/image/width=0,quality=0/30803/uploads/urunresimleri/buyuk/kars-petek-bali-2-kg-ile-2500-kg-arasi-08877a.jpg" },
  { id: "p13", name: "Kars Petek Bali 3,5 kg", category: "Bal", price: 2125, image: "https://static.ticimax.cloud/cdn-cgi/image/width=0,quality=0/30803/uploads/urunresimleri/buyuk/kars-petek-bali-3-kg-ile-3500-kg-arasi-7b2-8b.jpg" },
  { id: "p14", name: "Karakovan Petek Bali 3 kg", category: "Bal", price: 4350, image: "https://static.ticimax.cloud/30803/uploads/urunresimleri/buyuk/kars-karakovan-bali-3-kg-ile-3500-kg-a-3f1a1d.jpg", badge: "Dogal" },
  { id: "p15", name: "Dogal Dut Pekmezi (Ozel)", category: "Pekmez", price: 625, image: "https://erzurumyaylagida.com/Resim/Minik/1500x1500_thumb_e7bt6kgh.JPG" },
  { id: "p16", name: "Kars Koy Sariyag 1 kg", category: "Tereyagi / Yag", price: 725, image: "https://ladikarspeynircilik.com/thumb.ashx?width=500&height=500&Resim=/Resim/lk004.JPG&Watermark=true" },
  { id: "p17", name: "Kars Koy Tereyagi 1 kg (Kahvaltilik)", category: "Tereyagi / Yag", price: 645, image: "https://beylerbeyisut.com/cdn/shop/files/6c49a0219af94fdb5e9ba51a41e04ead_1000x.jpg?v=1759950291", badge: "Populer" },
  { id: "p18", name: "Kars Ardahan Kurutulmus Kaz Eti 2,5-3 kg", category: "Et Urunu", price: 4350, image: "https://cdn.myikas.com/images/6a0efd22-05d6-45f8-b0bc-af85125230ac/299c4cc5-78a7-41b5-8544-b23f83800a18/1080/kaz1.webp", badge: "Ozel" },
];
