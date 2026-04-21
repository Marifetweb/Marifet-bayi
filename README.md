# Marifet Şarküteri — Bayi Sistemi

Sanity (CMS) + Firebase (Auth) + Netlify (Hosting) ile çalışan bayi panelli ürün vitrini.

- **Bayi kayıt + giriş** (Firebase Auth, otomatik onaylı)
- **%10 bayi indirimi** (giriş yapan bayi tüm fiyatları indirimli görür)
- **10'lu paket adımı** (bayi sepete sadece 10, 20, 30… adet ekleyebilir)
- **Ürünler Sanity'den** (CMS'den eklediğiniz ürünler hemen sitede görünür; CMS boşsa fallback liste devreye girer)
- **Sipariş yöntemi mevcut sistemle aynı**: WhatsApp üzerinden gönderiliyor (bayi bilgisi mesaja otomatik eklenir).

---

## 1) Kurulum

```bash
# 1. Bağımlılıklar
npm install
cd studio && npm install && cd ..

# 2. Ortam degiskenleri
cp .env.example .env
cp studio/.env.example studio/.env
# .env ve studio/.env dosyalarini doldurun (asagiya bakin)

# 3. Local calistir
npm run dev          # site: http://localhost:5173
npm run studio:dev   # CMS: http://localhost:3333
```

## 2) Firebase kurulumu

1. https://console.firebase.google.com → **Add project**
2. Proje içinde **Authentication → Get started → Email/Password** sağlayıcısını aktif edin.
3. **Firestore Database → Create database → Start in production mode**.
4. **Project settings → General → Your apps → Web (</>)** ile yeni web app ekleyin, config değerlerini kopyalayın.
5. `.env` dosyasına `VITE_FIREBASE_*` değerlerini yapıştırın.
6. Firestore kuralları (önerilen):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dealers/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## 3) Sanity kurulumu

1. https://www.sanity.io/manage → **Create new project** (ücretsiz tier yeterli).
2. **Project ID**'yi kopyalayın.
3. `studio/.env` ve ana `.env` içine `VITE_SANITY_PROJECT_ID` / `SANITY_STUDIO_PROJECT_ID` olarak yapıştırın.
4. `cd studio && npm run dev` — `http://localhost:3333` üzerinde CMS açılır, ürünleri girersiniz.
5. Studio'yu canlıya almak için: `cd studio && npm run deploy` (yourname.sanity.studio adresinde yayınlanır).
6. Sanity Console → **API → CORS Origins** sekmesinde `http://localhost:5173` ve Netlify domaininizi (örn. `https://siteniz.netlify.app`) ekleyin (Allow credentials = false).

## 4) Netlify deploy

1. Repo'yu GitHub'a push edin.
2. Netlify → **Add new site → Import from Git** → repo seçin.
3. Build ayarları otomatik gelir (`netlify.toml` mevcut).
4. **Site settings → Environment variables**: tüm `VITE_*` değişkenlerini ekleyin.
5. Deploy.

---

## Bayi mantığı

| Mod | Fiyat | Adet adımı |
|---|---|---|
| Misafir | Tam fiyat | 1 |
| Bayi (giriş yapmış, `approved: true`) | %10 indirim | 10 (10, 20, 30…) |

`.env` üzerinden ayarlanabilir:
```
VITE_DEALER_DISCOUNT=0.10   # %10
VITE_DEALER_QTY_STEP=10     # 10'un katlari
```

Bayi otomatik onaylı kaydolur (`approved: true` Firestore'a yazılır). İleride manuel onay isterseniz `src/context/AuthContext.tsx` içinde `approved: true` → `approved: false` yapın ve onayı Firebase Console'dan elle verirsiniz.

## Komutlar

```
npm run dev            # Vite dev sunucusu
npm run build          # Production build (dist/)
npm run preview        # Build'i lokal calistir
npm run studio:dev     # Sanity CMS lokal
npm run studio:deploy  # Sanity Studio'yu canliya al
```
