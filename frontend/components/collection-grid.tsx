"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "./product-card"

interface VariantImage {
  image_url: string
  position: number
}

interface Variant {
  variant_images?: VariantImage[]
}

interface ProductApi {
  id: string
  title: string
  price: number
  variants?: Variant[]
}

interface ProductCardData {
  id: string
  name: string
  price: number
  image: string
  hoverImage: string
  category: string
}

const PLACEHOLDER_IMAGE = "/placeholder.svg"

const toCardData = (product: ProductApi): ProductCardData => {
  const images = (product.variants || [])
    .flatMap((variant) => (variant.variant_images || []).sort((a, b) => a.position - b.position))
    .map((img) => img.image_url)
    .filter(Boolean)
  return {
    id: product.id,
    name: product.title,
    price: Number(product.price) || 0,
    image: images[0] || PLACEHOLDER_IMAGE,
    hoverImage: images[1] || images[0] || PLACEHOLDER_IMAGE,
    category: "Featured",
  }
}

export function CollectionGrid() {
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = (await response.json()) as ProductApi[]
        if (!response.ok) {
          setProducts([])
          return
        }
        setProducts((data || []).slice(0, 6).map(toCardData))
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="font-serif text-3xl lg:text-5xl mb-4">Curated Selection</h2>
          <p className="text-muted-foreground tracking-wide max-w-md mx-auto">
            Each piece tells a story of meticulous craftsmanship
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground">No products found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {products.map((product, index) => (
              <div key={product.id}>
                <ProductCard {...product} index={index} />
              </div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 lg:mt-24"
        >
          <Link
            href="/shop"
            className="inline-flex items-center text-sm tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:border-transparent transition-colors duration-300"
          >
            View Full Collection
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
