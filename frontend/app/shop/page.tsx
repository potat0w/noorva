"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { ArrowRight } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

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

type SortOption = "featured" | "name-asc" | "name-desc" | "price-low" | "price-high"

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
  const [addingProductId, setAddingProductId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      setIsAdmin(false)
      return
    }
    try {
      const parsed = JSON.parse(stored)
      setIsAdmin(parsed?.role === "admin")
    } catch {
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`)
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

  const filteredSortedProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const filtered = normalizedSearch
      ? products.filter((product) => product.name.toLowerCase().includes(normalizedSearch))
      : products

    if (sortBy === "featured") {
      return filtered
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name)
      if (sortBy === "name-desc") return b.name.localeCompare(a.name)
      if (sortBy === "price-low") return a.price - b.price
      return b.price - a.price
    })
  }, [products, searchTerm, sortBy])

  const handleAddToCart = async (product: ProductCard) => {
    if (isAdmin) {
      return
    }
    if (addingProductId === product.id) return
    const stored = localStorage.getItem("user")
    if (!stored) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add products to your cart.",
      })
      window.location.href = "/signin"
      return
    }
    try {
      const parsed = JSON.parse(stored)
      if (!parsed?.id) {
        window.location.href = "/signin"
        return
      }
      setAddingProductId(product.id)
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parsed.id,
          product_id: product.id,
          quantity: 1,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to add to cart")
      }
      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart.`,
      })
      window.dispatchEvent(new Event("cart-updated"))
      window.dispatchEvent(new Event("cart-open"))
    } catch (error) {
      toast({
        title: "Add to cart failed",
        description: error instanceof Error ? error.message : "Failed to add to cart",
      })
    } finally {
      setAddingProductId(null)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Banner - already using priority, added sizes */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/allp.png"
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
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-md">
              <Input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products"
                className="h-11 rounded-none border-muted-foreground/20"
              />
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="sort-products" className="text-sm text-muted-foreground">
                Sort by
              </label>
              <select
                id="sort-products"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="h-11 min-w-[180px] border border-input bg-background px-3 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={`product-skeleton-${index}`}>
                  <Skeleton className="aspect-[3/4] w-full mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-4/5" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="mt-4 h-10 w-full rounded-none" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground">No products found</div>
          ) : filteredSortedProducts.length === 0 ? (
            <div className="text-center text-muted-foreground">No products match your search</div>
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
              {filteredSortedProducts.map((product, index) => (
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
                  {!isAdmin ? (
                    <Button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={addingProductId === product.id}
                      className="mt-4 w-full rounded-none uppercase tracking-[0.15em] text-xs"
                    >
                      {addingProductId === product.id ? "Adding..." : "Add to cart"}
                    </Button>
                  ) : null}
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
