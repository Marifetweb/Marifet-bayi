import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const token = import.meta.env.VITE_SANITY_TOKEN || undefined;

export const isSanityConfigured = Boolean(projectId);

let _client: SanityClient | null = null;

if (isSanityConfigured) {
  _client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: !token,
    token,
  });
} else {
  console.warn(
    "[Sanity] Yapilandirma yok. Local seed urunleri kullanilacak. .env'e VITE_SANITY_PROJECT_ID girin.",
  );
}

export const sanity = _client;
export const client = _client;

const builder = _client ? imageUrlBuilder(_client) : null;
export function urlFor(source: any): string {
  if (!builder || !source) return "";
  try {
    return builder.image(source).width(800).fit("max").auto("format").url();
  } catch {
    return "";
  }
}
