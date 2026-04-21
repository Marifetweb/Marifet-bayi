import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function Register() {
  const { register, isFirebaseReady } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    companyName: "",
    phone: "",
    taxNo: "",
    city: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!isFirebaseReady) {
      setErr("Firebase yapilandirilmamis. .env dosyanizi kontrol edin.");
      return;
    }
    if (form.password.length < 6) {
      setErr("Sifre en az 6 karakter olmali.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (e: any) {
      setErr(parseErr(e?.code) || "Kayit olusturulamadi. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="px-4 h-16 flex items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Anasayfa
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[10px] tracking-[0.25em] uppercase text-primary/70">Bayi Paneli</p>
            <h1 className="text-2xl font-serif font-bold">Bayi Kayit</h1>
            <p className="text-sm text-muted-foreground">Bayi olarak kaydolun, otomatik onayla %10 indirimli toptan fiyatlardan yararlanmaya baslayin.</p>
          </div>

          <ul className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1.5 text-xs text-amber-900">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-700 flex-shrink-0" /> Tum urunlerde %10 indirim</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-700 flex-shrink-0" /> Toptan paketler (10'lu, 20'li, 30'lu...)</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-700 flex-shrink-0" /> Anlik onay, hemen kullanima hazir</li>
          </ul>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ad Soyad" required>
                <Input required value={form.fullName} onChange={set("fullName")} placeholder="Ahmet Yilmaz" />
              </Field>
              <Field label="Telefon" required>
                <Input required type="tel" value={form.phone} onChange={set("phone")} placeholder="0540 461 4635" />
              </Field>
            </div>

            <Field label="Firma Adi" required>
              <Input required value={form.companyName} onChange={set("companyName")} placeholder="Yilmaz Gida Ltd." />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Vergi No (istege bagli)">
                <Input value={form.taxNo} onChange={set("taxNo")} placeholder="1234567890" />
              </Field>
              <Field label="Sehir (istege bagli)">
                <Input value={form.city} onChange={set("city")} placeholder="Kars" />
              </Field>
            </div>

            <Field label="E-posta" required>
              <Input required type="email" value={form.email} onChange={set("email")} placeholder="bayi@firma.com" />
            </Field>
            <Field label="Sifre (en az 6 karakter)" required>
              <Input required type="password" minLength={6} value={form.password} onChange={set("password")} placeholder="********" />
            </Field>

            {err && <div className="text-xs text-destructive bg-destructive/10 rounded-md p-2.5">{err}</div>}

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl">
              {loading ? "Kayit olusturuluyor..." : "Bayi Olarak Kaydol"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Zaten hesabiniz var mi? </span>
            <Link href="/giris" className="text-primary font-semibold hover:underline">Giris yap</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-foreground/80 mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}

function parseErr(code?: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Bu e-posta zaten kayitli. Giris yapmayi deneyin.";
    case "auth/invalid-email":
      return "Gecersiz e-posta adresi.";
    case "auth/weak-password":
      return "Sifre cok zayif (en az 6 karakter olmali).";
    default:
      return null;
  }
}
