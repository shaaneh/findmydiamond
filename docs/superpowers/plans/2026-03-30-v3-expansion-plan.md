# V3 Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand FindMyDiamond to support lab-grown diamonds, additional grading labs, extended diamond attributes, live exchange rates, UK-legal compliance, and updated site copy.

**Architecture:** Data model expanded with new columns + new exchange_rates table. Feed adapters updated to extract new fields and use live FX rates. Search API gains diamond_type and cert lab filtering. Fair price calculated separately per diamond type. New /terms page + "Ad" labels on listing cards.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Supabase, TypeScript 5.7

**Spec:** `docs/superpowers/specs/2026-03-30-v3-expansion-design.md`

---

## File Map

### New Files
- `src/app/terms/page.tsx` — Terms & Conditions page
- `src/lib/exchange-rate.ts` — Live exchange rate fetcher + DB read/write
- `supabase/migration-v3.sql` — Database migration script

### Modified Files
- `src/lib/types.ts` — New types: DiamondType, expanded CertificationBody, Symmetry, Polish, Fluorescence
- `src/lib/sample-data.ts` — Mixed natural + lab-grown samples with new fields
- `src/lib/feeds/bluenile.ts` — Extract new fields, use live FX rate
- `src/lib/feeds/jamesallen.ts` — Extract new fields, use live FX rate
- `src/lib/feeds/index.ts` — Pass exchange rate to feed adapters
- `src/lib/fair-price.ts` — Filter by diamond_type before calculating
- `src/lib/data.ts` — Accept diamond_type + certLabs filters
- `src/app/api/search/route.ts` — Accept new query params, return split fair prices
- `src/app/api/cron/refresh/route.ts` — Fetch exchange rate before feeds
- `src/components/SearchForm.tsx` — Diamond type toggle, cert lab multi-select
- `src/components/Results.tsx` — Dual fair price cards, badges, "Ad" label, expanded details
- `src/app/page.tsx` — Updated hero copy, footer links, disclaimers
- `src/app/layout.tsx` — Updated metadata
- `supabase/schema.sql` — Updated reference schema

---

## Task 1: Database Migration & Types

**Files:**
- Create: `supabase/migration-v3.sql`
- Modify: `src/lib/types.ts`
- Modify: `supabase/schema.sql`

- [ ] **Step 1: Write the migration SQL**

Create `supabase/migration-v3.sql`:

```sql
-- V3 Expansion Migration
-- Run against Supabase SQL editor

-- 1. Add diamond_type to listings
ALTER TABLE listings ADD COLUMN diamond_type TEXT NOT NULL DEFAULT 'natural'
  CHECK (diamond_type IN ('natural', 'lab-grown'));

-- 2. Add extended attributes (nullable)
ALTER TABLE listings ADD COLUMN symmetry TEXT
  CHECK (symmetry IS NULL OR symmetry IN ('Excellent', 'Very Good', 'Good', 'Fair'));

ALTER TABLE listings ADD COLUMN polish TEXT
  CHECK (polish IS NULL OR polish IN ('Excellent', 'Very Good', 'Good', 'Fair'));

ALTER TABLE listings ADD COLUMN fluorescence TEXT
  CHECK (fluorescence IS NULL OR fluorescence IN ('None', 'Faint', 'Medium', 'Strong', 'Very Strong'));

-- 3. Expand certification_body to include new labs
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_certification_body_check;
ALTER TABLE listings ADD CONSTRAINT listings_certification_body_check
  CHECK (certification_body IN ('GIA', 'IGI', 'HRD', 'AGS', 'EGL', 'GCAL'));

-- 4. Create exchange_rates table
CREATE TABLE exchange_rates (
  currency_pair TEXT PRIMARY KEY,
  rate NUMERIC(10,6) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exchange rates" ON exchange_rates FOR SELECT USING (true);
CREATE POLICY "Service write exchange rates" ON exchange_rates FOR ALL USING (true);

-- Seed with fallback rate
INSERT INTO exchange_rates (currency_pair, rate) VALUES ('USD_GBP', 0.79);

-- 5. Update index to include diamond_type
DROP INDEX IF EXISTS idx_listings_specs;
CREATE INDEX idx_listings_specs ON listings (shape, diamond_type, color, clarity);

-- 6. Future-proofing comments
COMMENT ON TABLE listings IS 'Loose diamond listings only. Mounts/settings will be a separate table in next phase.';
```

