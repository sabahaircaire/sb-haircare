// SB Haircare — Catalogue marché (produits concurrents et complémentaires)
//
// CE FICHIER EST À REMPLIR PAR L'AGENT COWORK (ou manuellement).
// Format : 1 entrée par produit. Plus tu remplis, plus l'app est puissante.
//
// PRIORITÉ catalogue de démarrage (40-50 produits suffisent pour 80% du marché afro FR) :
//   Cantu, Shea Moisture, As I Am, Aunt Jackie's, Mielle, Camille Rose,
//   Carol's Daughter, Jamaican Mango & Lime, Hask, Eco Styler, Design Essentials,
//   The Mane Choice, TGIN, Marie Beauty, Garnier Botanic Therapy (BIO),
//   Yes To, Briogeo, Maui Moisture.
//
// CONSIGNES PHOTOS :
//   - Récupérer la photo officielle depuis le site de la marque (URL stable)
//   - Préférer une photo packshot fond blanc/neutre (pas de modèle, pas de fond complexe)
//   - URL directe (.jpg / .png) — pas de page HTML, pas de CDN expiring
//
// CONSIGNES SCORES (à remplir par cowork ou manuellement) :
//   - good_for_porosity {low, medium, high} : 1-5 chacun (5 = parfait pour cette porosité)
//   - good_for_type {3a..4c} : 1-5 (peut être null si non spécifique)
//   - ingredients_grade : "A" | "B" | "C" | "D" | "E" (style Yuka, depuis INCI)
//   - sb_brand_score : 1-5 (alignement valeurs SB Haircare : naturel, vegan, ayurvédique)
//   - flags : tags à cocher si présents — voir liste plus bas

export type ProductCategory =
  | "leave_in"
  | "cream"
  | "mask"
  | "shampoo"
  | "conditioner"
  | "cowash"
  | "oil"
  | "butter"
  | "gel"
  | "spray"
  | "edge_control"
  | "scalp_care"
  | "heat_protectant";

export type ProductFlag =
  | "vegan"
  | "natural"
  | "ayurvedic"
  | "no_sulfates"
  | "no_silicones"
  | "no_parabens"
  | "no_alcohol"
  | "contains_silicones"
  | "contains_sulfates"
  | "contains_protein"
  | "contains_drying_alcohol"
  | "contains_mineral_oil"
  | "fragrance_free";

export type IngredientsGrade = "A" | "B" | "C" | "D" | "E";

export type MarketProduct = {
  slug: string;                                    // unique id, kebab-case
  name: string;
  brand: string;
  category: ProductCategory;
  image_url: string;                               // URL absolue (peut être '' avant scraping)
  product_url?: string;                            // page produit officielle (utilisée par scrape-product-images.mjs)
  size?: string;                                   // "355ml" / "227g"
  price_eur?: number;                              // si connu

  short: string;                                   // 1 phrase de pitch
  ingredients_key: string[];                       // 3-6 ingrédients phares
  inci_full?: string;                              // liste INCI complète (texte brut)

  good_for_porosity: { low: number; medium: number; high: number };  // 1-5
  good_for_type?: Partial<Record<"3a" | "3b" | "3c" | "4a" | "4b" | "4c", number>>;
  ingredients_grade: IngredientsGrade;             // A/B/C/D/E façon Yuka
  sb_brand_score: number;                          // 1-5

  flags: ProductFlag[];

  usage_guide: string;                             // markdown — quand/comment utiliser
  sb_alternative_slug?: string;                    // slug d'un produit SB Haircare équivalent
};

// -----------------------------------------------------------------------------
// EXEMPLES — 5 produits remplis pour montrer le format à cowork.
// Cowork doit remplir le tableau MARKET_PRODUCTS avec 40-50 entrées suivant ce format.
// -----------------------------------------------------------------------------

