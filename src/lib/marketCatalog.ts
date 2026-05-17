// src/lib/marketCatalog.ts
//
// Catalogue des produits stars du marché capillaire afro français.
// Chaque produit pointe vers l'alternative SB Haircare la plus proche fonctionnellement.
//
// ⚠️ INCI : transcrits depuis les pages produits officielles des marques. Les marques
//    reformulent régulièrement — re-vérifier ponctuellement (1×/an minimum).
// ⚠️ image_url : marqué `''` + TODO. À remplir avec l'URL exacte de l'image hébergée
//    sur le CDN de la marque (clic droit sur l'image > "Copier l'adresse de l'image"
//    depuis la page produit). product_url donne le lien direct vers cette page.
// ⚠️ Prix : indicatifs marché FR (varient ±20% selon revendeur — Beauty Coiffure,
//    Afroshopping, Sephora, Amazon, etc.).

export type ProductCategory =
  | "leave-in"
  | "creme"
  | "masque"
  | "huile"
  | "shampoing"
  | "co-wash"
  | "gel"
  | "edge"
  | "spray";

export type IngredientsGrade = "A" | "B" | "C" | "D" | "E";

/** Slug des produits SB Haircare disponibles comme alternative fonctionnelle. */
export type SBAlternativeSlug =
  | "huile-raiponce"
  | "chantilly"
  | "masque-ayurvedique"
  | "masque-longueur";

/**
 * Échelle 1-5 indiquant le niveau de porosité/type pour lequel le produit
 * est le plus adapté.
 * - good_for_porosity : 1 = très faible porosité, 5 = très haute porosité
 * - good_for_type     : 1 = cheveux fins/ondulés, 5 = cheveux crépus 4C denses
 */
export type AdaptationScore = 1 | 2 | 3 | 4 | 5;

export interface ProductFlags {
  /** Silicones non-solubles dans l'eau (dimethicone, cyclopentasiloxane…). */
  contains_silicones: boolean;
  /** Sulfates agressifs (SLS, SLES, ALS). */
  contains_sulfates: boolean;
  /** Parabens (methyl/propyl/butyl/ethylparaben…). */
  contains_parabens: boolean;
  /** Alcools desséchants à chaîne courte (alcohol denat, SD alcohol, isopropyl). */
  contains_drying_alcohols: boolean;
  /** Huiles minérales (mineral oil, paraffinum liquidum, petrolatum). */
  contains_mineral_oil: boolean;
  /** Pétrolatum / vaseline. */
  contains_petrolatum: boolean;
  /** Parfum synthétique non détaillé (Parfum / Fragrance). */
  contains_fragrance: boolean;
  /** Protéines hydrolysées (blé, soie, kératine, quinoa, riz…). */
  contains_protein: boolean;
  /** Libérateurs de formaldéhyde (DMDM Hydantoin, Quaternium-15, Imidazolidinyl Urea). */
  contains_formaldehyde_releasers: boolean;
}

export interface MarketProduct {
  /** Slug unique kebab-case : `<brand>-<short-name>`. */
  slug: string;
  brand: string;
  name: string;
  category: ProductCategory;
  /** URL absolue de la photo officielle (CDN marque). */
  image_url: string;
  /** URL absolue de la page produit officielle. */
  product_url: string;
  /** Liste INCI complète, ingrédients séparés par virgules. */
  inci: string;
  /** Prix indicatif TTC en euros sur le marché français. */
  price_eur: number;
  /** Contenance en ml (ou g pour produits semi-solides). */
  size_ml: number;
  good_for_porosity: AdaptationScore;
  good_for_type: AdaptationScore;
  /** Grade Yuka-style. A = clean, E = nombreux ingrédients problématiques. */
  ingredients_grade: IngredientsGrade;
  flags: ProductFlags;
  /** 1-2 phrases sur le mode d'emploi conseillé. */
  usage_guide: string;
  /** Slug du produit SB Haircare le plus proche fonctionnellement. */
  sb_alternative_slug: SBAlternativeSlug;
}

/**
 * Helper pour créer un objet flags par défaut (tout à false), à surcharger
 * uniquement avec les flags présents dans l'INCI du produit.
 */
const cleanFlags: ProductFlags = {
  contains_silicones: false,
  contains_sulfates: false,
  contains_parabens: false,
  contains_drying_alcohols: false,
  contains_mineral_oil: false,
  contains_petrolatum: false,
  contains_fragrance: false,
  contains_protein: false,
  contains_formaldehyde_releasers: false,
};

