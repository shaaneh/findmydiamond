import { getSupabase, isSupabaseConfigured } from "./supabase";

const EXCHANGE_RATE_API = "https://open.er-api.com/v6/latest/USD";
const FALLBACK_RATE = 0.79;

export async function fetchLiveExchangeRate(): Promise<number> {
  try {
    const res = await fetch(EXCHANGE_RATE_API, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Exchange rate API returned ${res.status}`);
    const data = await res.json();
    const rate = data?.rates?.GBP;
    if (typeof rate !== "number" || rate <= 0) {
      throw new Error("Invalid GBP rate in response");
    }
    return rate;
  } catch (err) {
    console.error("Failed to fetch live exchange rate:", err);
    return FALLBACK_RATE;
  }
}

export async function getExchangeRate(): Promise<number> {
  if (!isSupabaseConfigured()) return FALLBACK_RATE;
  const client = getSupabase();

  const { data } = await client
    .from("exchange_rates")
    .select("rate")
    .eq("currency_pair", "USD_GBP")
    .single();

  return data?.rate ?? FALLBACK_RATE;
}

export async function updateExchangeRate(rate: number): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const client = getSupabase();

  await client.from("exchange_rates").upsert(
    { currency_pair: "USD_GBP", rate, updated_at: new Date().toISOString() },
    { onConflict: "currency_pair" }
  );
}
