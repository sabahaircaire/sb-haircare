// SB Haircare — Section Apprendre : recettes DIY + articles éducatifs

// LearnImage = number when `require()`'d bundled asset, or { uri: string } for remote
export type LearnImage = number | { uri: string };

export type Ingredient = { icon: string; name: string; qty: string };

export type RecipeStep = {
  title: string;
  text: string;
  timer_seconds?: number;
};

export type Recipe = {
  id: string;
  title: string;
  tag: string;
  duration: string;
  frequency: string;
  hero_image: LearnImage;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tip?: string;
};

export type ArticleSection =
  | { type: "intro"; text: string }
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "step"; number: number; title: string; text: string }
  | { type: "callout"; text: string }
  | { type: "image"; src: LearnImage; alt: string };

export type Article = {
  id: string;
  title: string;
  subtitle: string;
  read_time: string;
  hero_image: LearnImage;
  sections: ArticleSection[];
};

// -----------------------------------------------------------------------------
// Brand photos bundled with the app — assets/learn/saba-img-*.jpg
// -----------------------------------------------------------------------------

const IMG_POWDERS_COCO = require("../../assets/learn/saba-img-powders-coco-bowl.jpg");
const IMG_WET_STRETCHED = require("../../assets/learn/saba-img-wet-hair-stretched.jpg");
const IMG_WASH_DAY = require("../../assets/learn/saba-img-wash-day-shower.jpg");
const IMG_FLAXSEED_JAR = require("../../assets/learn/saba-img-flaxseed-gel-jar.jpg");
const IMG_RINSE_BACK = require("../../assets/learn/saba-img-rinse-water-back.jpg");
const IMG_SHRINKAGE = require("../../assets/learn/saba-img-shrinkage-stretch.jpg");
const IMG_DEFINED_CURLS = require("../../assets/learn/saba-img-defined-curls.jpg");
const IMG_SHED_HAIR = require("../../assets/learn/saba-img-shed-hair-hand.jpg");
const IMG_PASTE_GARDEN = require("../../assets/learn/saba-img-paste-bowl-garden.jpg");
const IMG_VOLUME_MIRROR = require("../../assets/learn/saba-img-volume-mirror.jpg");

// -----------------------------------------------------------------------------
// RECETTES DIY
// -----------------------------------------------------------------------------

