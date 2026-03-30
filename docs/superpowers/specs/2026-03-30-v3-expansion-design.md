# FindMyDiamond V3 Expansion — Design Spec

*Date: 2026-03-30*
*Status: Approved*

---

## Overview

Expansion of the FindMyDiamond MVP to support lab-grown diamonds, additional grading labs, extended diamond attributes, live exchange rates, updated site copy, and full UK legal compliance. Future-proofs the data model for mounts/settings (next phase, not built now).

## Decisions Log

| Item | Decision |
|------|----------|
| Pricing model | Raw retailer prices, no markup. Trust-first positioning. |
| Site wording | Remove geographic claims. "Compare diamond prices from trusted retailers" — no "UK diamond comparison price". |
| Lab vs natural | Filter toggle (All/Natural/Lab-Grown) + badges on cards. Fair price calculated separately per type. |
| Feeds/database | Expand data model with new fields. Live exchange rate via free API in cron job. |
| Additional factors | Symmetry, polish, fluorescence displayed on cards (collapsible). Not search filters. |
| Additional grading labs | HRD, AGS, EGL, GCAL added. Multi-select filter in search. Trust indicator tooltips on results. |
| Mounts/settings | Schema designed now, not built. Ensures clean separation for next phase. |
| Terms & conditions | Full T&C page + on-page affiliate "Ad" labels + fair price disclaimer. UK law compliant. |

---

## 1. Data Model Changes

### 1.1 `listings` table updates

```sql
-- New columns
ALTER TABLE listings ADD COLUMN diamond_type TEXT NOT NULL DEFAULT 'natural'
  CHECK (diamond_type IN ('natural', 'lab-grown'));

ALTER TABLE listings ADD COLUMN symmetry TEXT
  CHECK (symmetry IN ('Excellent', 'Very Good', 'Good', 'Fair'));

ALTER TABLE listings ADD COLUMN polish TEXT
  CHECK (polish IN ('Excellent', 'Very Good', 'Good', 'Fair'));

ALTER TABLE listings ADD COLUMN fluorescence TEXT
  CHECK (fluorescence IN ('None', 'Faint', 'Medium', 'Strong', 'Very Strong'));

-- Expand certification_body constraint
-- Drop existing check and re-add with expanded values
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_certification_body_check;
ALTER TABLE listings ADD CONSTRAINT listings_certification_body_check
  CHECK (certification_body IN ('GIA', 'IGI', 'HRD', 'AGS', 'EGL', 'GCAL'));
```

All new columns except `diamond_type` are nullable for backward compatibility — not all feeds provide these fields.

### 1.2 New `exchange_rates` table

```sql
CREATE TABLE exchange_rates (
  currency_pair TEXT PRIMARY KEY,  -- e.g., 'USD_GBP'
  rate NUMERIC(10,6) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed with fallback rate
INSERT INTO exchange_rates (currency_pair, rate) VALUES ('USD_GBP', 0.79);
```

### 1.3 Updated indexes

```sql
-- Update specs index to include diamond_type
DROP INDEX IF EXISTS idx_listings_specs;
CREATE INDEX idx_listings_specs ON listings (shape, diamond_type, color, clarity);
```

### 1.4 TypeScript types

```typescript
type DiamondType = 'natural' | 'lab-grown';
type CertificationBody = 'GIA' | 'IGI' | 'HRD' | 'AGS' | 'EGL' | 'GCAL';
type Symmetry = 'Excellent' | 'Very Good' | 'Good' | 'Fair';
type Polish = 'Excellent' | 'Very Good' | 'Good' | 'Fair';
type Fluorescence = 'None' | 'Faint' | 'Medium' | 'Strong' | 'Very Strong';

interface Listing {
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
```

### 1.5 Future-proofing for mounts/settings (schema comments only)

```sql
-- NEXT PHASE: mounts/settings
-- CREATE TABLE settings (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   type TEXT NOT NULL CHECK (type IN ('ring', 'bracelet', 'earring', 'pendant')),
--   metal TEXT NOT NULL,
--   style TEXT,
--   price_gbp INTEGER NOT NULL,
--   retailer_name TEXT NOT NULL,
--   retailer_url TEXT,
--   created_at TIMESTAMPTZ DEFAULT now()
-- );
--
-- CREATE TABLE listing_settings (
--   listing_id UUID REFERENCES listings(id),
--   setting_id UUID REFERENCES settings(id),
--   total_price_gbp INTEGER NOT NULL,
--   PRIMARY KEY (listing_id, setting_id)
-- );
```

The `listings` table stays scoped to loose diamonds. No combined diamond+ring entries.

---

## 2. Search Form & Filtering

### 2.1 Updated search form fields

| Field | Type | Options | Default |
|-------|------|---------|---------|
| Diamond Type | Radio group | All / Natural / Lab-Grown | All |
| Carat | Numeric input | 0.2 - 5.0 | (unchanged) |
| Cut | Dropdown | Excellent, Very Good, Good, Fair | (unchanged) |
| Color | Dropdown | D through J | (unchanged) |
| Clarity | Dropdown | IF through SI2 | (unchanged) |
| Certification Lab | Multi-select checkboxes | GIA, IGI, HRD, AGS, EGL, GCAL | All selected |
| Budget | Optional GBP input | - | (unchanged) |

### 2.2 Behaviour

- Diamond type filter applied at API query level, not client-side
- Cert lab multi-select: at least one must be selected; validation error if none
- Fair price calculation scoped to selected diamond type (lab-grown and natural are separate markets with very different price ranges)
- When "All" selected: results show both types with clear badges; fair price displayed separately for each type

---

## 3. Results & Listing Cards

### 3.1 Fair price display