- [ ] **Step 2: Update the reference schema**

Update `supabase/schema.sql` to reflect the full current schema including all V3 columns. Replace the entire `listings` table definition and add the `exchange_rates` table so anyone reading the schema sees the complete picture.

- [ ] **Step 3: Update TypeScript types**

Replace the contents of `src/lib/types.ts` with:

```typescript
export type Cut = "Excellent" | "Very Good" | "Good" | "Fair";
export type Color = "D" | "E" | "F" | "G" | "H" | "I" | "J";
export type Clarity =
  | "IF"
  | "VVS1"
  | "VVS2"
  | "VS1"
  | "VS2"
  | "SI1"
  | "SI2";
export type CertificationBody = "GIA" | "IGI" | "HRD" | "AGS" | "EGL" | "GCAL";
export type DiamondType = "natural" | "lab-grown";
export type Symmetry = "Excellent" | "Very Good" | "Good" | "Fair";
export type Polish = "Excellent" | "Very Good" | "Good" | "Fair";
export type Fluorescence = "None" | "Faint" | "Medium" | "Strong" | "Very Strong";

export interface Listing {
  id: string;
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
  price_gbp: number;
  retailer_name: string;
  certification_body: CertificationBody;
  retailer_url: string | null;
  shape: string;
  diamond_type: DiamondType;
  symmetry: Symmetry | null;
  polish: Polish | null;
  fluorescence: Fluorescence | null;
  created_at: string;
}

export interface EmailSignup {
  id: string;
  email: string;
  shape: string;
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
  target_price_gbp: number | null;
  gdpr_consent: boolean;
  created_at: string;
}

export interface SearchParams {
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
  budget?: number;
  diamondType?: DiamondType | "all";
  certLabs?: CertificationBody[];
}

export interface FairPriceResult {
  fairPrice: number | null;
  low: number | null;
  high: number | null;
  isLimitedData: boolean;
  noData: boolean;
}

export interface ListingWithDelta extends Listing {
  deltaPercent: number | null;
}

export const CERT_LAB_INFO: Record<CertificationBody, { label: string; trust: string }> = {
  GIA: { label: "GIA", trust: "Widely recognised, consistent grading" },
  IGI: { label: "IGI", trust: "Widely recognised, consistent grading" },
  AGS: { label: "AGS", trust: "Widely recognised, consistent grading" },
  HRD: { label: "HRD", trust: "Respected European lab, consistent grading" },
  EGL: { label: "EGL", trust: "May grade 1-2 grades more leniently than GIA" },
  GCAL: { label: "GCAL", trust: "Guaranteed grading with certificate of authenticity" },
};

export const ALL_CERT_LABS: CertificationBody[] = ["GIA", "IGI", "HRD", "AGS", "EGL", "GCAL"];
```

- [ ] **Step 4: Run the migration against Supabase**

Run the migration SQL in the Supabase SQL editor (dashboard). Verify:
- `SELECT column_name FROM information_schema.columns WHERE table_name = 'listings';` shows all new columns
- `SELECT * FROM exchange_rates;` returns the seeded USD_GBP row

- [ ] **Step 5: Verify the app still builds**

Run: `cd ~/Desktop/findmydiamond && npm run build`

Expected: Build succeeds (types are updated but not yet consumed by all files — existing code still compiles because new fields are optional/have defaults).

- [ ] **Step 6: Commit**

```bash
git add supabase/migration-v3.sql supabase/schema.sql src/lib/types.ts
git commit -m "feat: V3 data model — diamond_type, extended attributes, expanded cert labs, exchange_rates table"
```

---

## Task 2: Exchange Rate Module

**Files:**
- Create: `src/lib/exchange-rate.ts`

- [ ] **Step 1: Create the exchange rate module**

Create `src/lib/exchange-rate.ts`:

```typescript
import { supabase } from "./supabase";

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
  const client = supabase();
  if (!client) return FALLBACK_RATE;

  const { data } = await client
    .from("exchange_rates")
    .select("rate")
    .eq("currency_pair", "USD_GBP")
    .single();

  return data?.rate ?? FALLBACK_RATE;
}

export async function updateExchangeRate(rate: number): Promise<void> {
  const client = supabase();
  if (!client) return;

  await client.from("exchange_rates").upsert(
    { currency_pair: "USD_GBP", rate, updated_at: new Date().toISOString() },
    { onConflict: "currency_pair" }
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd ~/Desktop/findmydiamond && npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/exchange-rate.ts
git commit -m "feat: exchange rate module — live fetch, DB read/write, fallback"
```

