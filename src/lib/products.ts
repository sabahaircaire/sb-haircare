// Catalogue SB Haircare — sbhaircare.fr
// Synchronisé manuellement avec la boutique. À automatiser plus tard si besoin.

export type Product = {
  slug: string;
  name: string;
  price_eur: number;
  short: string;
  ingredients: string[];
  image: string;
  url: string;
  best_for: ("low" | "medium" | "high")[];
  tag?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "masque-ayurvedique",
    name: "Masque Ayurvédique",
    price_eur: 15.99,
    short:
      "Masque en poudre 100% végétal — stimule la pousse, fortifie la fibre, révèle des cheveux plus denses.",
    ingredients: ["Bhringaraj", "Brahmi", "Fenugrec", "Hibiscus", "Guimauve"],
    image: "https://www.sbhaircare.fr/cdn/shop/files/IMG-8099.png?width=600",
    url: "https://sbhaircare.fr/products/masque-ayurvedique-copie-1",
    best_for: ["low", "medium", "high"],
    tag: "Bestseller",
  },
  {
    slug: "masque-longueur",
    name: "Masque Ayurvédique Longueur",
    price_eur: 17.99,
    short:
      "Reconstruit la kératine en profondeur, réduit la casse au démêlage et restaure l'élasticité.",
    ingredients: ["Moringa", "Lalo", "Bhringaraj", "Brahmi", "Guimauve"],
    image:
      "https://www.sbhaircare.fr/cdn/shop/files/Reproduis-exactement_la_mme_im_Nano_Banana_Pro_95732.png?width=600",
    url: "https://sbhaircare.fr/products/masque-ayurvedique-longueur",
    best_for: ["medium", "high"],
    tag: "Rétention",
  },
  {
    slug: "huile-raiponce",
    name: "Huile Ayurvédique Raiponce",
    price_eur: 19.99,
    short:
      "3-en-1 — stimule la pousse, réduit la casse, ravive la brillance en 30 jours.",
    ingredients: ["Ricin", "Coco", "Romarin", "Bhringaraj", "Amla", "Fenugrec"],
    image:
      "https://www.sbhaircare.fr/cdn/shop/files/photo_produit_huile_-_3.png?width=600",
    url: "https://sbhaircare.fr/products/huile-ayurvedique-raiponce",
    best_for: ["medium", "high"],
    tag: "Pousse",
  },
  {
    slug: "chantilly",
    name: "Chantilly Ayurvédique",
    price_eur: 24.99,
    short:
      "Beurre fouetté au karité et mangue + huiles ayurvédiques. Nourrit, scelle l'hydratation, booste la pousse.",
    ingredients: [
      "Karité",
      "Mangue",
      "Hibiscus",
      "Bhringaraj",
      "Brahmi",
      "Fenugrec",
    ],
    image:
      "https://www.sbhaircare.fr/cdn/shop/files/photo_produit_huile_-_8.png?width=600",
    url: "https://sbhaircare.fr/products/chantilly-ayurvedique-copie",
    best_for: ["low", "medium", "high"],
    tag: "Sceau",
  },
];

export function productsForPorosity(
  porosity: "low" | "medium" | "high",
): Product[] {
  // Always lead with the bestseller, then porosity-relevant ones.
  return PRODUCTS.filter((p) => p.best_for.includes(porosity));
}