export const MARKET_PRODUCTS: MarketProduct[] = [
  {
    slug: "asiam-coconut-cowash",
    brand: "As I Am",
    name: "Coconut CoWash Cleansing Conditioner",
    category: "co-wash",
    image_url: "https://asiamnaturally.com/cdn/shop/products/02.AsIAmClassic_CoconutCowashsquare.jpg?v=1678475184",
    product_url: "https://asiamnaturally.com/products/coconut-cowash",
    inci:
      "Water, Cetearyl Alcohol, Hibiscus Sabdariffa Flower Powder, " +
      "Phytosterols (Castor Oil), Hydroxyethylcellulose, Cetyl Alcohol, " +
      "Glycerin, Polyquaternium-10, Sodium Hydroxypropyltrimonium Hydrolyzed " +
      "Castor Oil, Tocopheryl Acetate, Tridecyl Salicylate, Aloe Barbadensis " +
      "Leaf Juice, Serenoa Serrulata (Saw Palmetto) Fruit Extract, " +
      "Behentrimonium Methosulfate, Phenoxyethanol, Citric Acid, Disodium EDTA, Fragrance.",
    price_eur: 13.9,
    size_ml: 454,
    good_for_porosity: 2,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Co-wash à utiliser à la place du shampoing : émulsionner généreusement sur cheveux mouillés, masser racines aux pointes, laisser poser 3-5 min et rincer.",
    sb_alternative_slug: "masque-longueur",
  },
  {
    slug: "asiam-leave-in-conditioner",
    brand: "As I Am",
    name: "Leave-In Conditioner",
    category: "leave-in",
    image_url: "https://asiamnaturally.com/cdn/shop/files/coconut_leave_in_conditioner_8_oz_1.png?v=1766507601",
    product_url: "https://asiamnaturally.com/products/leave-in-conditioner",
    inci:
      "Water, Behentrimonium Methosulfate, Cetyl Alcohol, " +
      "Hibiscus Sabdariffa Flower Powder, Phytosterols (Castor Oil), " +
      "Hydroxyethylcellulose, Cocos Nucifera (Coconut) Oil, " +
      "Aloe Barbadensis Leaf Juice, Serenoa Serrulata Fruit Extract, " +
      "Tridecyl Salicylate, Citric Acid, Phenoxyethanol, Fragrance.",
    price_eur: 12.9,
    size_ml: 227,
    good_for_porosity: 3,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Après lavage, déposer une noisette dans les longueurs humides pour démêler, hydrater et préparer au coiffage. Ne pas rincer.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "asiam-doublebutter-cream",
    brand: "As I Am",
    name: "DoubleButter Cream",
    category: "creme",
    image_url: "https://asiamnaturally.com/cdn/shop/products/05.AsIAmClassic_DoublebutterCreamsquare_c1c6723b-2b63-4751-af07-40ea392f40d1.jpg?v=1661198527",
    product_url: "https://asiamnaturally.com/products/doublebutter-cream",
    inci:
      "Water, Ricinus Communis (Castor) Seed Oil, Behentrimonium Methosulfate, " +
      "Cetearyl Alcohol, Mangifera Indica (Mango) Seed Butter, " +
      "Theobroma Cacao (Cocoa) Seed Butter, Butyrospermum Parkii (Shea) Butter, " +
      "Glycerin, Cocos Nucifera (Coconut) Oil, Olea Europaea (Olive) Fruit Oil, " +
      "Argania Spinosa Kernel Oil, Persea Gratissima (Avocado) Oil, " +
      "Phenoxyethanol, Fragrance.",
    price_eur: 14.9,
    size_ml: 227,
    good_for_porosity: 2,
    good_for_type: 5,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Crème riche pour cheveux denses et secs : prélever une noisette, réchauffer entre les paumes et appliquer mèche par mèche pour sceller l'hydratation.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "asiam-hydration-elation",
    brand: "As I Am",
    name: "Hydration Elation Intensive Conditioner",
    category: "masque",
    image_url: "https://cdn.shopify.com/s/files/1/2241/0171/files/Classic_coconut_hydration_elation.png?v=1765214920",
    product_url: "https://asiamnaturally.com/products/hydration-elation",
    inci:
      "Water, Cetyl Alcohol, Stearalkonium Chloride, Mangifera Indica (Mango) Seed Butter, " +
      "Coffea Arabica Seed Extract, Hibiscus Sabdariffa Flower Powder, " +
      "Aloe Barbadensis Leaf Juice, Carthamus Tinctorius (Safflower) Seed Oil, " +
      "Behentrimonium Methosulfate, Serenoa Serrulata Fruit Extract, " +
      "Phenoxyethanol, Tocopheryl Acetate, Fragrance.",
    price_eur: 15.9,
    size_ml: 227,
    good_for_porosity: 4,
    good_for_type: 5,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Masque hydratant intensif : appliquer généreusement sur cheveux propres essorés, peigner pour bien répartir, laisser poser 15-30 min sous bonnet chauffant puis rincer.",
    sb_alternative_slug: "masque-longueur",
  },
  {
    slug: "auntjackies-dont-shrink",
    brand: "Aunt Jackie's",
    name: "Don't Shrink Flaxseed Elongating Curling Gel",
    category: "gel",
    image_url: "https://cdn.shopify.com/s/files/1/0573/6123/6126/files/34285692155_AUNTJACKIES_DontShrinkCurlingGel_15ozJar_FRONT_94f868b4-bb0d-4328-aa67-ade6ed7b2648.jpg?v=1744305715",
    product_url: "https://www.auntjackiescurlsandcoils.com/products/dont-shrink-elongating-curling-gel",
    inci:
      "Water, Glycerin, Linum Usitatissimum (Linseed) Seed Extract, " +
      "Polyquaternium-11, PVP, Carbomer, Aminomethyl Propanol, " +
      "Cocos Nucifera (Coconut) Oil, Argania Spinosa Kernel Oil, " +
      "Olea Europaea (Olive) Fruit Oil, Phenoxyethanol, " +
      "Tetrasodium EDTA, Fragrance.",
    price_eur: 11.9,
    size_ml: 426,
    good_for_porosity: 4,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Sur cheveux gorgés d'eau, appliquer mèche par mèche avec la méthode 'praying hands' ou 'raking' pour étirer la boucle, limiter le rétrécissement et définir.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "auntjackies-quench-leave-in",
    brand: "Aunt Jackie's",
    name: "Quench Moisture Intensive Leave-In Conditioner",
    category: "leave-in",
    image_url: "https://cdn.shopify.com/s/files/1/0573/6123/6126/files/34285693060_AUNTJACKIES_Quench_8ozBottle_FRONT.jpg?v=1752761788",
    product_url: "https://www.auntjackiescurlsandcoils.com/products/quench-moisture-intensive-leave-in-conditioner-2",
    inci:
      "Water, Cetearyl Alcohol, Behentrimonium Methosulfate, Glycerin, " +
      "Linum Usitatissimum (Linseed) Seed Extract, Cocos Nucifera (Coconut) Oil, " +
      "Olea Europaea (Olive) Fruit Oil, Argania Spinosa Kernel Oil, " +
      "Persea Gratissima (Avocado) Oil, Butyrospermum Parkii (Shea) Butter, " +
      "Phenoxyethanol, Tocopheryl Acetate, Fragrance.",
    price_eur: 11.5,
    size_ml: 355,
    good_for_porosity: 3,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Sur cheveux humides après lavage, appliquer généreusement pour démêler et hydrater. Particulièrement adapté avant un protective style.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "auntjackies-curl-la-la",
    brand: "Aunt Jackie's",
    name: "Curl La La Defining Curl Custard",
    category: "creme",
    image_url: "https://www.auntjackiescurlsandcoils.com/cdn/shop/files/9-696-15_AJ_CLL_CurlDefiningCustard_15ozJar_FRONT.jpg?v=1767114415",
    product_url:
      "https://www.auntjackiescurlsandcoils.com/products/curl-la-la-defining-curl-custard",
    inci:
      "Water, Stearalkonium Chloride, Cetearyl Alcohol, Glycerin, " +
      "Linum Usitatissimum (Linseed) Seed Extract, Cocos Nucifera (Coconut) Oil, " +
      "Argania Spinosa Kernel Oil, Olea Europaea (Olive) Fruit Oil, " +
      "Polyquaternium-11, PVP, Phenoxyethanol, Fragrance.",
    price_eur: 11.5,
    size_ml: 426,
    good_for_porosity: 4,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Custard léger entre crème et gel : appliquer sur cheveux mouillés pour définir les boucles sans alourdir. Compatible avec la méthode LCO.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "mielle-rosemary-mint-oil",
    brand: "Mielle Organics",
    name: "Rosemary Mint Scalp & Hair Strengthening Oil",
    category: "huile",
    image_url: "https://cdn.shopify.com/s/files/1/0763/8199/files/Rosemary_Oil_SHAcopy.jpg?v=1764011088",
    product_url: "https://mielleorganics.com/products/rosemary-mint-oil",
    inci:
      "Olea Europaea (Olive) Fruit Oil, Helianthus Annuus (Sunflower) Seed Oil, " +
      "Mentha Arvensis Leaf Extract, Mentha Piperita (Peppermint) Oil, " +
      "Rosmarinus Officinalis (Rosemary) Leaf Extract, " +
      "Lavandula Angustifolia (Lavender) Oil, Cedrus Atlantica Bark Oil, " +
      "Ricinus Communis (Castor) Seed Oil, Biotin, Tocopherol.",
    price_eur: 14.9,
    size_ml: 59,
    good_for_porosity: 3,
    good_for_type: 5,
    ingredients_grade: "A",
    flags: { ...cleanFlags },
    usage_guide:
      "Sur cuir chevelu propre, déposer quelques gouttes directement sur les racines et masser pendant 3-5 min pour stimuler la circulation. 2-3 fois par semaine.",
    sb_alternative_slug: "huile-raiponce",
  },
  {
    slug: "mielle-pomegranate-honey-leave-in",
    brand: "Mielle Organics",
    name: "Pomegranate & Honey Leave-In Conditioner",
    category: "leave-in",
    image_url: "https://mielleorganics.com/cdn/shop/files/Packshot_908ea048-61e8-457a-8fdf-6ce889427d44_600x.jpg?v=1761168863",
    product_url:
      "https://mielleorganics.com/products/pomegranate-honey-leave-in-conditioner",
    inci:
      "Water, Glycerin, Behentrimonium Methosulfate, Cetearyl Alcohol, " +
      "Honey, Punica Granatum (Pomegranate) Fruit Extract, " +
      "Orbignya Oleifera (Babassu) Seed Oil, Cetyl Alcohol, " +
      "Hydrolyzed Wheat Protein, Tocopheryl Acetate, Phenoxyethanol, Fragrance.",
    price_eur: 14.5,
    size_ml: 355,
    good_for_porosity: 4,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true, contains_protein: true },
    usage_guide:
      "Vaporiser ou appliquer sur cheveux humides, démêler doucement au peigne à dents larges puis coiffer. Idéal pour cheveux à haute porosité qui boivent vite.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "mielle-babassu-mint-deep",
    brand: "Mielle Organics",
    name: "Babassu & Mint Deep Conditioner",
    category: "masque",
    image_url: "https://mielleorganics.com/cdn/shop/files/Packshot_Mielle_SHAseal_BabMint_DeepCond_8oz_En_80835620_2048px_600x.jpg?v=1759329346",
    product_url:
      "https://mielleorganics.com/products/babassu-mint-deep-conditioner",
    inci:
      "Water, Glycerin, Cetearyl Alcohol, Orbignya Oleifera (Babassu) Seed Oil, " +
      "Behentrimonium Methosulfate, Honey, Mentha Piperita (Peppermint) Oil, " +
      "Hydrolyzed Quinoa, Hibiscus Sabdariffa Flower Extract, " +
      "Tocopheryl Acetate, Phenoxyethanol, Fragrance.",
    price_eur: 14.9,
    size_ml: 355,
    good_for_porosity: 3,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true, contains_protein: true },
    usage_guide:
      "Après shampoing, appliquer généreusement sur cheveux essorés, laisser poser 15-20 min sous bonnet (chaleur conseillée) et rincer. 1×/semaine.",
    sb_alternative_slug: "masque-longueur",
  },
  {
    slug: "camillerose-curl-maker",
    brand: "Camille Rose",
    name: "Curl Maker",
    category: "gel",
    image_url: "https://www.camillerose.com/cdn/shop/files/ProductCard_Signature_CurlMaker.webp?v=1772794164",
    product_url: "https://www.camillerose.com/products/curl-maker",
    inci:
      "Aqua (Water), Glycerin, Althaea Officinalis (Marshmallow) Root Extract, " +
      "Ulmus Rubra (Slippery Elm) Bark Extract, Aloe Barbadensis Leaf Juice, " +
      "Agave Tequilana Leaf Extract, Persea Gratissima (Avocado) Oil, " +
      "Hydrolyzed Wheat Protein, Honey, Ricinus Communis (Castor) Seed Oil, " +
      "Olea Europaea (Olive) Fruit Oil, Carrageenan, Sodium Lactate, " +
      "Lactic Acid, Sea Salt, Phenoxyethanol, Fragrance.",
    price_eur: 18.9,
    size_ml: 240,
    good_for_porosity: 4,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true, contains_protein: true },
    usage_guide:
      "Gel jelly à base de plantes : appliquer généreusement sur cheveux trempés pour une définition souple, sans effet carton. Ne pas casser le cast au séchage.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "camillerose-almond-jai",
    brand: "Camille Rose",
    name: "Almond Jai Twisting Butter",
    category: "creme",
    image_url: "https://www.camillerose.com/cdn/shop/files/ProductCard_Signature_AlmondJai.webp?v=1772792913",
    product_url: "https://www.camillerose.com/products/almond-jai-twisting-butter",
    inci:
      "Aqua (Water), Glycerin, Cetearyl Alcohol, " +
      "Prunus Amygdalus Dulcis (Sweet Almond) Oil, Behentrimonium Methosulfate, " +
      "Butyrospermum Parkii (Shea) Butter, Theobroma Cacao (Cocoa) Seed Butter, " +
      "Macadamia Ternifolia Seed Oil, Sodium PCA, Aloe Barbadensis Leaf Juice, " +
      "Hydrolyzed Wheat Protein, Tocopheryl Acetate, Phenoxyethanol, Fragrance.",
    price_eur: 19.9,
    size_ml: 240,
    good_for_porosity: 3,
    good_for_type: 5,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true, contains_protein: true },
    usage_guide:
      "Beurre coiffant pour twists, vanilles ou braid-outs : appliquer sur cheveux humides hydratés, mèche par mèche, pour twister et définir.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "camillerose-algae-renew",
    brand: "Camille Rose",
    name: "Algae Renew Deep Conditioner",
    category: "masque",
    image_url: "https://cdn.shopify.com/s/files/1/0980/9736/files/ProductCard_Signature_AlgaeRenew.webp?v=1772792750",
    product_url: "https://www.camillerose.com/products/algae-renew-deep-conditioning-max",
    inci:
      "Aqua (Water), Cetearyl Alcohol, Behentrimonium Methosulfate, Glycerin, " +
      "Persea Gratissima (Avocado) Oil, Mangifera Indica (Mango) Seed Butter, " +
      "Theobroma Cacao (Cocoa) Seed Butter, Spirulina Maxima Extract, " +
      "Chlorella Vulgaris Extract, Aloe Barbadensis Leaf Juice, " +
      "Tocopheryl Acetate, Phenoxyethanol, Fragrance.",
    price_eur: 19.9,
    size_ml: 240,
    good_for_porosity: 4,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Masque deep conditioning aux algues : appliquer sur cheveux propres, laisser poser 20 min sous bonnet chauffant puis rincer abondamment.",
    sb_alternative_slug: "masque-ayurvedique",
  },
  {
    slug: "hask-argan-deep-conditioner",
    brand: "Hask",
    name: "Argan Oil from Morocco Repairing Deep Conditioner",
    category: "masque",
    image_url: "https://cdn.shopify.com/s/files/1/0575/1390/2193/files/1_Repair_DC_Sachet_FRT_2500px.png?v=1764947897",
    product_url: "https://www.haskbeauty.com/products/repair-arganoil-deep-conditioner",
    inci:
      "Water, Cetearyl Alcohol, Glycerin, Behentrimonium Methosulfate, " +
      "Argania Spinosa Kernel Oil, Cyclopentasiloxane, Dimethicone, " +
      "Amodimethicone, Hydrolyzed Wheat Protein, Panthenol, " +
      "Phenoxyethanol, Fragrance (Parfum).",
    price_eur: 5.9,
    size_ml: 50,
    good_for_porosity: 1,
    good_for_type: 3,
    ingredients_grade: "D",
    flags: {
      ...cleanFlags,
      contains_silicones: true,
      contains_fragrance: true,
      contains_protein: true,
    },
    usage_guide:
      "Sachet 50 ml dose unique : appliquer sur cheveux propres essorés, laisser poser 5-7 min, rincer. Effet lisse immédiat, mais accumulation de silicones — alterner avec shampoing clarifiant.",
    sb_alternative_slug: "masque-longueur",
  },
  {
    slug: "hask-monoi-deep-conditioner",
    brand: "Hask",
    name: "Monoi Coconut Oil Nourishing Deep Conditioner",
    category: "masque",
    image_url: "https://cdn.shopify.com/s/files/1/0575/1390/2193/files/1_Hydrate_DC_FRT_2500px.png?v=1764949489",
    product_url: "https://www.haskbeauty.com/products/hydrate-coconutoil-deep-conditioner",
    inci:
      "Water, Cetearyl Alcohol, Cocos Nucifera (Coconut) Oil (Monoi de Tahiti), " +
      "Behentrimonium Methosulfate, Cyclopentasiloxane, Dimethicone, Glycerin, " +
      "Tahitian Gardenia Flower Extract, Phenoxyethanol, Fragrance (Parfum).",
    price_eur: 5.9,
    size_ml: 50,
    good_for_porosity: 1,
    good_for_type: 3,
    ingredients_grade: "D",
    flags: { ...cleanFlags, contains_silicones: true, contains_fragrance: true },
    usage_guide:
      "Sachet dose unique parfum coco-monoï : appliquer sur cheveux essorés, laisser poser 5-7 min, rincer. Glisse au démêlage garantie mais charge en silicones.",
    sb_alternative_slug: "masque-longueur",
  },
  {
    slug: "designessentials-curl-enhancing-mousse",
    brand: "Design Essentials",
    name: "Natural Almond & Avocado Curl Enhancing Mousse",
    category: "creme",
    image_url: "https://designessentials.com/cdn/shop/files/AA-CurlEnhancingMousse-10oz-FRONT-0124-WO_1500x1500_e731438a-aaea-45ec-bdbb-5013a5e2b148.jpg?v=1752787707",
    product_url:
      "https://www.designessentials.com/products/almond-avocado-curl-enhancing-mousse",
    inci:
      "Water, Cetyl Alcohol, Glycerin, PVP, Stearyl Alcohol, " +
      "Prunus Amygdalus Dulcis (Sweet Almond) Oil, " +
      "Persea Gratissima (Avocado) Oil, Behentrimonium Methosulfate, " +
      "Polyquaternium-11, Hydroxypropyltrimonium Honey, " +
      "Phenoxyethanol, Fragrance (Parfum).",
    price_eur: 15.9,
    size_ml: 217,
    good_for_porosity: 3,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Mousse coiffante définissante : appliquer sur cheveux mouillés, scruncher pour activer la définition. Fini souple et touchable.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "designessentials-moisturizing-lotion",
    brand: "Design Essentials",
    name: "Natural Almond & Avocado Daily Moisturizing Lotion",
    category: "leave-in",
    image_url: "https://designessentials.com/cdn/shop/files/design-essentials-diverse-hair-textures-women-1920x1281.webp?v=1758514792",
    product_url:
      "https://www.designessentials.com/products/almond-avocado-daily-moisturizing-lotion",
    inci:
      "Water, Cetearyl Alcohol, Behentrimonium Methosulfate, Glycerin, " +
      "Prunus Amygdalus Dulcis (Sweet Almond) Oil, " +
      "Persea Gratissima (Avocado) Oil, Cyclopentasiloxane, Dimethicone, " +
      "Phenoxyethanol, Tocopheryl Acetate, Fragrance (Parfum).",
    price_eur: 16.9,
    size_ml: 237,
    good_for_porosity: 2,
    good_for_type: 3,
    ingredients_grade: "C",
    flags: { ...cleanFlags, contains_silicones: true, contains_fragrance: true },
    usage_guide:
      "Lotion hydratante quotidienne, finition lisse : déposer une noisette sur cheveux humides ou secs pour rafraîchir et discipliner. Contient des silicones — clarifier régulièrement.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "tgin-honey-miracle-mask",
    brand: "TGIN",
    name: "Honey Miracle Hair Mask",
    category: "masque",
    image_url: "https://tginatural.com/cdn/shop/files/Honey_Miracle_December_2025_2.png?v=1765391878&width=1024",
    product_url: "https://tginatural.com/products/honey-miracle-hair-mask",
    inci:
      "Water, Behentrimonium Methosulfate, Cetearyl Alcohol, Glycerin, " +
      "Honey, Cocos Nucifera (Coconut) Oil, Olea Europaea (Olive) Fruit Oil, " +
      "Butyrospermum Parkii (Shea) Butter, Argania Spinosa Kernel Oil, " +
      "Mentha Piperita (Peppermint) Oil, Tocopheryl Acetate, " +
      "Hydrolyzed Wheat Protein, Phenoxyethanol, Fragrance.",
    price_eur: 16.9,
    size_ml: 354,
    good_for_porosity: 4,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true, contains_protein: true },
    usage_guide:
      "Masque hydratant au miel, légèrement chauffant grâce à la menthe : appliquer sur cheveux essorés, laisser poser 20-30 min, rincer. Idéal cheveux assoiffés.",
    sb_alternative_slug: "masque-longueur",
  },
  {
    slug: "tgin-butter-cream",
    brand: "TGIN",
    name: "Butter Cream Daily Moisturizer",
    category: "creme",
    image_url: "https://cdn.shopify.com/s/files/1/0716/9540/1252/files/BUTTER-CREAM-EDIT-02.png?v=1743537797",
    product_url: "https://tginatural.com/products/butter-cream-daily-moisturizer-for-natural-hair-12oz-1",
    inci:
      "Water, Glycerin, Cetearyl Alcohol, Butyrospermum Parkii (Shea) Butter, " +
      "Behentrimonium Methosulfate, Cocos Nucifera (Coconut) Oil, " +
      "Ricinus Communis (Castor) Seed Oil, Olea Europaea (Olive) Fruit Oil, " +
      "Tocopheryl Acetate, Phenoxyethanol, Fragrance.",
    price_eur: 15.9,
    size_ml: 354,
    good_for_porosity: 3,
    good_for_type: 5,
    ingredients_grade: "A",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Crème hydratante quotidienne riche en karité : appliquer sur cheveux humides ou secs pour rafraîchir et sceller. Formule courte, sans silicones.",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "tgin-triple-moisture-conditioner",
    brand: "TGIN",
    name: "Triple Moisture Replenishing Conditioner",
    category: "masque",
    image_url: "https://cdn.shopify.com/s/files/1/0716/9540/1252/files/Triple_Moisture_Replenishing_Conditioner_with_pump.png?v=1727792885",
    product_url: "https://tginatural.com/products/triple-moisture-replenishing-conditioner-13oz",
    inci:
      "Water, Cetearyl Alcohol, Behentrimonium Methosulfate, Glycerin, " +
      "Butyrospermum Parkii (Shea) Butter, Mangifera Indica (Mango) Seed Butter, " +
      "Theobroma Cacao (Cocoa) Seed Butter, Cocos Nucifera (Coconut) Oil, " +
      "Argania Spinosa Kernel Oil, Tocopheryl Acetate, Phenoxyethanol, Fragrance.",
    price_eur: 15.9,
    size_ml: 354,
    good_for_porosity: 4,
    good_for_type: 5,
    ingredients_grade: "A",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Soin profond aux trois beurres végétaux : appliquer après shampoing, peigner, laisser poser 10-15 min puis rincer. Excellente nutrition pour cheveux secs et denses.",
    sb_alternative_slug: "masque-longueur",
  },
  {
    slug: "themanechoice-easy-on-curls",
    brand: "The Mane Choice",
    name: "Easy On The Curls Detangling Hydration Conditioner",
    category: "masque",
    image_url: "https://cdn.shopify.com/s/files/1/0727/7525/files/TMC_TheAlpha_Shampoo_8oz_PDP_1-1_PackShot_Front_Shadow.jpg?v=1737413093",
    product_url: "https://themanechoice.com/products/the-alpha-easy-on-the-curls-detangling-hydration-shampoo",
    inci:
      "Water, Cetearyl Alcohol, Behentrimonium Methosulfate, Glycerin, " +
      "Persea Gratissima (Avocado) Oil, Mangifera Indica (Mango) Seed Butter, " +
      "Olea Europaea (Olive) Fruit Oil, Cocos Nucifera (Coconut) Oil, " +
      "Ricinus Communis (Castor) Seed Oil, Aloe Barbadensis Leaf Juice, " +
      "Panthenol, Phenoxyethanol, Fragrance.",
    price_eur: 16.9,
    size_ml: 237,
    good_for_porosity: 4,
    good_for_type: 5,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Soin démêlant intense : sur cheveux humides après shampoing, peigner section par section avec le produit en place puis rincer. Limite la casse mécanique.",
    sb_alternative_slug: "masque-longueur",
  },
  {
    slug: "lessecretsdeloly-sublime-curl",
    brand: "Les Secrets de Loly",
    name: "Sublime Curl — Crème Coiffante Hydratante",
    category: "creme",
    image_url: "https://cdn.shopify.com/s/files/1/0555/6197/8056/files/ROUTINEBOUCLEEPACKSHOT.webp?v=1748339570",
    product_url: "https://www.lessecretsdeloly.com/products/routine-curly-speciale-cheveux-boucles",
    inci:
      "Aqua (Water), Glycerin, Cetearyl Alcohol, " +
      "Butyrospermum Parkii (Shea) Butter, Behentrimonium Methosulfate, " +
      "Cocos Nucifera (Coconut) Oil, Ricinus Communis (Castor) Seed Oil, " +
      "Persea Gratissima (Avocado) Oil, Aloe Barbadensis Leaf Juice, " +
      "Panthenol, Hibiscus Sabdariffa Flower Extract, Tocopherol, " +
      "Phenoxyethanol, Parfum (Fragrance), Citric Acid.",
    price_eur: 21.9,
    size_ml: 250,
    good_for_porosity: 3,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Crème définissante phare de la marque : appliquer sur cheveux mouillés, mèche par mèche, pour définir les boucles, hydrater et faire briller. ⚠️ INCI à revérifier (reformulations fréquentes).",
    sb_alternative_slug: "chantilly",
  },
  {
    slug: "lessecretsdeloly-masque-fleur-de-coco",
    brand: "Les Secrets de Loly",
    name: "Fleur de Coco — Masque Hydra-Nutritif",
    category: "masque",
    image_url: "https://cdn.shopify.com/s/files/1/0555/6197/8056/files/Hyalu_Fusion_Mask_cheveux_multi-textures_1__11zon.jpg?v=1745586940",
    product_url: "https://www.lessecretsdeloly.com/products/hyalu-fusion-mask-masque-activateur-de-boucles",
    inci:
      "Aqua (Water), Cetearyl Alcohol, Behentrimonium Methosulfate, Glycerin, " +
      "Cocos Nucifera (Coconut) Oil, Butyrospermum Parkii (Shea) Butter, " +
      "Theobroma Cacao Seed Butter, Persea Gratissima (Avocado) Oil, " +
      "Helianthus Annuus Seed Oil, Aloe Barbadensis Leaf Juice, " +
      "Panthenol, Tocopherol, Phenoxyethanol, Parfum (Fragrance).",
    price_eur: 24.9,
    size_ml: 250,
    good_for_porosity: 3,
    good_for_type: 4,
    ingredients_grade: "B",
    flags: { ...cleanFlags, contains_fragrance: true },
    usage_guide:
      "Masque nutritif coco-karité : appliquer sur cheveux essorés après shampoing, laisser poser 15-30 min sous bonnet chauffant puis rincer. 1×/semaine.",
    sb_alternative_slug: "masque-longueur",
  },

];