export const MARKET_PRODUCTS: MarketProduct[] = [
  {
    slug: "cantu-curl-activator-cream",
    name: "Curl Activator Cream",
    brand: "Cantu",
    category: "cream",
    image_url: "",
    product_url: "https://cantubeauty.com/products/curl-activator-cream",
    size: "355ml",
    price_eur: 8.99,
    short:
      "Crème activatrice de boucles à base de shea butter — best-seller communauté afro.",
    ingredients_key: ["Karité", "Huile coco", "Huile olive", "Glycérine"],
    good_for_porosity: { low: 2, medium: 4, high: 5 },
    good_for_type: { "3c": 4, "4a": 5, "4b": 4, "4c": 3 },
    ingredients_grade: "C",
    sb_brand_score: 3,
    flags: ["contains_silicones", "no_sulfates", "contains_protein"],
    usage_guide:
      "Sur cheveux mouillés après le leave-in. Section par section, scrunch pour activer. Méthode LOC : utilise comme étape Cream après ton huile.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "shea-moisture-curl-enhancing-smoothie",
    name: "Curl Enhancing Smoothie Coconut & Hibiscus",
    brand: "SheaMoisture",
    category: "cream",
    image_url: "",
    product_url:
      "https://www.sheamoisture.com/coconut-hibiscus-curl-enhancing-smoothie.html",
    size: "340g",
    price_eur: 12.99,
    short:
      "Crème coiffante coco + hibiscus, hydrate et définit les boucles épaisses.",
    ingredients_key: ["Karité", "Huile coco", "Hibiscus", "Soie de neem"],
    good_for_porosity: { low: 2, medium: 5, high: 5 },
    good_for_type: { "3c": 5, "4a": 5, "4b": 4 },
    ingredients_grade: "B",
    sb_brand_score: 4,
    flags: ["no_sulfates", "no_parabens", "no_silicones"],
    usage_guide:
      "Sur cheveux humides après le leave-in, en méthode LCO (Crème après l'Huile). Distribue mèche par mèche pour définition optimale.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "as-i-am-leave-in-conditioner",
    name: "Leave-In Conditioner",
    brand: "As I Am",
    category: "leave_in",
    image_url: "",
    product_url: "https://asiamnaturally.com/products/leave-in-conditioner",
    size: "237ml",
    price_eur: 10.5,
    short:
      "Leave-in léger pour démêlage et hydratation quotidienne. Texture crème fluide.",
    ingredients_key: ["Aloe vera", "Huile coco", "Sea Buckthorn"],
    good_for_porosity: { low: 5, medium: 5, high: 3 },
    good_for_type: { "3a": 5, "3b": 5, "3c": 5, "4a": 4, "4b": 3 },
    ingredients_grade: "B",
    sb_brand_score: 4,
    flags: ["no_sulfates", "no_parabens", "no_silicones", "vegan"],
    usage_guide:
      "Première étape post-shampoing sur cheveux humides. Vaporise et démêle aux doigts. Méthode LOC : étape Liquid.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "mielle-pomegranate-honey-leave-in",
    name: "Pomegranate & Honey Leave-In Conditioner",
    brand: "Mielle Organics",
    category: "leave_in",
    image_url: "",
    product_url: "https://mielleorganics.com/products/pomegranate-honey",
    size: "237ml",
    price_eur: 11.99,
    short:
      "Leave-in spécial cheveux 4 — grenade et miel pour douceur et brillance.",
    ingredients_key: ["Grenade", "Miel", "Babassu", "Mongongo oil"],
    good_for_porosity: { low: 2, medium: 4, high: 5 },
    good_for_type: { "4a": 5, "4b": 5, "4c": 5 },
    ingredients_grade: "B",
    sb_brand_score: 4,
    flags: ["no_sulfates", "no_parabens"],
    usage_guide:
      "Sur cheveux humides après le shampoing. Particulièrement adapté aux 4B/4C très secs ou demandant beaucoup d'hydratation.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "jamaican-mango-lime-black-castor-oil",
    name: "Black Castor Oil",
    brand: "Jamaican Mango & Lime",
    category: "oil",
    image_url: "",
    product_url: "https://jamaicanmangoandlime.com/products/black-castor-oil",
    size: "118ml",
    price_eur: 7.99,
    short:
      "Huile de ricin noire jamaïcaine pure — épaisse, stimule le cuir chevelu.",
    ingredients_key: ["Huile ricin noire (100%)"],
    good_for_porosity: { low: 3, medium: 4, high: 5 },
    good_for_type: { "3c": 4, "4a": 5, "4b": 5, "4c": 5 },
    ingredients_grade: "A",
    sb_brand_score: 5,
    flags: ["natural", "vegan", "no_silicones", "no_sulfates", "fragrance_free"],
    usage_guide:
      "Quelques gouttes sur le cuir chevelu en massage, ou comme scellant LOC sur les pointes. Trop épaisse pour les porosités faibles — mélange à une huile plus légère (jojoba).",
    sb_alternative_slug: "huile-raiponce",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COWORK : à partir d'ici, ajoute les 40+ autres produits suivant ce format.
  // Au minimum couvre : leave-in, masque, scellant, shampoing, huile, gel/edge.
  // ─────────────────────────────────────────────────────────────────────────
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export const CATEGORY_LABELS_MARKET: Record<ProductCategory, string> = {
  leave_in: "Leave-in",
  cream: "Crème",
  mask: "Masque",
  shampoo: "Shampoing",
  conditioner: "Après-shampoing",
  cowash: "Co-wash",
  oil: "Huile",
  butter: "Beurre",
  gel: "Gel",
  spray: "Spray",
  edge_control: "Edge control",
  scalp_care: "Soin cuir chevelu",
  heat_protectant: "Protection chaleur",
};

export const FLAG_LABELS: Record<ProductFlag, { label: string; positive: boolean }> = {
  vegan: { label: "Vegan", positive: true },
  natural: { label: "Naturel", positive: true },
  ayurvedic: { label: "Ayurvédique", positive: true },
  no_sulfates: { label: "Sans sulfates", positive: true },
  no_silicones: { label: "Sans silicones", positive: true },
  no_parabens: { label: "Sans parabens", positive: true },
  no_alcohol: { label: "Sans alcool", positive: true },
  fragrance_free: { label: "Sans parfum", positive: true },
  contains_silicones: { label: "Silicones", positive: false },
  contains_sulfates: { label: "Sulfates", positive: false },
  contains_protein: { label: "Protéines", positive: false },
  contains_drying_alcohol: { label: "Alcool desséchant", positive: false },
  contains_mineral_oil: { label: "Huile minérale", positive: false },
};

export function getMarketProduct(slug: string): MarketProduct | undefined {
  return MARKET_PRODUCTS.find((p) => p.slug === slug);
}

// Compute the global match badge for a user profile.
export type MatchBadge = "top" | "good" | "ok" | "avoid";

export function computeMatchBadge(
  product: MarketProduct,
  porosity: "low" | "medium" | "high" | null | undefined,
  hairType?: string | null,
): { badge: MatchBadge; score: number } {
  const porosityScore = porosity ? product.good_for_porosity[porosity] : 3;
  const typeScore =
    hairType && product.good_for_type?.[hairType as keyof typeof product.good_for_type]
      ? product.good_for_type[hairType as keyof typeof product.good_for_type]!
      : 3;
  const ingredientsScore = { A: 5, B: 4, C: 3, D: 2, E: 1 }[
    product.ingredients_grade
  ];
  const brandScore = product.sb_brand_score;

  // Weighted average
  const total =
    porosityScore * 0.4 +
    typeScore * 0.2 +
    ingredientsScore * 0.25 +
    brandScore * 0.15;

  let badge: MatchBadge;
  if (total >= 4.3) badge = "top";
  else if (total >= 3.5) badge = "good";
  else if (total >= 2.5) badge = "ok";
  else badge = "avoid";

  return { badge, score: Math.round(total * 10) / 10 };
}

export const BADGE_META: Record<
  MatchBadge,
  { label: string; color: string; emoji: string }
> = {
  top: { label: "Top match", color: "#1F7A3D", emoji: "🟢" },
  good: { label: "Bon", color: "#D4A24C", emoji: "🟡" },
  ok: { label: "À ajuster", color: "#C97A3A", emoji: "🟠" },
  avoid: { label: "Pas pour toi", color: "#D32F2F", emoji: "🔴" },
};
