"use client"

import { useState } from "react"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { ArrowRight } from "lucide-react"

interface VariantImage {
  image_url: string
  position: number
}

interface Variant {
  id: string
  color: string | null
  price: number
  variant_images?: VariantImage[]
}

interface ProductApi {
  id: string
  title: string
  description: string | null
  price: number
  variants?: Variant[]
}

interface ProductCard {
  id: string
  name: string
  price: number
  image: string
  hoverImage: string
}

const PLACEHOLDER_IMAGE = "/placeholder.svg"

const toProductCard = (product: ProductApi): ProductCard => {
  const images = (product.variants || [])
    .flatMap((variant) => (variant.variant_images || []).sort((a, b) => a.position - b.position))
    .map((image) => image.image_url)
    .filter(Boolean)
  return {
    id: product.id,
    name: product.title,
    price: Number(product.price) || 0,
    image: images[0] || PLACEHOLDER_IMAGE,
    hoverImage: images[1] || images[0] || PLACEHOLDER_IMAGE,
  }
}

export default function ShopPage() {
  const [products, setProducts] = useState<ProductCard[]>([])
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
        setProducts((data || []).map(toProductCard))
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Banner - already using priority, added sizes */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/shop-hero-luxury-fashion-collection.jpg"
            alt="Shop collection"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>

        <motion.div
          className="relative z-10 text-center text-background px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-serif text-5xl md:text-7xl mb-6">The Collection</h1>
          <p className="text-lg md:text-xl text-background/80 max-w-xl mx-auto">
            Timeless pieces crafted with intention. Each item represents our commitment to exceptional quality.
          </p>
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground">No products found</div>
          ) : (
            <AnimatePresence mode="wait">
            <motion.div
              key="all-products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link href={`/product/${product.id}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        loading="lazy"
                        className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
                      />
                      <Image
                        src={product.hoverImage || "/placeholder.svg"}
                        alt={`${product.name} alternate view`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        loading="lazy"
                        className="object-cover absolute inset-0 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg group-hover:underline underline-offset-4 transition-all">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">Tk {product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Heritage CTA */}
      <section className="border-t border-muted py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Crafted with Purpose</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Every piece in our collection carries forward a legacy of Italian craftsmanship spanning over 175 years.
          </p>
          <Link
            href="/heritage"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase border-b border-foreground pb-1 hover:gap-4 transition-all duration-300"
          >
            Discover Our Heritage
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PremiumFooter />
    </main>
  )
}