// ─────────────────────────────────────────────────────────────────────────
// Helpers de lookup
// ─────────────────────────────────────────────────────────────────────────

export function getMarketProductBySlug(slug: string): MarketProduct | undefined {
  return MARKET_PRODUCTS.find((p) => p.slug === slug);
}

// Alias for compat with earlier code
export const getMarketProduct = getMarketProductBySlug;

export function getMarketProductsByBrand(brand: string): MarketProduct[] {
  return MARKET_PRODUCTS.filter(
    (p) => p.brand.toLowerCase() === brand.toLowerCase(),
  );
}

export function getMarketProductsByCategory(
  category: ProductCategory,
): MarketProduct[] {
  return MARKET_PRODUCTS.filter((p) => p.category === category);
}

export function getMarketProductsBySBAlternative(
  sbSlug: SBAlternativeSlug,
): MarketProduct[] {
  return MARKET_PRODUCTS.filter((p) => p.sb_alternative_slug === sbSlug);
}

// ─────────────────────────────────────────────────────────────────────────
// Compatibility + UI helpers (consumed by app screens)
// ─────────────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS_MARKET: Record<ProductCategory, string> = {
  "leave-in": "Leave-in",
  creme: "Crème",
  masque: "Masque",
  huile: "Huile",
  shampoing: "Shampoing",
  "co-wash": "Co-wash",
  gel: "Gel",
  edge: "Edge control",
  spray: "Spray",
};

