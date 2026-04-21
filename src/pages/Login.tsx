import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const { login, isFirebaseReady } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!isFirebaseReady) {
      setErr("Firebase yapilandirilmamis. .env dosyanizi kontrol edin.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (e: any) {
      setErr(parseErr(e?.code) || "Giris basarisiz. E-posta veya sifre hatali.");
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
        <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[10px] tracking-[0.25em] uppercase text-primary/70">Bayi Paneli</p>
            <h1 className="text-2xl font-serif font-bold">Bayi Girisi</h1>
            <p className="text-sm text-muted-foreground">Hesabiniza giris yapin ve %10 indirimli toptan fiyatlardan yararlanin.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground/80 mb-1.5 block">E-posta</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="bayi@firma.com" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground/80 mb-1.5 block">Sifre</label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" minLength={6} />
            </div>

            {err && <div className="text-xs text-destructive bg-destructive/10 rounded-md p-2.5">{err}</div>}

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl">
              {loading ? "Giris yapiliyor..." : "Giris Yap"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Hesabiniz yok mu? </span>
            <Link href="/kayit" className="text-primary font-semibold hover:underline">Bayi olarak kaydol</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function parseErr(code?: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-posta veya sifre hatali.";
    case "auth/invalid-email":
      return "Gecersiz e-posta adresi.";
    case "auth/too-many-requests":
      return "Cok fazla deneme. Bir sure bekleyin.";
    default:
      return null;
  }
}