- **"All" selected:** Two fair price cards side by side — one for natural, one for lab-grown
- **"Natural" or "Lab-Grown" selected:** Single fair price card (current behaviour)
- Each fair price card labelled clearly with diamond type

### 3.2 Listing card updates

**Diamond type badge:**
- "Natural" — subtle neutral badge (existing border/text color)
- "Lab-Grown" — green-tinted badge (using deal-great color family)

**Certification badge with trust indicator tooltip:**

| Lab | Tooltip |
|-----|---------|
| GIA | "Widely recognised, consistent grading" |
| IGI | "Widely recognised, consistent grading" |
| AGS | "Widely recognised, consistent grading" |
| HRD | "Respected European lab, consistent grading" |
| EGL | "May grade 1-2 grades more leniently than GIA" |
| GCAL | "Guaranteed grading with certificate of authenticity" |

**Affiliate disclosure:**
- Small "Ad" label positioned near the retailer link on every listing card
- Required by UK Consumer Protection from Unfair Trading Regulations 2008

**Expanded details section:**
- Collapsible "More details" below main card info
- Shows symmetry, polish, fluorescence when data available
- Hidden entirely if all three are null for that listing

### 3.3 Wording changes

- Hero/header copy: remove "UK diamond comparison price"
- Replace with: "Compare diamond prices from trusted retailers"
- All other copy: refer to "diamonds" not "rings" or "jewellery"
- Currency remains GBP, no geographic claim needed

---

## 4. Feeds & Exchange Rate

### 4.1 Live exchange rate

- Fetch live USD→GBP rate from free API (e.g., `open.er-api.com`) at start of each cron run
- Upsert into `exchange_rates` table
- Feed adapters read rate from DB instead of hardcoded 0.79
- Fallback: if API call fails, use most recent stored rate (always have a rate available)

### 4.2 Feed adapter changes

- Blue Nile + James Allen adapters updated to extract new fields where available:
  - `diamond_type` — parsed from feed category/title field
  - `symmetry`, `polish`, `fluorescence` — extracted if present, null otherwise
  - `certification_body` — expanded to recognise HRD, AGS, EGL, GCAL in feed data
- Fields not provided by a feed default to `null`

### 4.3 Cron job flow

```
1. Fetch live exchange rate → upsert exchange_rates table
2. Fetch Blue Nile feed → parse with new fields → upsert listings
3. Fetch James Allen feed → parse with new fields → upsert listings
4. Delete listings older than 7 days
5. Return status report (include exchange rate used, counts per diamond type)
```

### 4.4 Sample data fallback

Updated to include a mix of:
- Natural diamonds (various cert labs)
- Lab-grown diamonds (various cert labs)
- Some listings with symmetry/polish/fluorescence populated
- Some listings with those fields as null (realistic)

---

## 5. Terms & Conditions + Legal Compliance

### 5.1 New `/terms` page

Sections required:

1. **Business identity** (Electronic Commerce (EC Directive) Regulations 2002, reg. 6)
   - Trading name: FindMyDiamond
   - Contact email address
   - Correspondence address (or registered address if incorporated)

2. **Service description**
   - Independent diamond price comparison tool
   - Not a retailer; no purchases made on-site
   - Prices sourced from third-party retailer feeds

3. **Affiliate disclosure** (Consumer Protection from Unfair Trading Regulations 2008, reg. 6)
   - "We earn commission when you click through to a retailer and make a purchase. This does not affect the price you pay."
   - Named as commercial practice with material information disclosed

4. **Price accuracy disclaimer**
   - Prices sourced from third-party feeds, updated regularly but not real-time
   - Prices may differ on retailer's actual site
   - All prices in GBP, converted from source currency using live exchange rates
   - Exchange rates updated periodically; minor discrepancies possible

5. **Fair price algorithm disclaimer**
   - Statistical estimate based on current market data
   - Not a professional valuation, appraisal, or financial advice
   - Should not be solely relied upon for purchase decisions

6. **Grading lab disclaimer**
   - Grading standards and consistency vary between certification labs
   - Trust indicators are informational, based on industry consensus, not endorsements
   - Users should conduct their own research on grading lab standards

7. **Liability limitation** (compliant with Consumer Rights Act 2015, s.57 & Unfair Contract Terms Act 1977)
   - Not liable for: retailer disputes, delivery issues, product quality, pricing errors from third-party feeds
   - Does NOT exclude liability for: fraud, death or personal injury caused by negligence (cannot be excluded under UK law, s.2 UCTA 1977)
   - Limitation applies "to the fullest extent permitted by law"

8. **Intellectual property**
   - Site content, design, fair-price algorithm, and FindMyDiamond branding are proprietary
   - Users may not scrape, reproduce, or redistribute data

9. **Governing law and jurisdiction**
   - Laws of England and Wales
   - Courts of England and Wales have exclusive jurisdiction

### 5.2 On-page legal disclosures

These appear on the main site, not just the T&C page:

- **"Ad" label** on every listing card that contains an affiliate link
- **Footer** links to both `/terms` and `/privacy`
- **Fair price section** includes small disclaimer: "This is a statistical estimate, not a valuation"
- **No cookie consent banner needed** currently (essential cookies only)

### 5.3 Existing privacy policy

The `/privacy` page already covers UK GDPR. No changes needed unless new data collection is added (it isn't in this phase).

---

## 6. Out of Scope

- Mount/setting UI and feeds (next phase — schema future-proofed only)
- New feed integrations (Nivoda, 77 Diamonds direct, Queensmith direct)
- Search filters for symmetry/polish/fluorescence
- Cookie consent banner (not needed until non-essential cookies added)
- Paid ads or premium listing features
- User accounts or authentication