---

## Task 3: Update Feed Adapters

**Files:**
- Modify: `src/lib/feeds/bluenile.ts`
- Modify: `src/lib/feeds/jamesallen.ts`
- Modify: `src/lib/feeds/index.ts`

- [ ] **Step 1: Update Blue Nile adapter**

In `src/lib/feeds/bluenile.ts`:

1. Remove the hardcoded `const USD_TO_GBP = 0.79;` at line 8.
2. Change the function signature to accept a rate parameter: `export async function fetchBluenileFeed(usdToGbp: number): Promise<FeedResult[]>`
3. Replace `USD_TO_GBP` usage at line 67 with the `usdToGbp` parameter.
4. Add new fields to the returned FeedResult objects: `diamond_type`, `symmetry`, `polish`, `fluorescence`, `certification_body`. Parse these from the feed data where available. Default `diamond_type` to `"natural"` — check if the feed item title/category contains "lab" or "lab-grown" to set `"lab-grown"`. Default `symmetry`, `polish`, `fluorescence` to `null` if not in feed data.

- [ ] **Step 2: Update James Allen adapter**

Same changes as Blue Nile in `src/lib/feeds/jamesallen.ts`:

1. Remove hardcoded `const USD_TO_GBP = 0.79;` at line 8.
2. Change function signature: `export async function fetchJamesAllenFeed(usdToGbp: number): Promise<FeedResult[]>`
3. Replace `USD_TO_GBP` with `usdToGbp` parameter.
4. Add new fields parsing, same logic as Blue Nile.

- [ ] **Step 3: Update the FeedResult type**

Add the new fields to the FeedResult interface (defined in feeds or types). If FeedResult is defined locally in the feed files, update both. The result should include:

```typescript
interface FeedResult {
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
  price_gbp: number;
  retailer_name: string;
  certification_body: CertificationBody;
  retailer_url: string;
  diamond_type: DiamondType;
  symmetry: Symmetry | null;
  polish: Polish | null;
  fluorescence: Fluorescence | null;
}
```

- [ ] **Step 4: Update feeds/index.ts**

In `src/lib/feeds/index.ts`, update `fetchAllFeeds()` to accept a `usdToGbp: number` parameter and pass it to each feed adapter:

```typescript
import { fetchBluenileFeed } from "./bluenile";
import { fetchJamesAllenFeed } from "./jamesallen";
import type { FeedResult } from "./bluenile";

export type { FeedResult };

export async function fetchAllFeeds(usdToGbp: number): Promise<FeedResult[]> {
  const results = await Promise.allSettled([
    fetchBluenileFeed(usdToGbp),
    fetchJamesAllenFeed(usdToGbp),
  ]);

  const allListings: FeedResult[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allListings.push(...result.value);
    } else {
      console.error("Feed fetch failed:", result.reason);
    }
  }
  return allListings;
}
```

- [ ] **Step 5: Verify it compiles**

Run: `cd ~/Desktop/findmydiamond && npx tsc --noEmit`

Expected: May show errors in cron route (it calls `fetchAllFeeds()` without the rate arg). That's fine — we fix it in Task 5.

- [ ] **Step 6: Commit**

```bash
git add src/lib/feeds/bluenile.ts src/lib/feeds/jamesallen.ts src/lib/feeds/index.ts
git commit -m "feat: feed adapters accept live exchange rate, extract diamond_type and extended attributes"
```

---

## Task 4: Update Sample Data

**Files:**
- Modify: `src/lib/sample-data.ts`

- [ ] **Step 1: Update sample data with new fields**

Replace `src/lib/sample-data.ts` with a mix of natural and lab-grown diamonds, various cert labs, and some with symmetry/polish/fluorescence populated. Include ~26 listings:
- ~14 natural diamonds (GIA, IGI, HRD, AGS mix)
- ~12 lab-grown diamonds (IGI, GCAL, GIA mix — lab-grown are typically IGI certified)
- ~10 listings with symmetry/polish/fluorescence populated
- ~16 with those fields as null
- Price range: natural GBP 800-5,000, lab-grown GBP 200-1,500 (reflecting 73% price difference)
- All listings include the new `diamond_type` field

Every listing must match the updated `Listing` interface from Task 1.