export const RECIPES: Recipe[] = [
  {
    id: "herbes-pousse",
    title: "Herbes naturelles pour la pousse",
    tag: "Mélange pousse",
    duration: "45 min",
    frequency: "1x / semaine",
    hero_image: IMG_POWDERS_COCO,
    ingredients: [
      { icon: "🌿", name: "Poudre de Bhringraj", qty: "2 c. à soupe" },
      { icon: "🍃", name: "Poudre de Brahmi", qty: "1 c. à soupe" },
      { icon: "🌱", name: "Poudre de Fenugrec", qty: "1 c. à soupe" },
      { icon: "💧", name: "Eau tiède", qty: "Quantité suffisante" },
      { icon: "🫒", name: "Huile végétale (jojoba ou avocat)", qty: "1 c. à soupe" },
    ],
    steps: [
      {
        title: "Mélange les poudres",
        text: "Dans un bol non métallique, mélange les trois poudres à sec. Ajoute l'eau tiède petit à petit jusqu'à obtenir une pâte lisse — texture yaourt grec.",
      },
      {
        title: "Ajoute l'huile",
        text: "Incorpore l'huile végétale à la pâte. Ça évite l'effet desséchant et facilite le rinçage.",
      },
      {
        title: "Applique sur le cuir chevelu",
        text: "Sur cheveux propres et humides, sépare en 4-6 sections. Applique la pâte directement sur le cuir chevelu en massant. C'est un masque POUSSE — cuir chevelu, pas longueurs.",
      },
      {
        title: "Laisse poser 30 à 45 minutes",
        text: "Couvre avec un bonnet plastique. La chaleur de ta tête active les principes actifs. Ne dépasse pas 45 min — au-delà, la pâte sèche.",
        timer_seconds: 2700,
      },
      {
        title: "Rince abondamment",
        text: "Rince à l'eau tiède en massant. Fais un après-shampoing pour refermer les cuticules. Un deuxième rinçage si tu sens encore du grain.",
      },
    ],
    tip: "Tu peux remplacer les poudres par le Masque Ayurvédique SB Haircare — c'est exactement ce blend, déjà dosé.",
  },
  {
    id: "huile-chaude-diy",
    title: "Huile chaude DIY",
    tag: "Soin à l'huile",
    duration: "30 min + pose",
    frequency: "1x / semaine (pré-poo)",
    hero_image: IMG_WET_STRETCHED,
    ingredients: [
      { icon: "🫙", name: "Huile de ricin", qty: "2 c. à soupe" },
      { icon: "🫒", name: "Huile de jojoba ou pépins de raisin", qty: "2 c. à soupe" },
      { icon: "🥑", name: "Huile d'avocat", qty: "1 c. à soupe" },
      { icon: "🌿", name: "Huile essentielle de romarin (optionnel)", qty: "3-5 gouttes" },
    ],
    steps: [
      {
        title: "Chauffe le mélange",
        text: "Verse les huiles dans un récipient résistant à la chaleur. Bain-marie ou micro-ondes 15 sec. Tiède, JAMAIS brûlante — teste sur ton poignet.",
      },
      {
        title: "Applique sur cheveux secs",
        text: "Sur cheveux SECS (pas mouillés), sépare en 4-6 sections. Commence par le cuir chevelu en massage, puis descends sur les longueurs en lissant.",
      },
      {
        title: "Masse le cuir chevelu",
        text: "5 minutes de massage du bout des doigts (pas les ongles). Mouvements circulaires. Ça active la microcirculation et nourrit les follicules.",
        timer_seconds: 300,
      },
      {
        title: "Laisse poser minimum 30 minutes",
        text: "Couvre avec un bonnet en satin. L'idéal : pose toute la nuit. Le lendemain, shampoing normal.",
        timer_seconds: 1800,
      },
    ],
    tip: "L'Huile Ayurvédique Raiponce contient déjà ces huiles + actifs ayurvédiques macérés. Un seul flacon au lieu de 4.",
  },
  {
    id: "masque-argile",
    title: "Masque à l'argile",
    tag: "Masque clarifiant",
    duration: "20 min",
    frequency: "1x / mois max",
    hero_image: IMG_WASH_DAY,
    ingredients: [
      { icon: "⚪", name: "Argile blanche (kaolin) ou verte", qty: "3 c. à soupe" },
      { icon: "💧", name: "Eau tiède ou hydrolat de romarin", qty: "Quantité suffisante" },
      { icon: "🫒", name: "Huile végétale (jojoba ou avocat)", qty: "1 c. à soupe" },
      { icon: "🍎", name: "Vinaigre de cidre (optionnel)", qty: "1 c. à café" },
    ],
    steps: [
      {
        title: "Prépare la pâte",
        text: "Dans un bol NON métallique (l'argile réagit avec le métal), mélange argile + eau tiède + huile. Consistance crémeuse.",
      },
      {
        title: "Applique sur le cuir chevelu",
        text: "C'est un masque CLARIFIANT — cuir chevelu, pas longueurs. Sépare en sections et applique raie par raie.",
      },
      {
        title: "Laisse poser 15-20 min MAX",
        text: "Ne laisse JAMAIS l'argile sécher. Verte : 15 min. Blanche (kaolin) : 20 min max.",
        timer_seconds: 1200,
      },
      {
        title: "Rince + hydrate",
        text: "Rince à l'eau tiède. Enchaîne IMMÉDIATEMENT avec un après-shampoing riche. Optionnel : rinçage au vinaigre de cidre dilué.",
      },
    ],
    tip: "Utilise ce masque AVANT ton masque aux poudres ayurvédiques. Un cuir chevelu propre absorbe mieux les actifs.",
  },
  {
    id: "gel-lin-aloe",
    title: "Graines de lin + aloe",
    tag: "Glisse + hydratation",
    duration: "25 min",
    frequency: "Chaque wash day",
    hero_image: IMG_FLAXSEED_JAR,
    ingredients: [
      { icon: "🌾", name: "Graines de lin", qty: "¼ tasse (~40g)" },
      { icon: "💧", name: "Eau", qty: "2 tasses (500 ml)" },
      { icon: "🌵", name: "Gel d'aloe vera pur", qty: "2 c. à soupe" },
      { icon: "🫒", name: "Huile végétale légère", qty: "1 c. à café" },
    ],
    steps: [
      {
        title: "Fais bouillir les graines de lin",
        text: "Casserole + 500 ml d'eau. Ébullition puis feu doux. Remue 8-10 min — le liquide devient gélatineux.",
        timer_seconds: 600,
      },
      {
        title: "Filtre le gel",
        text: "Verse à travers un bas en nylon ou passoire fine. Presse pour extraire tout le gel. Jette les graines.",
      },
      {
        title: "Ajoute l'aloe et l'huile",
        text: "Pendant que c'est encore tiède, ajoute l'aloe et l'huile. Mélange bien. L'huile évite l'effet « craquant » au séchage.",
      },
      {
        title: "Utilise comme gel coiffant",
        text: "Sur cheveux mouillés après ton leave-in. Définition + glisse + hold léger. Conservation : 1-2 semaines au frigo.",
      },
    ],
    tip: "Méthode LOC/LCO : ce gel compte comme le « L » (liquid). Scelle avec l'Huile Raiponce (O) et/ou la Chantilly (C).",
  },
  {
    id: "rincage-hibiscus",
    title: "Rinçage hibiscus",
    tag: "Brillance",
    duration: "20 min + refroidissement",
    frequency: "2x / mois",
    hero_image: IMG_RINSE_BACK,
    ingredients: [
      { icon: "🌺", name: "Fleurs d'hibiscus séchées (ou 2 sachets de tisane)", qty: "2 c. à soupe" },
      { icon: "💧", name: "Eau bouillante", qty: "500 ml" },
      { icon: "🍎", name: "Vinaigre de cidre (optionnel)", qty: "1 c. à soupe" },
    ],
    steps: [
      {
        title: "Prépare l'infusion",
        text: "Verse l'eau bouillante sur les fleurs (ou sachets). Laisse infuser 15-20 min. L'eau devient rouge profond — anthocyanines.",
        timer_seconds: 1200,
      },
      {
        title: "Filtre et laisse refroidir",
        text: "Filtre puis refroidis à température ambiante. Ajoute le vinaigre de cidre si tu veux — il booste la brillance.",
      },
      {
        title: "Utilise comme dernier rinçage",
        text: "Après shampoing et après-shampoing, verse l'infusion sur tes cheveux. NE RINCE PAS. Essore avec un t-shirt en coton.",
      },
    ],
    tip: "L'hibiscus est riche en acides aminés et vitamine C. C'est l'un des actifs macérés dans l'Huile Raiponce.",
  },
];

