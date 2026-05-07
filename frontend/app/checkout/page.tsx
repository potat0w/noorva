"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { API_BASE_URL } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

interface VariantImage {
  image_url: string
  position: number
}

interface Variant {
  variant_images?: VariantImage[]
}

interface Product {
  id: string
  title?: string
  price?: number
  variants?: Variant[]
}

interface CartApiItem {
  id: string
  product_id: string
  quantity: number
  products?: Product | null
}

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loadingCart, setLoadingCart] = useState(true)
  const [checkoutMessage, setCheckoutMessage] = useState("")
  const [placingOrder, setPlacingOrder] = useState(false)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [deliveryArea, setDeliveryArea] = useState<"" | "inside_dhaka" | "outside_dhaka">("")
  const [zip, setZip] = useState("")

  useEffect(() => {
    const loadCart = async () => {
      const stored = localStorage.getItem("user")
      if (!stored) {
        setCartItems([])
        setLoadingCart(false)
        return
      }
      try {
        const parsed = JSON.parse(stored)
        if (!parsed?.id) {
          setCartItems([])
          setLoadingCart(false)
          return
        }
        const response = await fetch(`${API_BASE_URL}/api/cart/user/${parsed.id}`)
        const data = (await response.json()) as CartApiItem[]
        if (!response.ok) {
          setCartItems([])
          setLoadingCart(false)
          return
        }
        const mapped = (data || []).map((item) => {
          const variantImages =
            item.products?.variants?.flatMap((variant) =>
              (variant.variant_images || []).sort((a, b) => a.position - b.position),
            ) || []
          return {
            id: item.id,
            productId: item.product_id,
            name: item.products?.title || "Product",
            price: Number(item.products?.price) || 0,
            quantity: item.quantity || 1,
            image: variantImages[0]?.image_url || "/placeholder.svg",
          }
        })
        setCartItems(mapped)
      } catch {
        setCartItems([])
      } finally {
        setLoadingCart(false)
      }
    }

    loadCart()
  }, [])

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = deliveryArea === "inside_dhaka" ? 60 : deliveryArea === "outside_dhaka" ? 150 : 0
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax

  const handlePlaceOrder = async () => {
    if (placingOrder || cartItems.length === 0) return
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
      if (!email || !firstName || !lastName || !phone || !address || !deliveryArea) {
        const message = "Please complete all required shipping fields."
        setCheckoutMessage(message)
        toast({
          title: "Order not placed",
          description: message,
        })
        return
      }
      const bdPhoneRegex = /^1\d{9}$/
      if (!bdPhoneRegex.test(phone.trim())) {
        const message = "Enter a valid Bangladesh phone number."
        setCheckoutMessage(message)
        toast({
          title: "Invalid phone number",
          description: message,
        })
        return
      }
      setPlacingOrder(true)
      setCheckoutMessage("")
      const payload = {
        user_id: parsed.id,
        total_price: total,
        status: "pending",
        full_name: `${firstName} ${lastName}`.trim(),
        phone: `+880${phone.trim()}`,
        address,
        city: deliveryArea === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka",
        postal_code: zip.trim(),
        items: cartItems.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      }
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to place order")
      }
      setCheckoutMessage("Order placed successfully.")
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully.",
      })
      setCartItems([])
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to place order"
      setCheckoutMessage(message)
      toast({
        title: "Order failed",
        description: message,
      })
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/shop"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <Link href="/" className="font-serif text-xl lg:text-2xl tracking-[0.3em] uppercase">
              Noorva
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Forms */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-serif text-2xl mb-8">Shipping Information</h2>

              <div className="mb-8">
                <h3 className="text-sm tracking-[0.1em] uppercase text-muted-foreground mb-4">Contact</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-xs tracking-wide">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 border-border/50 focus:border-foreground"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs tracking-wide">
                      Phone Number (Bangladesh)
                    </Label>
                    <div className="mt-1.5 flex">
                      <div className="flex h-10 items-center rounded-l-md border border-r-0 border-border/50 bg-muted px-3 text-sm text-muted-foreground">
                        +880
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="rounded-l-none border-border/50 focus:border-foreground"
                        placeholder="1XXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm tracking-[0.1em] uppercase text-muted-foreground mb-4">Shipping Address</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-xs tracking-wide">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1.5 border-border/50 focus:border-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-xs tracking-wide">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1.5 border-border/50 focus:border-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-xs tracking-wide">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1.5 border-border/50 focus:border-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deliveryArea" className="text-xs tracking-wide">
                        Delivery Area
                      </Label>
                      <select
                        id="deliveryArea"
                        value={deliveryArea}
                        onChange={(e) => setDeliveryArea(e.target.value as "" | "inside_dhaka" | "outside_dhaka")}
                        className="mt-1.5 h-10 w-full border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-foreground"
                        required
                      >
                        <option value="">Select area</option>
                        <option value="inside_dhaka">Inside Dhaka</option>
                        <option value="outside_dhaka">Outside Dhaka</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-xs tracking-wide">
                        Postal Code
                      </Label>
                      <Input
                        id="zip"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="mt-1.5 border-border/50 focus:border-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-border p-4 mb-8">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Payment Method: Cash on Delivery (COD).
                </p>
              </div>

              <Button onClick={handlePlaceOrder} disabled={placingOrder || cartItems.length === 0} className="w-full py-6 text-sm tracking-[0.2em] uppercase">
                {placingOrder ? "Placing Order..." : `Place Order — Tk ${total.toLocaleString()}`}
              </Button>
              {checkoutMessage ? <p className="mt-4 text-sm text-center">{checkoutMessage}</p> : null}
            </motion.div>
          </div>

          {/* Right - Order Summary - converted to Next.js Image with lazy loading */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-serif text-2xl mb-8">Order Summary</h2>

              <div className="space-y-6 mb-8">
                {loadingCart ? <p className="text-sm text-muted-foreground">Loading cart...</p> : null}
                {!loadingCart && cartItems.length === 0 ? <p className="text-sm text-muted-foreground">Your bag is empty.</p> : null}
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-20 h-24 bg-muted flex-shrink-0 relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="80px"
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm">Tk {item.price.toLocaleString()}</div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Tk {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Tk {shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span>Tk {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-3 border-t border-border">
                  <span>Total</span>
                  <span>Tk {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-muted">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All orders include complimentary shipping and signature gift packaging. Expected delivery within 5-7
                  business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