- [ ] **Step 2: Verify it compiles**

Run: `cd ~/Desktop/findmydiamond && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/lib/sample-data.ts
git commit -m "feat: sample data with natural + lab-grown mix, multiple cert labs, extended attributes"
```

---

## Task 5: Update Cron Job with Exchange Rate

**Files:**
- Modify: `src/app/api/cron/refresh/route.ts`

- [ ] **Step 1: Update the cron handler**

In `src/app/api/cron/refresh/route.ts`:

1. Import `fetchLiveExchangeRate` and `updateExchangeRate` from `@/lib/exchange-rate`.
2. At the start of the handler (after auth check), fetch the live rate and store it:

```typescript
// Fetch and store live exchange rate
const liveRate = await fetchLiveExchangeRate();
await updateExchangeRate(liveRate);
```

3. Pass the rate to `fetchAllFeeds(liveRate)`.
4. Update the upsert to include the new columns. The upsert object should include `diamond_type`, `symmetry`, `polish`, `fluorescence` from the feed result.
5. Update the status report JSON to include the exchange rate used.

- [ ] **Step 2: Verify it compiles**

Run: `cd ~/Desktop/findmydiamond && npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cron/refresh/route.ts
git commit -m "feat: cron job fetches live exchange rate before processing feeds"
```

---

## Task 6: Update Data Layer & Fair Price Calculation

**Files:**
- Modify: `src/lib/data.ts`
- Modify: `src/lib/fair-price.ts`

- [ ] **Step 1: Update data.ts to accept filters**

Update `getListings()` in `src/lib/data.ts` to accept optional filters and apply them:

```typescript
import type { Listing, DiamondType, CertificationBody } from "./types";
import { supabase } from "./supabase";
import { sampleListings } from "./sample-data";

interface ListingFilters {
  diamondType?: DiamondType | "all";
  certLabs?: CertificationBody[];
}

export async function getListings(filters?: ListingFilters): Promise<Listing[]> {
  const client = supabase();
  if (!client) {
    return applyFilters(sampleListings, filters);
  }

  let query = client.from("listings").select("*").eq("shape", "Round");

  if (filters?.diamondType && filters.diamondType !== "all") {
    query = query.eq("diamond_type", filters.diamondType);
  }

  if (filters?.certLabs && filters.certLabs.length > 0) {
    query = query.in("certification_body", filters.certLabs);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("Supabase error:", error);
    return applyFilters(sampleListings, filters);
  }

  return data as Listing[];
}

function applyFilters(listings: Listing[], filters?: ListingFilters): Listing[] {
  let filtered = listings;
  if (filters?.diamondType && filters.diamondType !== "all") {
    filtered = filtered.filter((l) => l.diamond_type === filters.diamondType);
  }
  if (filters?.certLabs && filters.certLabs.length > 0) {
    filtered = filtered.filter((l) => filters.certLabs!.includes(l.certification_body));
  }
  return filtered;
}
```

- [ ] **Step 2: Update fair-price.ts to filter by diamond type**

In `src/lib/fair-price.ts`, update `calculateFairPrice()`:

The function already receives a `listings` array. Since `getListings()` now handles filtering, no changes needed to the fair price function itself — it operates on whatever listings it receives.

However, the search API will need to call it twice when `diamondType === "all"` (once for natural, once for lab-grown). That logic goes in the search route (Task 7), not here.

Verify `calculateFairPrice` and `rankListings` still compile with the updated `Listing` type (new fields are on the interface but these functions only access existing fields).

- [ ] **Step 3: Verify it compiles**

Run: `cd ~/Desktop/findmydiamond && npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/lib/data.ts src/lib/fair-price.ts
git commit -m "feat: data layer accepts diamond_type and certLabs filters"
```

---

## Task 7: Update Search API

**Files:**
- Modify: `src/app/api/search/route.ts`

- [ ] **Step 1: Update the search handler**

