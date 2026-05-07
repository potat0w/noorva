export interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  hoverImage: string
  description: string
  longDescription: string
  materials: string[]
  care: string[]
  sizes: { size: string; available: boolean }[]
  colors: { name: string; hex: string; available: boolean }[]
  details: string[]
  madeIn: string
}

export const products: Product[] = [
  {
    id: "silk-evening-coat",
    name: "Silk Evening Coat",
    price: 2450,
    category: "Outerwear",
    image: "/elegant-black-silk-evening-coat-luxury-fashion.jpg",
    hoverImage: "/elegant-black-silk-evening-coat-back-view-luxury.jpg",
    description: "A masterpiece of understated elegance",
    longDescription:
      "Crafted from the finest mulberry silk, this evening coat represents the pinnacle of Italian tailoring. Each piece is hand-finished by our master artisans in Florence, ensuring unparalleled quality and attention to detail. The fluid silhouette drapes effortlessly, creating a timeless look suitable for the most discerning occasions.",
    materials: ["100% Mulberry Silk", "Silk charmeuse lining", "Mother of pearl buttons"],
    care: ["Dry clean only", "Store on padded hanger", "Avoid direct sunlight"],
    sizes: [
      { size: "XS", available: true },
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: false },
      { size: "XL", available: true },
    ],
    colors: [
      { name: "Noir", hex: "#0A0A0A", available: true },
      { name: "Ivory", hex: "#F5F5DC", available: true },
      { name: "Midnight", hex: "#191970", available: false },
    ],
    details: [
      "Hand-stitched lapels",
      "Interior pocket with silk trim",
      "Custom Maison hardware",
      "Numbered authenticity tag",
    ],
    madeIn: "Florence, Italy",
  },
  {
    id: "cashmere-wrap-dress",
    name: "Cashmere Wrap Dress",
    price: 1890,
    category: "Dresses",
    image: "/cream-cashmere-wrap-dress-elegant-luxury-fashion.jpg",
    hoverImage: "/cream-cashmere-wrap-dress-side-view-luxury.jpg",
    description: "Effortless sophistication in pure cashmere",
    longDescription:
      "This wrap dress is woven from Grade-A Mongolian cashmere, selected for its exceptional softness and durability. The wrap silhouette flatters every figure while the generous proportions ensure comfort without compromising elegance. A wardrobe essential that transitions seamlessly from day to evening.",
    materials: ["100% Grade-A Mongolian Cashmere", "Silk blend lining", "Self-tie belt"],
    care: ["Dry clean recommended", "May be hand washed in cold water", "Lay flat to dry"],
    sizes: [
      { size: "XS", available: true },
      { size: "S", available: false },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true },
    ],
    colors: [
      { name: "Cream", hex: "#FFFDD0", available: true },
      { name: "Camel", hex: "#C19A6B", available: true },
      { name: "Grey Mélange", hex: "#808080", available: true },
    ],
    details: ["Double-faced construction", "Hand-rolled edges", "Adjustable wrap closure", "Signature interior label"],
    madeIn: "Florence, Italy",
  },
  {
    id: "tailored-wool-blazer",
    name: "Tailored Wool Blazer",
    price: 1650,
    category: "Outerwear",
    image: "/navy-wool-tailored-blazer-luxury-menswear-fashion.jpg",
    hoverImage: "/navy-wool-tailored-blazer-open-luxury-fashion.jpg",
    description: "The foundation of modern elegance",
    longDescription:
      "Cut from Super 150s wool sourced from the finest Australian merino sheep, this blazer exemplifies Maison's commitment to exceptional quality. The half-canvas construction allows for a natural drape while maintaining structure. Each blazer requires over 30 hours of handwork to complete.",
    materials: ["100% Super 150s Merino Wool", "Bemberg cupro lining", "Horn buttons"],
    care: ["Dry clean only", "Steam to refresh", "Store with cedar blocks"],
    sizes: [
      { size: "46", available: true },
      { size: "48", available: true },
      { size: "50", available: true },
      { size: "52", available: true },
      { size: "54", available: false },
    ],
    colors: [
      { name: "Navy", hex: "#000080", available: true },
      { name: "Charcoal", hex: "#36454F", available: true },
      { name: "Black", hex: "#0A0A0A", available: true },
    ],
    details: ["Half-canvas construction", "Working cuff buttons", "Pick-stitched lapels", "Interior passport pocket"],
    madeIn: "Florence, Italy",
  },
  {
    id: "merino-turtleneck",
    name: "Merino Turtleneck",
    price: 485,
    category: "Knitwear",
    image: "/charcoal-merino-wool-turtleneck-sweater-luxury-min.jpg",
    hoverImage: "/charcoal-merino-turtleneck-detail-texture-luxury.jpg",
    description: "Essential luxury for every season",
    longDescription:
      "Knitted from extra-fine merino wool in a 12-gauge construction, this turtleneck offers exceptional warmth without bulk. The ribbed neck, cuffs, and hem provide subtle texture while maintaining a clean, minimal aesthetic. An indispensable foundation piece for the considered wardrobe.",
    materials: ["100% Extra-fine Merino Wool", "12-gauge knit construction"],
    care: ["Hand wash cold", "Dry flat", "Do not tumble dry"],
    sizes: [
      { size: "XS", available: true },
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: false },
    ],
    colors: [
      { name: "Charcoal", hex: "#36454F", available: true },
      { name: "Ecru", hex: "#F5F5DC", available: true },
      { name: "Burgundy", hex: "#722F37", available: true },
      { name: "Forest", hex: "#228B22", available: false },
    ],
    details: ["Fully fashioned construction", "Reinforced seams", "Ribbed trim details", "Embroidered interior label"],
    madeIn: "Florence, Italy",
  },
  {
    id: "leather-belt",
    name: "Artisan Leather Belt",
    price: 320,
    category: "Accessories",
    image: "/brown-leather-belt-gold-buckle-luxury-accessory-mi.jpg",
    hoverImage: "/brown-leather-belt-detail-stitching-luxury.jpg",
    description: "Handcrafted from Tuscan leather",
    longDescription:
      "Each belt is cut from a single piece of vegetable-tanned Tuscan leather, selected for its natural grain and character. The solid brass buckle is cast using traditional methods and finished by hand. With proper care, this belt will develop a beautiful patina over years of wear.",
    materials: ["Vegetable-tanned Tuscan leather", "Solid brass buckle", "Hand-stitched edges"],
    care: ["Condition with leather balm", "Store flat or rolled", "Avoid water exposure"],
    sizes: [
      { size: "80", available: true },
      { size: "85", available: true },
      { size: "90", available: true },
      { size: "95", available: true },
      { size: "100", available: true },
    ],
    colors: [
      { name: "Cognac", hex: "#9A463D", available: true },
      { name: "Dark Brown", hex: "#3E2723", available: true },
      { name: "Black", hex: "#0A0A0A", available: true },
    ],
    details: ["3.5cm width", "Single-prong buckle", "Burnished edges", "Embossed Maison logo"],
    madeIn: "Florence, Italy",
  },
  {
    id: "silk-scarf",
    name: "Silk Twill Scarf",
    price: 295,
    category: "Accessories",
    image: "/silk-scarf-abstract-pattern-luxury-accessory-elega.jpg",
    hoverImage: "/silk-scarf-draped-luxury-fashion-accessory.jpg",
    description: "Woven poetry in silk",
    longDescription:
      "Printed using traditional screen-printing techniques, each scarf requires up to 12 separate screens to achieve its depth of color. The hand-rolled edges are a hallmark of true luxury, executed by skilled artisans who have perfected this craft over decades.",
    materials: ["100% Silk twill", "Hand-rolled edges", "Screen-printed design"],
    care: ["Dry clean only", "Store in tissue paper", "Avoid perfume contact"],
    sizes: [
      { size: "70x70cm", available: true },
      { size: "90x90cm", available: true },
    ],
    colors: [
      { name: "Archive Print", hex: "#D4AF37", available: true },
      { name: "Geometric", hex: "#708090", available: true },
      { name: "Botanical", hex: "#228B22", available: true },
    ],
    details: ["12-color screen print", "Hand-rolled hem", "90x90cm dimensions", "Signature Maison motif"],
    madeIn: "Como, Italy",
  },
  {
    id: "linen-trousers",
    name: "Relaxed Linen Trousers",
    price: 580,
    category: "Trousers",
    image: "/beige-linen-trousers-relaxed-fit-luxury-fashion.jpg",
    hoverImage: "/beige-linen-trousers-detail-pocket-luxury.jpg",
    description: "Effortless summer elegance",
    longDescription:
      "Woven from Belgian linen renowned for its exceptional quality, these trousers offer a relaxed silhouette without sacrificing sophistication. The pre-washed fabric ensures minimal shrinkage and a soft hand feel from the first wear. Thoughtful details include interior waistband finishing and French seams throughout.",
    materials: ["100% Belgian Linen", "Cotton pocket lining", "Corozo nut buttons"],
    care: ["Machine wash cold", "Tumble dry low", "Iron while damp for crisp finish"],
    sizes: [
      { size: "XS", available: true },
      { size: "S", available: true },
      { size: "M", available: false },
      { size: "L", available: true },
      { size: "XL", available: true },
    ],
    colors: [
      { name: "Sand", hex: "#C2B280", available: true },
      { name: "White", hex: "#FFFFFF", available: true },
      { name: "Navy", hex: "#000080", available: true },
    ],
    details: ["Relaxed fit", "Elasticated back waist", "French seam construction", "Slash pockets"],
    madeIn: "Florence, Italy",
  },
  {
    id: "structured-handbag",
    name: "Structured Leather Handbag",
    price: 1890,
    category: "Accessories",
    image: "/black-structured-leather-handbag-luxury-minimal-de.jpg",
    hoverImage: "/placeholder.svg?height=800&width=600",
    description: "Architectural precision meets artisanal craft",
    longDescription:
      "This handbag represents the culmination of Maison's leather expertise. Each bag is constructed from a single hide, carefully selected for consistency of grain and texture. The architectural silhouette is achieved through meticulous internal construction, while the exterior remains elegantly minimal.",
    materials: ["Full-grain calfskin leather", "Suede interior lining", "Brass hardware with palladium finish"],
    care: ["Store in dust bag", "Condition bi-annually", "Avoid rain exposure"],
    sizes: [
      { size: "Small", available: true },
      { size: "Medium", available: true },
      { size: "Large", available: false },
    ],
    colors: [
      { name: "Noir", hex: "#0A0A0A", available: true },
      { name: "Burgundy", hex: "#722F37", available: true },
      { name: "Tan", hex: "#D2B48C", available: true },
    ],
    details: ["Single-hide construction", "Interior zip pocket", "Detachable shoulder strap", "Signature Maison clasp"],
    madeIn: "Florence, Italy",
  },
]

export const categories = ["All", "Outerwear", "Dresses", "Knitwear", "Trousers", "Accessories"]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products
  return products.filter((p) => p.category === category)
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
  const current = getProductById(currentId)
  if (!current) return products.slice(0, limit)

  const sameCategory = products.filter((p) => p.id !== currentId && p.category === current.category)
  const others = products.filter((p) => p.id !== currentId && p.category !== current.category)

  return [...sameCategory, ...others].slice(0, limit)
}
