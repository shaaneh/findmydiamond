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
export type CertificationBody = "GIA" | "IGI";

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

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: Listing;
        Insert: Omit<Listing, "id" | "created_at">;
        Update: Partial<Omit<Listing, "id" | "created_at">>;
      };
      email_signups: {
        Row: EmailSignup;
        Insert: Omit<EmailSignup, "id" | "created_at">;
        Update: Partial<Omit<EmailSignup, "id" | "created_at">>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export interface SearchParams {
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
  budget?: number;
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
