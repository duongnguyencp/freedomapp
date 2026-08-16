// Live gold price lookup — the one deliberate exception to "no price APIs"
// in this otherwise fully-offline app (explicitly requested). Always
// degrades to manual VND entry on any failure; never blocks the form.

const GOLD_API_URL = 'https://www.vang.today/api/prices';
// SJC 9999 — the most commonly held gold-bar brand in Vietnam for savings.
const GOLD_TYPE_CODE = 'SJL1L10';
const CHI_PER_LUONG = 10;

export interface GoldPrice {
  name: string;
  /** VND per lượng (10 chỉ / 37.5g). */
  buyPerLuong: number;
  sellPerLuong: number;
}

interface VangTodayResponse {
  success: boolean;
  prices: Record<
    string,
    { name: string; buy: number; sell: number; currency: string }
  >;
}

export async function fetchGoldPrice(): Promise<GoldPrice> {
  const response = await fetch(GOLD_API_URL);
  if (!response.ok) {
    throw new Error('Không lấy được giá vàng');
  }

  const json = (await response.json()) as VangTodayResponse;
  const entry = json?.prices?.[GOLD_TYPE_CODE];

  if (!json?.success || !entry || typeof entry.sell !== 'number') {
    throw new Error('Dữ liệu giá vàng không hợp lệ');
  }

  return { name: entry.name, buyPerLuong: entry.buy, sellPerLuong: entry.sell };
}

/** Converts a quantity in "chỉ" (1/10 lượng) to VND at a given lượng price. */
export function chiToVND(chi: number, pricePerLuong: number): number {
  return (chi / CHI_PER_LUONG) * pricePerLuong;
}
