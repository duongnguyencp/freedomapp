// Live SJC gold price (VND per "chỉ" — 1 chỉ = 3.75g). Best-effort only:
// per prompt.md the app must keep working fully offline, so this is the
// one deliberate exception (opt-in, only touched when the user taps
// "Lấy giá vàng hôm nay") — every caller must handle failure by falling
// back to manual VND entry, never block on it.

export interface GoldPricePerChi {
  buyPrice: number;
  sellPrice: number;
}

const GOLD_API_URL = 'https://api.vnappmob.com/api/v2/gold/sjc';

export async function fetchGoldPricePerChi(): Promise<GoldPricePerChi> {
  const response = await fetch(GOLD_API_URL);
  if (!response.ok) {
    throw new Error(`Không lấy được giá vàng (mã lỗi ${response.status}).`);
  }

  const json = await response.json();
  const entry = Array.isArray(json?.results)
    ? json.results[0]
    : Array.isArray(json)
      ? json[0]
      : json;

  const buyPrice = toNumber(entry?.buy_1c ?? entry?.buy ?? entry?.buyPrice);
  const sellPrice = toNumber(entry?.sell_1c ?? entry?.sell ?? entry?.sellPrice);

  if (buyPrice === null || sellPrice === null) {
    throw new Error('Không đọc được dữ liệu giá vàng.');
  }

  return { buyPrice, sellPrice };
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
