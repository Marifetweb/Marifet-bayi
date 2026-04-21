export const DEALER_DISCOUNT = Number(import.meta.env.VITE_DEALER_DISCOUNT ?? 0.10);
export const DEALER_QTY_STEP = Number(import.meta.env.VITE_DEALER_QTY_STEP ?? 10);
export const GUEST_QTY_STEP = 1;

/**
 * Bayi icin %10 indirimli fiyat. Fiyati TL cinsinden tam sayiya yuvarlar.
 */
export function effectivePrice(basePrice: number, isDealer: boolean): number {
  if (!isDealer) return basePrice;
  return Math.round(basePrice * (1 - DEALER_DISCOUNT));
}

/** Bayi icin 10'un katlari, misafir icin serbest. */
export function qtyStep(isDealer: boolean): number {
  return isDealer ? DEALER_QTY_STEP : GUEST_QTY_STEP;
}

/** Verilen miktari dogru adim katina yuvarlar (asagi). */
export function snapQty(qty: number, isDealer: boolean): number {
  if (qty <= 0) return 0;
  const step = qtyStep(isDealer);
  return Math.max(0, Math.floor(qty / step) * step);
}
