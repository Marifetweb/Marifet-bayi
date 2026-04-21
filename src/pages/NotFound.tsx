import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-xs tracking-[0.25em] uppercase text-primary/70">404</p>
        <h1 className="text-3xl font-serif font-bold">Sayfa bulunamadi</h1>
        <p className="text-muted-foreground">Aradiginiz sayfa mevcut degil veya tasinmis olabilir.</p>
        <Link href="/">
          <Button className="rounded-full">Anasayfaya Don</Button>
        </Link>
      </div>
    </div>
  );
}
