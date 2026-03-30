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
