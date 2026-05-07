"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

interface MiniCartProps {
  isOpen: boolean
  onClose: () => void
}

interface VariantImage {
  image_url: string
  position: number
}

interface Variant {
  variant_images?: VariantImage[]
}

interface Product {
  title?: string
  price?: number
  variants?: Variant[]
}

interface CartApiItem {
  id: string
  quantity: number
  products?: Product | null
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  useEffect(() => {
    if (!isOpen) return

    const loadCart = async () => {
      const stored = localStorage.getItem("user")
      if (!stored) {
        setCartItems([])
        return
      }

      try {
        const parsed = JSON.parse(stored)
        if (!parsed?.id) {
          setCartItems([])
          return
        }
        setLoading(true)
        setError("")
        const response = await fetch(`${API_BASE_URL}/api/cart/user/${parsed.id}`)
        const data = (await response.json()) as CartApiItem[]
        if (!response.ok) {
          throw new Error("Failed to load cart")
        }
        const mapped = (data || []).map((item) => {
          const variantImages =
            item.products?.variants?.flatMap((variant) =>
              (variant.variant_images || []).sort((a, b) => a.position - b.position),
            ) || []
          return {
            id: item.id,
            name: item.products?.title || "Product",
            price: Number(item.products?.price) || 0,
            quantity: item.quantity || 1,
            image: variantImages[0]?.image_url || "/placeholder.svg",
          }
        })
        setCartItems(mapped)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load cart")
        setCartItems([])
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [isOpen])

  const refreshCart = async () => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      setCartItems([])
      return
    }
    try {
      const parsed = JSON.parse(stored)
      if (!parsed?.id) {
        setCartItems([])
        return
      }
      const response = await fetch(`${API_BASE_URL}/api/cart/user/${parsed.id}`)
      const data = (await response.json()) as CartApiItem[]
      if (!response.ok) {
        throw new Error("Failed to load cart")
      }
      const mapped = (data || []).map((item) => {
        const variantImages =
          item.products?.variants?.flatMap((variant) =>
            (variant.variant_images || []).sort((a, b) => a.position - b.position),
          ) || []
        return {
          id: item.id,
          name: item.products?.title || "Product",
          price: Number(item.products?.price) || 0,
          quantity: item.quantity || 1,
          image: variantImages[0]?.image_url || "/placeholder.svg",
        }
      })
      setCartItems(mapped)
      window.dispatchEvent(new Event("cart-updated"))
    } catch {
      setError("Failed to refresh cart")
      toast({
        title: "Cart refresh failed",
        description: "Could not refresh your shopping bag.",
      })
    }
  }

  const updateQuantity = async (cartItemId: string, currentQuantity: number, delta: number) => {
    const nextQuantity = currentQuantity + delta
    try {
      setError("")
      if (nextQuantity <= 0) {
        const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, { method: "DELETE" })
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error((data as { error?: string }).error || "Failed to remove item")
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: nextQuantity }),
        })
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error((data as { error?: string }).error || "Failed to update quantity")
        }
      }
      await refreshCart()
      toast({
        title: nextQuantity <= 0 ? "Item removed" : "Cart updated",
        description: nextQuantity <= 0 ? "Item removed from your bag." : "Item quantity updated.",
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to update quantity"
      setError(message)
      toast({
        title: "Cart update failed",
        description: message,
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/40 z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl">Shopping Bag</h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 hover:opacity-60 transition-opacity"
                aria-label="Close cart"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? <p className="text-sm text-muted-foreground">Loading cart...</p> : null}
              {!loading && error ? <p className="text-sm text-muted-foreground">{error}</p> : null}
              {!loading && !error && cartItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your bag is empty.</p>
              ) : null}
              {!loading && !error && cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-24 h-30 bg-muted flex-shrink-0 relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          sizes="96px"
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-sm mb-1">{item.name}</h3>
                        <div className="flex items-center gap-3">
                          <button
                            className="p-1 hover:opacity-60 transition-opacity"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            className="p-1 hover:opacity-60 transition-opacity"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm">Tk {item.price.toLocaleString()}</div>
                    </motion.div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="border-t border-border p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Tk {subtotal.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
              <Link href="/checkout" onClick={onClose}>
                <Button className="w-full py-6 text-sm tracking-[0.2em] uppercase">Proceed to Checkout</Button>
              </Link>
              <button
                onClick={onClose}
                className="w-full text-center text-sm tracking-wide underline underline-offset-4 hover:no-underline transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
