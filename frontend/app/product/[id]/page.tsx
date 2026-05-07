"use client"

import { use } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { ProductGallery } from "@/components/product-gallery"
import { SizeSelector } from "@/components/size-selector"
import { ColorSelector } from "@/components/color-selector"
import { ProductDetailsAccordion } from "@/components/product-details-accordion"
import { ChevronRight, Star } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface VariantImage {
  image_url: string
  position: number
}

interface Variant {
  id: string
  name: string
  color: string | null
  stock: number
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

interface ReviewApi {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string | null
  created_at: string
  users?: {
    id: string
    name: string
  } | null
}

const PLACEHOLDER_IMAGE = "/placeholder.svg"
const COLOR_HEX_MAP: Record<string, string> = {
  black: "#111827",
  navy: "#1E3A8A",
  red: "#DC2626",
  "lime green": "#84CC16",
  avocado: "#A3BE4C",
  peach: "#F9A8D4",
  watermelon: "#FB7185",
  orange: "#F59E0B",
  "royal mint": "#5EEAD4",
  "midnight purple": "#6366F1",
  "barbie pink": "#EC4899",
  blue: "#3B82F6",
  yellow: "#FACC15",
  green: "#22C55E",
  "bottle green": "#14532D",
  maroon: "#7F1D1D",
  coffee: "#6F4E37",
  navyblue: "#1E3A8A",
  "navy blue": "#1E3A8A",
  pink: "#EC4899",
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<ProductApi | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [cartMessage, setCartMessage] = useState("")
  const [isAddingToBag, setIsAddingToBag] = useState(false)
  const [reviews, setReviews] = useState<ReviewApi[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [deletingReview, setDeletingReview] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const getVariantSize = (variant: Variant) => {
    const value = (variant.name || "").trim()
    if (!value) return "Standard"
    const patterns = [
      "XXL/3XL",
      "3XL",
      "XXXL",
      "XXL",
      "XL",
      "L",
      "M",
      "S",
      "FREE SIZE",
      "STANDARD",
    ]
    const upper = value.toUpperCase()
    for (const pattern of patterns) {
      if (upper.endsWith(pattern)) {
        return pattern === "FREE SIZE" ? "Free Size" : pattern === "STANDARD" ? "Standard" : pattern
      }
    }
    const parts = value.split(/\s+/)
    return parts[parts.length - 1] || "Standard"
  }

  const normalize = (value: string | null | undefined) => (value || "").trim().toLowerCase()

  const loadReviews = async () => {
    setReviewsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/product/${id}`)
      const data = (await response.json()) as ReviewApi[]
      if (!response.ok) {
        setReviews([])
        return
      }
      setReviews(Array.isArray(data) ? data : [])
    } catch {
      setReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`)
        if (response.status === 404) {
          setProduct(null)
          setLoading(false)
          return
        }
        const data = (await response.json()) as ProductApi
        if (!response.ok) {
          setProduct(null)
          setLoading(false)
          return
        }
        setProduct(data)
        const firstAvailableColor =
          (data.variants || []).find((variant) => (variant.stock || 0) > 0 && Boolean(variant.color))?.color ||
          (data.variants || []).find((variant) => Boolean(variant.color))?.color ||
          null
        setSelectedColor(firstAvailableColor)
        const sizeSource = firstAvailableColor
          ? (data.variants || []).filter((variant) => normalize(variant.color) === normalize(firstAvailableColor))
          : data.variants || []
        const firstAvailableVariant = sizeSource.find((variant) => (variant.stock || 0) > 0) || sizeSource[0] || null
        setSelectedSize(firstAvailableVariant ? getVariantSize(firstAvailableVariant) : null)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      setCurrentUserId(null)
      return
    }
    try {
      const parsed = JSON.parse(stored)
      setCurrentUserId(parsed?.id || null)
    } catch {
      setCurrentUserId(null)
    }
  }, [])

  useEffect(() => {
    loadReviews()
  }, [id])

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length
    : 0
  const existingReview = reviews.find((review) => review.user_id === currentUserId) || null

  useEffect(() => {
    if (!existingReview) {
      setReviewRating(0)
      setReviewComment("")
      return
    }
    setReviewRating(Number(existingReview.rating) || 0)
    setReviewComment(existingReview.comment || "")
  }, [existingReview])

  useEffect(() => {
    if (!product) return
    const variants = product.variants || []
    const scoped =
      selectedColor && variants.some((variant) => normalize(variant.color) === normalize(selectedColor))
        ? variants.filter((variant) => normalize(variant.color) === normalize(selectedColor))
        : variants
    const uniqueSizes = Array.from(new Set(scoped.map((variant) => getVariantSize(variant))))
    if (!uniqueSizes.length) {
      setSelectedSize(null)
      return
    }
    if (selectedSize && uniqueSizes.includes(selectedSize)) {
      return
    }
    const firstAvailableVariant = scoped.find((variant) => (variant.stock || 0) > 0)
    const fallbackSize = firstAvailableVariant ? getVariantSize(firstAvailableVariant) : uniqueSizes[0]
    setSelectedSize(fallbackSize)
  }, [product, selectedColor, selectedSize])

  if (!loading && !product) {
    notFound()
  }

  if (loading || !product) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 text-center text-muted-foreground">Loading product...</div>
        <PremiumFooter />
      </main>
    )
  }

  const allVariants = product.variants || []
  const scopedVariants =
    selectedColor && allVariants.some((variant) => normalize(variant.color) === normalize(selectedColor))
      ? allVariants.filter((variant) => normalize(variant.color) === normalize(selectedColor))
      : allVariants
  const selectedVariant =
    scopedVariants.find((variant) => getVariantSize(variant) === selectedSize) ||
    scopedVariants.find((variant) => (variant.stock || 0) > 0) ||
    scopedVariants[0] ||
    null
  const variantsForGallery = selectedVariant ? [selectedVariant] : product.variants || []
  const variantImages = variantsForGallery
    .flatMap((variant) => (variant.variant_images || []).sort((a, b) => a.position - b.position))
    .map((image) => image.image_url)
    .filter(Boolean)

  const galleryImages = variantImages.length > 0 ? variantImages : [PLACEHOLDER_IMAGE]
  const displayPrice = Number(selectedVariant?.price ?? product.price) || 0
  const isSelectedOutOfStock = Boolean(selectedVariant) && (selectedVariant?.stock || 0) <= 0
  const colorList = (product.variants || [])
    .filter((variant) => Boolean(variant.color))
    .map((variant) => ({
      name: variant.color || "",
      hex: COLOR_HEX_MAP[(variant.color || "").toLowerCase()] || "#9CA3AF",
      available: (variant.stock || 0) > 0,
    }))
  const hasColors = colorList.length > 0
  const sizeList = Array.from(new Set(scopedVariants.map((variant) => getVariantSize(variant)))).map((size) => ({
    size,
    available: scopedVariants.some((variant) => getVariantSize(variant) === size && (variant.stock || 0) > 0),
  }))
  const accordionItems = [
    {
      title: "Details",
      content: [product.description || "No additional details available."],
    },
    {
      title: "Materials",
      content: ["Waterproof material"],
    },
    {
      title: "Care",
      content: ["Wipe clean with a dry cloth"],
    },
    {
      title: "Shipping & Returns",
      content: [
        "Complimentary shipping on all orders",
        "Express delivery available",
        "Free returns within 30 days",
        "Items must be unworn with tags attached",
      ],
    },
  ]

  const handleAddToBag = async () => {
    if (isSelectedOutOfStock || isAddingToBag) return
    const stored = localStorage.getItem("user")
    if (!stored) {
      window.location.href = "/signin"
      return
    }
    try {
      const parsed = JSON.parse(stored)
      if (!parsed?.id) {
        window.location.href = "/signin"
        return
      }
      setIsAddingToBag(true)
      setCartMessage("")
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
        throw new Error(data.error || "Failed to add item to bag")
      }
      setCartMessage("Added to bag.")
      toast({
        title: "Added to bag",
        description: `${product.title} added to your cart.`,
      })
      window.dispatchEvent(new Event("cart-updated"))
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add item to bag"
      setCartMessage(message)
      toast({
        title: "Add to bag failed",
        description: message,
      })
    } finally {
      setIsAddingToBag(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submittingReview) return
    if (!reviewRating) {
      toast({
        title: "Rating required",
        description: "Please select a rating between 1 and 5.",
      })
      return
    }
    const token = localStorage.getItem("token")
    if (!token) {
      toast({
        title: "Sign in required",
        description: "Please sign in to submit a review.",
      })
      window.location.href = "/signin"
      return
    }
    setSubmittingReview(true)
    try {
      const endpoint = existingReview ? `${API_BASE_URL}/api/reviews/${existingReview.id}` : `${API_BASE_URL}/api/reviews`
      const method = existingReview ? "PUT" : "POST"
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: id,
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error((data as { error?: string }).error || "Failed to submit review")
      }
      toast({
        title: existingReview ? "Review updated" : "Review submitted",
        description: existingReview ? "Your review has been updated." : "Thanks for your feedback.",
      })
      await loadReviews()
    } catch (error) {
      toast({
        title: "Review failed",
        description: error instanceof Error ? error.message : "Failed to submit review",
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleDeleteReview = async () => {
    if (!existingReview || deletingReview) return
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/signin"
      return
    }
    setDeletingReview(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${existingReview.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error || "Failed to delete review")
      }
      setReviewRating(0)
      setReviewComment("")
      toast({
        title: "Review deleted",
        description: "Your review has been removed.",
      })
      await loadReviews()
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete review",
      })
    } finally {
      setDeletingReview(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.title}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductGallery images={galleryImages} productName={product.title} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:sticky lg:top-32 lg:self-start space-y-8"
          >
            <div className="space-y-4">
              <h1 className="font-serif text-3xl md:text-4xl">{product.title}</h1>
              <p className="text-xl">Tk {displayPrice.toLocaleString()}</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {hasColors && <ColorSelector colors={colorList} onSelect={setSelectedColor} />}

            <SizeSelector
              key={`${id}-${selectedColor || "all"}`}
              sizes={sizeList.length ? sizeList : [{ size: "Standard", available: true }]}
              onSelect={setSelectedSize}
            />

            <motion.button
              disabled={isSelectedOutOfStock}
              onClick={handleAddToBag}
              className={`w-full py-4 text-sm tracking-widest uppercase transition-colors ${
                isSelectedOutOfStock
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {isSelectedOutOfStock ? "Stock Out" : isAddingToBag ? "Adding..." : "Add to Bag"}
            </motion.button>

            <p className="text-xs text-muted-foreground text-center tracking-widest">
              {isSelectedOutOfStock
                ? "This selected size is stock out."
                : "Price and stock update based on selected size."}
            </p>
            {cartMessage ? <p className="text-xs text-center tracking-widest">{cartMessage}</p> : null}

            <ProductDetailsAccordion items={accordionItems} />
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl">Customer Reviews</h2>
            <p className="text-sm text-muted-foreground">
              {reviews.length
                ? `${averageRating.toFixed(1)} / 5 from ${reviews.length} review${reviews.length > 1 ? "s" : ""}`
                : "No reviews yet. Be the first to review this product."}
            </p>
            {reviewsLoading ? (
              <p className="text-sm text-muted-foreground">Loading reviews...</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{review.users?.name || "Customer"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={`${review.id}-${value}`}
                          className={`h-4 w-4 ${value <= review.rating ? "fill-current text-yellow-500" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    {review.comment ? <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-2xl">{existingReview ? "Update Your Review" : "Write a Review"}</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Your Rating</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={`rate-${value}`}
                      type="button"
                      onClick={() => setReviewRating(value)}
                      className="p-1"
                      aria-label={`Rate ${value} stars`}
                    >
                      <Star
                        className={`h-5 w-5 ${value <= reviewRating ? "fill-current text-yellow-500" : "text-muted-foreground"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Your Comment</p>
                <Input
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={submittingReview}>
                  {submittingReview ? "Saving..." : existingReview ? "Update Review" : "Submit Review"}
                </Button>
                {existingReview ? (
                  <Button type="button" variant="outline" disabled={deletingReview} onClick={handleDeleteReview}>
                    {deletingReview ? "Removing..." : "Delete"}
                  </Button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  )
}