// -----------------------------------------------------------------------------
// ARTICLES
// -----------------------------------------------------------------------------

export const ARTICLES: Article[] = [
  {
    id: "bain-huile",
    title: "Comment faire son bain d'huile",
    subtitle: "Le geste fondateur de ta routine capillaire",
    read_time: "4 min",
    hero_image: IMG_SHRINKAGE,
    sections: [
      {
        type: "intro",
        text: "Le bain d'huile, c'est le soin le plus ancien et le plus efficace pour les cheveux afro-texturés. Pas besoin de 15 produits. Une bonne huile, la bonne méthode, et de la régularité.",
      },
      { type: "heading", text: "Pourquoi tes cheveux en ont besoin" },
      {
        type: "paragraph",
        text: "Le cheveu afro-texturé a une structure en spirale. Le sébum produit par ton cuir chevelu a du mal à descendre le long de la fibre. Résultat : tes longueurs sont naturellement sèches. Le bain d'huile vient compenser ce manque.",
      },
      {
        type: "paragraph",
        text: "Ce n'est pas un soin de surface. L'huile pénètre la cuticule et va nourrir le cortex. C'est pour ça qu'on le fait AVANT le shampoing — pas après.",
      },
      {
        type: "image",
        src: IMG_WET_STRETCHED,
        alt: "Huiles végétales naturelles pour bain d'huile cheveux afro",
      },
      { type: "heading", text: "La méthode en 3 étapes" },
      {
        type: "step",
        number: 1,
        title: "Sépare tes cheveux en 4 à 6 sections",
        text: "Sur cheveux SECS. Utilise des pinces. Plus tes cheveux sont épais, plus tu fais de sections.",
      },
      {
        type: "step",
        number: 2,
        title: "Applique l'huile mèche par mèche",
        text: "Commence par le cuir chevelu : massage 2-3 min par section. Puis descends sur les longueurs. N'oublie pas les pointes — la partie la plus fragile.",
      },
      {
        type: "step",
        number: 3,
        title: "Laisse poser minimum 30 minutes",
        text: "L'idéal : toute la nuit avec un bonnet en satin. Le lendemain, shampoing normal. Deux shampoings si nécessaire pour éliminer l'excès.",
      },
      {
        type: "callout",
        text: "L'Huile Raiponce est formulée pour pénétrer rapidement sans alourdir. Ses actifs ayurvédiques (bhringraj, brahmi, romarin) agissent sur le cuir chevelu pendant la pose.",
      },
      { type: "heading", text: "Les erreurs à éviter" },
      {
        type: "paragraph",
        text: "Mettre trop d'huile. Ton cheveu n'est pas une friteuse. Si ça dégouline, c'est trop. L'excès étouffe au lieu de nourrir.",
      },
      {
        type: "paragraph",
        text: "Appliquer sur cheveux mouillés. L'eau et l'huile ne se mélangent pas. Sur cheveux humides, l'huile reste en surface.",
      },
      {
        type: "paragraph",
        text: "Sauter le shampoing après. Si tu ne laves pas, tu accumules des résidus qui bouchent tes follicules. Et des follicules bouchés = moins de pousse.",
      },
      { type: "heading", text: "À quelle fréquence ?" },
      {
        type: "paragraph",
        text: "1 fois par semaine avant ton wash day, c'est le rythme idéal. La constance compte plus que l'intensité — un bain d'huile chaque semaine pendant 3 mois fera plus qu'un bain de 24h une fois tous les 3 mois.",
      },
    ],
  },
  {
    id: "retention-longueur",
    title: "La rétention de longueur",
    subtitle: "Tes cheveux poussent. Le vrai problème, c'est la casse.",
    read_time: "5 min",
    hero_image: IMG_DEFINED_CURLS,
    sections: [
      {
        type: "intro",
        text: "En moyenne, le cheveu pousse de 1 à 1,5 cm par mois. Si tu ne retiens pas cette longueur, c'est que tu casses autant que tu pousses. La rétention, c'est l'art de garder ce que ton corps produit déjà.",
      },
      { type: "heading", text: "Pourquoi tes cheveux cassent" },
      {
        type: "paragraph",
        text: "Le cheveu afro-texturé casse principalement aux points de courbure. Chaque boucle crée un point de fragilité où la cuticule est plus fine. C'est mécanique, pas une fatalité.",
      },
      {
        type: "paragraph",
        text: "Ajoute à ça : manipulation excessive, coiffures trop serrées, manque d'hydratation, friction nocturne sur coton. Combinés, ils empêchent toute rétention.",
      },
      {
        type: "image",
        src: IMG_SHED_HAIR,
        alt: "Cheveux tombés dans la main",
      },
      { type: "heading", text: "Les 5 piliers de la rétention" },
      {
        type: "step",
        number: 1,
        title: "Hydratation régulière",
        text: "L'eau est le seul véritable hydratant. Les huiles servent à RETENIR l'eau, pas à hydrater. Hydrate d'abord, scelle ensuite.",
      },
      {
        type: "step",
        number: 2,
        title: "La méthode LOC / LCO",
        text: "Liquid → Oil → Cream. Certaines préfèrent LCO (crème avant huile). Teste les deux sur 3-4 jours et garde celle qui te donne la meilleure tenue.",
      },
      {
        type: "step",
        number: 3,
        title: "Manipulation minimale",
        text: "Chaque fois que tu touches tes cheveux, tu crées de la friction. Coiffe une fois, protège, et laisse tranquille.",
      },
      {
        type: "step",
        number: 4,
        title: "Protection nocturne",
        text: "Bonnet ou taie d'oreiller en satin/soie. Le coton absorbe l'hydratation et crée de la friction. Chaque nuit sans satin, c'est de la longueur perdue.",
      },
      {
        type: "step",
        number: 5,
        title: "Couper les pointes abîmées",
        text: "Des pointes fourchues remontent le long de la fibre. Un mini-trim de 0,5 cm tous les 3-4 mois te fera GAGNER de la longueur.",
      },
      {
        type: "callout",
        text: "L'Huile Raiponce comme scellant LOC/LCO : après ton leave-in, 2-3 gouttes sur les longueurs et pointes. La Chantilly si tu as besoin d'un scellant plus riche (4A-4C, haute porosité).",
      },
      { type: "heading", text: "Le test élasticité" },
      {
        type: "paragraph",
        text: "Prends un cheveu tombé naturellement. Tire doucement. S'il s'étire et revient : hydratation OK. S'il casse net : manque de protéines. S'il s'étire sans revenir : trop de protéines, manque d'hydratation.",
      },
    ],
  },
  {
    id: "poudres-ayurvediques",
    title: "Les poudres ayurvédiques",
    subtitle: "Ce que la science dit sur ces plantes ancestrales",
    read_time: "6 min",
    hero_image: IMG_POWDERS_COCO,
    sections: [
      {
        type: "intro",
        text: "Les poudres ayurvédiques ne sont pas un effet de mode TikTok. Plus de 3000 ans d'usage en médecine traditionnelle indienne, et certaines validées par des études scientifiques modernes.",
      },
      { type: "heading", text: "Les deux familles de poudres" },
      {
        type: "paragraph",
        text: "Toutes les poudres ne font pas la même chose. Les confondre, c'est perdre du temps et des résultats.",
      },
      {
        type: "image",
        src: IMG_PASTE_GARDEN,
        alt: "Pâte ayurvédique dans bol blanc avec fleurs",
      },
      {
        type: "step",
        number: 1,
        title: "Poudres de POUSSE (cuir chevelu)",
        text: "Bhringraj, Brahmi, Fenugrec, Romarin. Elles agissent sur la microcirculation du cuir chevelu et stimulent la phase anagène. Le bhringraj (étude PMID 17524127) montre une densité folliculaire supérieure au minoxidil 2%.",
      },
      {
        type: "step",
        number: 2,
        title: "Poudres de LONGUEUR (fibre)",
        text: "Guimauve, Lalo (baobab), Moringa. Elles apportent glisse, gainage, réduction de la friction. Elles ne stimulent pas la pousse — elles protègent ce qui a déjà poussé.",
      },
      {
        type: "callout",
        text: "Erreur courante : mélanger toutes les poudres ensemble. Non. Un masque pousse va sur le cuir chevelu. Un masque longueur va sur les longueurs. Deux zones, deux masques.",
      },
      { type: "heading", text: "Comment préparer un masque" },
      {
        type: "paragraph",
        text: "Mélange ta poudre avec de l'eau tiède jusqu'à obtenir une pâte « yaourt ». Ajoute une c. à soupe d'huile végétale pour éviter l'effet desséchant. Pose 20-45 min max. Rince abondamment, après-shampoing pour refermer les cuticules.",
      },
      { type: "heading", text: "Les poudres SB Haircare" },
      {
        type: "paragraph",
        text: "L'Huile Ayurvédique Raiponce contient bhringraj, brahmi, fenugrec, hibiscus, romarin macérés dans 4 huiles végétales. La macération extrait les principes actifs directement dans l'huile.",
      },
      {
        type: "paragraph",
        text: "Le Masque Ayurvédique SB Haircare est un blend de poudres pures (Bhringraj, Brahmi, Moringa, Lalo, Guimauve) sans ajout chimique, sans conservateur.",
      },
      { type: "heading", text: "Par où commencer" },
      {
        type: "paragraph",
        text: "Débutante : Huile Raiponce en bain d'huile pré-poo, 1x/semaine. Tu poses, tu dors, tu laves. Pas de pâte à préparer.",
      },
      {
        type: "paragraph",
        text: "À l'aise avec le DIY : ajoute le Masque Ayurvédique 1-2x/mois. Alterne et observe sur 3 mois. Les résultats ne sont pas immédiats — les poudres travaillent sur le cycle capillaire.",
      },
    ],
  },
  {
    id: "pousse-mythes-realites",
    title: "La pousse : mythes et réalités",
    subtitle: "Ce qui marche vraiment vs ce qu'on te vend sur TikTok",
    read_time: "5 min",
    hero_image: IMG_VOLUME_MIRROR,
    sections: [
      {
        type: "intro",
        text: "« Ce produit fait pousser de 5 cm en 1 mois. » Non. Aucun produit ne peut accélérer la pousse au-delà de la capacité biologique de ton follicule.",
      },
      { type: "heading", text: "Ce qu'il faut savoir sur la pousse" },
      {
        type: "paragraph",
        text: "Le cheveu pousse de 1 à 1,5 cm par mois — génétiquement programmé. Ce chiffre ne change pas. Ce qui PEUT changer : la santé du follicule et la durée de la phase anagène.",
      },
      {
        type: "paragraph",
        text: "Un follicule en bonne santé produit un cheveu plus épais, plus résistant, et maintient sa phase de croissance plus longtemps. C'est là que les soins interviennent — pour optimiser ce que ton corps fait déjà.",
      },
      { type: "heading", text: "Mythe : « L'huile de ricin fait pousser »" },
      {
        type: "paragraph",
        text: "L'acide ricinoléique améliore la circulation au cuir chevelu — excellent support pour le massage. Mais elle ne « fait » pas pousser. Aucune étude clinique ne le prouve. Ce qui marche : le MASSAGE, avec ou sans huile de ricin.",
      },
      { type: "heading", text: "Mythe : « Couper les pointes fait pousser »" },
      {
        type: "paragraph",
        text: "Non. Tes pointes sont à 30 cm du cuir chevelu — les couper n'a aucun effet sur le follicule. Ce qui est vrai : couper les pointes abîmées empêche la casse de remonter. Tu ne pousses pas plus vite, mais tu RETIENS plus.",
      },
      { type: "heading", text: "Mythe : « Il existe des produits miracles »" },
      {
        type: "paragraph",
        text: "Si un produit promet 3 cm en 2 semaines, c'est faux. Point. Les seules substances avec un effet mesurable dans des études : le minoxidil (médicament), le bhringraj (PMID 17524127), le romarin (Panahi 2015).",
      },
      {
        type: "callout",
        text: "SB Haircare ne te vend pas de miracles. On utilise des ingrédients étudiés (bhringraj, romarin, acide ricinoléique) dans des formules pensées pour optimiser la santé du cuir chevelu. Les résultats demandent de la constance — minimum 3 mois.",
      },
      { type: "heading", text: "Ce qui marche vraiment" },
      {
        type: "step",
        number: 1,
        title: "Le massage crânien régulier",
        text: "5 minutes de massage du bout des doigts, 3-5x/semaine. Avec ou sans huile. Ça stimule la microcirculation. Gratuit et prouvé.",
      },
      {
        type: "step",
        number: 2,
        title: "Protéger ce qui pousse",
        text: "Satin la nuit, manipulation minimale, coiffures protectrices non-tendues. Si tu gagnes 1,5 cm mais casses 1,3 — tu ne retiens que 2 mm.",
      },
      {
        type: "step",
        number: 3,
        title: "Des actifs soutenant le follicule",
        text: "Bhringraj et romarin ont des données cliniques. L'huile de ricin soutient le massage. La nutrition (protéines, fer, zinc, biotine) fournit les matériaux. Pas de raccourci unique.",
      },
      { type: "heading", text: "La vraie timeline" },
      {
        type: "paragraph",
        text: "Mois 1-2 : tu ne vois rien. Normal — les changements se passent au niveau du follicule. Mois 3-4 : moins de casse, moins de cheveux sur le peigne. Mois 5-6 : la longueur retenue devient visible. Mois 9-12 : résultats clairs et mesurables.",
      },
      {
        type: "paragraph",
        text: "La patience n'est pas un slogan. C'est la biologie du cheveu.",
      },
    ],
  },
];

export function getRecipe(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}

export function getArticle(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}