Rewrite `src/app/api/search/route.ts` to accept new params and return split fair prices:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/data";
import { calculateFairPrice, rankListings } from "@/lib/fair-price";
import type { Cut, Color, Clarity, DiamondType, CertificationBody, FairPriceResult } from "@/lib/types";
import { ALL_CERT_LABS } from "@/lib/types";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const carat = parseFloat(params.get("carat") || "");
  const cut = params.get("cut") as Cut;
  const color = params.get("color") as Color;
  const clarity = params.get("clarity") as Clarity;
  const budget = params.get("budget") ? parseInt(params.get("budget")!) : undefined;
  const diamondType = (params.get("diamondType") || "all") as DiamondType | "all";
  const certLabs = params.get("certLabs")
    ? (params.get("certLabs")!.split(",") as CertificationBody[])
    : ALL_CERT_LABS;

  if (!carat || !cut || !color || !clarity) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  const searchParams = { carat, cut, color, clarity, budget, diamondType, certLabs };

  // Fetch listings with filters
  const listings = await getListings({ diamondType, certLabs });

  if (diamondType === "all") {
    // Split fair price calculation by type
    const naturalListings = listings.filter((l) => l.diamond_type === "natural");
    const labListings = listings.filter((l) => l.diamond_type === "lab-grown");

    const naturalFairPrice = calculateFairPrice(naturalListings, searchParams);
    const labFairPrice = calculateFairPrice(labListings, searchParams);

    // Rank all listings together, using natural fair price as primary reference
    // (each listing's delta is calculated against its own type's fair price)
    const rankedListings = rankListingsByType(listings, searchParams, naturalFairPrice, labFairPrice);

    return NextResponse.json({
      fairPrice: naturalFairPrice,
      labFairPrice,
      listings: rankedListings,
    });
  }

  // Single type selected
  const fairPrice = calculateFairPrice(listings, searchParams);
  const rankedListings = rankListings(listings, searchParams, fairPrice.fairPrice);

  return NextResponse.json({
    fairPrice,
    labFairPrice: null,
    listings: rankedListings,
  });
}

function rankListingsByType(
  listings: import("@/lib/types").Listing[],
  params: import("@/lib/types").SearchParams,
  naturalFairPrice: FairPriceResult,
  labFairPrice: FairPriceResult
): import("@/lib/types").ListingWithDelta[] {
  return listings
    .map((l) => {
      const refPrice =
        l.diamond_type === "natural"
          ? naturalFairPrice.fairPrice
          : labFairPrice.fairPrice;
      const deltaPercent = refPrice
        ? ((l.price_gbp - refPrice) / refPrice) * 100
        : null;
      return { ...l, deltaPercent };
    })
    .filter((l) => !params.budget || l.price_gbp <= params.budget)
    .sort((a, b) => (a.deltaPercent ?? 999) - (b.deltaPercent ?? 999));
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd ~/Desktop/findmydiamond && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/search/route.ts
git commit -m "feat: search API supports diamondType and certLabs filters, returns split fair prices"
```

---

## Task 8: Update SearchForm Component

**Files:**
- Modify: `src/components/SearchForm.tsx`

- [ ] **Step 1: Add diamond type toggle and cert lab multi-select**

Update `src/components/SearchForm.tsx`:

1. Add state for `diamondType` (default: `"all"`) and `certLabs` (default: all selected).
2. Add a radio group above the existing fields for diamond type: "All", "Natural", "Lab-Grown".
3. Add a multi-select checkbox group for certification labs: GIA, IGI, HRD, AGS, EGL, GCAL. All checked by default.
4. Add validation: at least one cert lab must be selected.
5. Update the `onSearch` callback to pass `diamondType` and `certLabs` to the parent.
6. Style the radio group with the existing gold accent for the selected state.
7. Style the cert lab checkboxes as small pill-shaped toggles in a horizontal row.

The `onSearch` type should become:
```typescript
interface SearchFormProps {
  onSearch: (params: {
    carat: number;
    cut: Cut;
    color: Color;
    clarity: Clarity;
    budget?: number;
    diamondType: DiamondType | "all";
    certLabs: CertificationBody[];
  }) => void;
  isLoading: boolean;
}
```

- [ ] **Step 2: Update parent page.tsx to pass new params to API**

In `src/app/page.tsx`, update the search handler to include the new params in the API URL:

```typescript
const url = `/api/search?carat=${params.carat}&cut=${params.cut}&color=${params.color}&clarity=${params.clarity}${params.budget ? `&budget=${params.budget}` : ""}&diamondType=${params.diamondType}&certLabs=${params.certLabs.join(",")}`;
```

Also update state to store `labFairPrice` from the API response.

- [ ] **Step 3: Verify it compiles and renders**

Run: `cd ~/Desktop/findmydiamond && npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/SearchForm.tsx src/app/page.tsx
git commit -m "feat: search form with diamond type toggle and cert lab multi-select"
```

---

## Task 9: Update Results Component

**Files:**
- Modify: `src/components/Results.tsx`

- [ ] **Step 1: Add dual fair price cards**

Update `src/components/Results.tsx`:

1. Accept new props: `labFairPrice: FairPriceResult | null` and `diamondType: DiamondType | "all"`.
2. When `diamondType === "all"` and both fair prices exist, render two fair price cards side by side:
   - Left card: "Natural Diamond Fair Price" with `fairPrice`
   - Right card: "Lab-Grown Diamond Fair Price" with `labFairPrice`
   - Use a 2-column grid on desktop, stacked on mobile
3. When a single type is selected, render one card as current.

- [ ] **Step 2: Add badges to listing cards**

On each listing card:

1. **Diamond type badge**:
   - "Natural" — `bg-[var(--bg-elevated)] text-[var(--text-secondary)]` (neutral)
   - "Lab-Grown" — `bg-emerald-50 text-emerald-700` (green-tinted)

2. **Certification badge with tooltip**:
   - Import `CERT_LAB_INFO` from types.
   - Render cert lab as a small badge.
   - On hover, show tooltip with the trust description.
   - Use a simple CSS tooltip (title attribute is fine for MVP, or a `relative/absolute` span).

3. **"Ad" label**:
   - Small text "Ad" in muted gray, positioned next to the "View at [Retailer]" link.
   - Style: `text-xs text-[var(--text-light)]`

- [ ] **Step 3: Add collapsible expanded details**

Below the main listing card content, add a "More details" toggle:

```tsx
{(listing.symmetry || listing.polish || listing.fluorescence) && (
  <button onClick={() => toggleDetails(listing.id)} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] mt-2">
    {expandedIds.has(listing.id) ? "Less details" : "More details"}
  </button>
)}
{expandedIds.has(listing.id) && (
  <div className="mt-2 pt-2 border-t border-[var(--border-light)] grid grid-cols-3 gap-2 text-xs text-[var(--text-secondary)]">
    {listing.symmetry && <div><span className="text-[var(--text-muted)]">Symmetry</span><br/>{listing.symmetry}</div>}
    {listing.polish && <div><span className="text-[var(--text-muted)]">Polish</span><br/>{listing.polish}</div>}
    {listing.fluorescence && <div><span className="text-[var(--text-muted)]">Fluorescence</span><br/>{listing.fluorescence}</div>}
  </div>
)}
```

Use `useState<Set<string>>` to track which cards are expanded.

- [ ] **Step 4: Add fair price disclaimer**

Below each fair price card, add small disclaimer text:

```tsx
<p className="text-xs text-[var(--text-muted)] mt-2">
  This is a statistical estimate, not a professional valuation.