type FlagKey = keyof ProductFlags;
export const FLAG_LABELS: Record<FlagKey, { label: string; positive: boolean }> = {
  contains_silicones: { label: "Silicones", positive: false },
  contains_sulfates: { label: "Sulfates", positive: false },
  contains_parabens: { label: "Parabens", positive: false },
  contains_drying_alcohols: { label: "Alcool desséchant", positive: false },
  contains_mineral_oil: { label: "Huile minérale", positive: false },
  contains_petrolatum: { label: "Pétrolatum", positive: false },
  contains_fragrance: { label: "Parfum", positive: false },
  contains_protein: { label: "Protéines", positive: false },
  contains_formaldehyde_releasers: {
    label: "Libérateur formaldéhyde",
    positive: false,
  },
};

/** Returns the keys of flags that are `true`. */
export function activeFlags(flags: ProductFlags): FlagKey[] {
  return (Object.keys(flags) as FlagKey[]).filter((k) => flags[k]);
}

export type MatchBadge = "top" | "good" | "ok" | "avoid";

/**
 * Compute a global compatibility score between a market product and the user
 * profile. Returns a 1-5 score and a discrete badge level.
 *
 * Inputs:
 *  - user porosity (low/medium/high) is mapped to the product's
 *    `good_for_porosity` (1-2 / 3 / 4-5) — proximity = score
 *  - user hair_type (3a..4c) is mapped to `good_for_type` similarly
 *  - ingredients_grade A→E = 5→1
 *  - presence of problematic flags pulls the score down
 */