</p>
```

- [ ] **Step 5: Verify it compiles and renders**

Run: `cd ~/Desktop/findmydiamond && npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/components/Results.tsx
git commit -m "feat: dual fair price cards, diamond type badges, cert tooltips, Ad labels, expanded details"
```

---

## Task 10: Update Hero Copy & Metadata

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update hero section copy**

In `src/app/page.tsx`:

1. **Line 104** — Change hero badge from "UK Diamond Price Comparison" to "Diamond Price Comparison"
2. **Lines 120-121** — Change subtitle from "Compare prices from trusted UK retailers. See the fair market value before you buy." to "Compare diamond prices from trusted retailers. See the fair market value before you buy."
3. **Line 141** — Change trust badge from "UK Retailers Only" to "Trusted Retailers"
4. **Line 264** — Remove "UK" qualifier if present in How It Works section
5. **Lines 397-398** — Update footer disclaimer from "Prices are indicative and sourced from UK retailers." to "Prices are indicative and sourced from third-party retailers. Always verify with the retailer before purchasing."

- [ ] **Step 2: Update metadata**

In `src/app/layout.tsx`:

1. **Line 5** — Change title from "findmydiamond — UK Diamond Price Check" to "findmydiamond — Diamond Price Comparison"
2. **Lines 6-7, 10-11** — Update description to remove "UK" geographic claims. Keep "GBP" and ".co.uk" as natural signals.

- [ ] **Step 3: Add footer links to /terms**

In `src/app/page.tsx` footer section, add a link to `/terms` next to the existing `/privacy` link.

- [ ] **Step 4: Verify it compiles**

Run: `cd ~/Desktop/findmydiamond && npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: updated hero copy, removed geographic claims, added /terms footer link"
```

---

## Task 11: Terms & Conditions Page

**Files:**
- Create: `src/app/terms/page.tsx`

- [ ] **Step 1: Create the T&C page**

Create `src/app/terms/page.tsx` with the following sections, styled to match the existing `/privacy` page:

1. **Business Identity** (Electronic Commerce Regulations 2002, reg. 6)
   - Trading name: FindMyDiamond
   - Contact: legal@findmydiamond.co.uk
   - Service: Independent diamond price comparison tool

2. **Service Description**
   - Not a retailer. No purchases made on this site.
   - Comparison tool aggregating prices from third-party retailers.

3. **Affiliate Disclosure** (Consumer Protection from Unfair Trading Regulations 2008)
   - "We may earn a commission when you click through to a retailer and complete a purchase. This does not affect the price you pay. Listings marked 'Ad' contain affiliate links."

4. **Price Accuracy**
   - Prices sourced from third-party data feeds, updated regularly.
   - Prices may differ on the retailer's website at time of purchase.
   - All prices displayed in GBP, converted from source currency using regularly updated exchange rates. Minor discrepancies may occur.

5. **Fair Price Disclaimer**
   - The fair price is a statistical estimate based on current market data.
   - It is not a professional valuation, appraisal, or financial advice.
   - Not to be solely relied upon for purchase decisions.

6. **Grading Lab Information**
   - Grading standards vary between certification laboratories.
   - Trust indicators are informational, based on widely held industry views, and do not constitute endorsements.

7. **Limitation of Liability** (Consumer Rights Act 2015, Unfair Contract Terms Act 1977)
   - Not liable for disputes with retailers, delivery, product quality, or pricing errors in third-party feeds.
   - Nothing in these terms excludes liability for fraud, or for death or personal injury caused by negligence.
   - Liability limited to the fullest extent permitted by applicable law.

8. **Intellectual Property**
   - All content, design, branding, and algorithms are proprietary.
   - Users may not scrape, reproduce, or redistribute data from this site.

9. **Governing Law**
   - These terms are governed by the laws of England and Wales.
   - The courts of England and Wales have exclusive jurisdiction.

10. **Last updated: March 2026**

Style: match the `/privacy` page layout exactly — same heading sizes, spacing, container width, back-to-home link.

- [ ] **Step 2: Verify it compiles and the route works**

Run: `cd ~/Desktop/findmydiamond && npm run build`

Expected: Build succeeds. `/terms` route is created automatically by Next.js app router.

- [ ] **Step 3: Commit**

```bash
git add src/app/terms/page.tsx
git commit -m "feat: Terms & Conditions page — UK legal compliance, affiliate disclosure, liability limitation"
```

---

## Task 12: Integration Test & Deploy

**Files:**
- No new files

- [ ] **Step 1: Run full build**

Run: `cd ~/Desktop/findmydiamond && npm run build`

Expected: Clean build, no errors.

- [ ] **Step 2: Run dev server and manually test**

Run: `cd ~/Desktop/findmydiamond && npm run dev`

Test the following:
1. Homepage loads — hero copy has no "UK" geographic claims
2. Search form shows diamond type radio (All/Natural/Lab-Grown)
3. Search form shows cert lab checkboxes (all checked by default)
4. Search with "All" returns results with both natural and lab-grown badges
5. Search with "All" shows two fair price cards (natural + lab-grown)
6. Search with "Natural" shows only natural diamonds, one fair price card
7. Search with "Lab-Grown" shows only lab-grown, one fair price card
8. Listing cards show cert lab badge with tooltip on hover
9. Listing cards show "Ad" label next to retailer link
10. Listings with symmetry/polish/fluorescence show "More details" toggle
11. Expanding "More details" shows the extra attributes
12. Fair price cards show disclaimer text
13. `/terms` page loads with all sections
14. `/privacy` page still works
15. Footer has links to both /terms and /privacy

- [ ] **Step 3: Deploy to Vercel**

Run: `cd ~/Desktop/findmydiamond && npx vercel --prod`

Expected: Deployment succeeds.

- [ ] **Step 4: Verify production**

Open the production URL and repeat the manual test checklist from Step 2.

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "V3: lab-grown support, expanded grading labs, extended attributes, live FX rates, T&C page, updated copy"
```

- [ ] **Step 6: Push to remote**

```bash
cd ~/Desktop/findmydiamond && git push origin master
```