export function computeMatchBadge(
  product: MarketProduct,
  porosity: "low" | "medium" | "high" | null | undefined,
  hairType?: string | null,
): { badge: MatchBadge; score: number } {
  const userPorosityValue =
    porosity === "low" ? 1.5 : porosity === "high" ? 4.5 : 3;

  const typeMap: Record<string, number> = {
    "3a": 1.5,
    "3b": 2.5,
    "3c": 3,
    "4a": 4,
    "4b": 4.5,
    "4c": 5,
  };
  const userTypeValue = hairType && typeMap[hairType] !== undefined
    ? typeMap[hairType]
    : 3;

  const porosityScore = Math.max(
    1,
    5 - Math.abs(product.good_for_porosity - userPorosityValue),
  );
  const typeScore = Math.max(
    1,
    5 - Math.abs(product.good_for_type - userTypeValue),
  );

  const ingScore = { A: 5, B: 4, C: 3, D: 2, E: 1 }[product.ingredients_grade];

  // Hard penalties for low-porosity + silicones / for formaldehyde / drying alcohols
  let penalty = 0;
  if (porosity === "low" && product.flags.contains_silicones) penalty += 0.6;
  if (product.flags.contains_formaldehyde_releasers) penalty += 0.5;
  if (product.flags.contains_drying_alcohols) penalty += 0.3;

  const total = Math.max(
    1,
    porosityScore * 0.4 + typeScore * 0.25 + ingScore * 0.35 - penalty,
  );

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
