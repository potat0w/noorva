"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Package, Truck, CheckCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { API_BASE_URL } from "@/lib/api"

interface VariantImage {
  image_url: string
  position: number
}

interface Variant {
  color?: string | null
  variant_images?: VariantImage[]
}

interface Product {
  title?: string
  variants?: Variant[]
}

interface OrderItemApi {
  id: string
  product_id: string
  quantity: number
  price: number
  products?: Product | null
}

interface OrderApi {
  id: string
  created_at?: string
  status?: string
  total_price?: number
  order_items?: OrderItemApi[]
}

interface OrderItemView {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  color: string
  image: string
}

interface OrderView {
  id: string
  orderNo: string
  date: string
  status: string
  statusColor: string
  total: number
  items: OrderItemView[]
}

const statusLabel = (status?: string) => {
  const value = (status || "").toLowerCase()
  if (value === "delivered") return "Delivered"
  if (value === "in_transit" || value === "in transit" || value === "shipped") return "In Transit"
  return "Processing"
}

const statusColor = (status: string) => {
  if (status === "Delivered") return "text-green-600"
  if (status === "In Transit") return "text-amber-600"
  return "text-blue-600"
}

const orderNumber = (id: string, createdAt?: string) => {
  const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear()
  const short = id.replace(/-/g, "").slice(-4).toUpperCase()
  return `ORD-${year}-${short}`
}

const formatDate = (createdAt?: string) => {
  if (!createdAt) return "Recent"
  return new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const toOrderView = (order: OrderApi): OrderView => {
  const normalized = statusLabel(order.status)
  const items: OrderItemView[] = (order.order_items || []).map((item) => {
    const variants = item.products?.variants || []
    const firstVariant = variants[0]
    const image =
      [...(firstVariant?.variant_images || [])].sort((a, b) => a.position - b.position)[0]?.image_url ||
      "/placeholder.svg"
    return {
      id: item.id,
      productId: item.product_id,
      name: item.products?.title || "Product",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      color: firstVariant?.color || "Standard",
      image,
    }
  })
  return {
    id: order.id,
    orderNo: orderNumber(order.id, order.created_at),
    date: formatDate(order.created_at),
    status: normalized,
    statusColor: statusColor(normalized),
    total: Number(order.total_price) || items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    items,
  }
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "Delivered":
      return <CheckCircle className="h-4 w-4" />
    case "In Transit":
      return <Truck className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderView[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      const stored = localStorage.getItem("user")
      const token = localStorage.getItem("token")
      if (!stored || !token) {
        window.location.href = "/signin"
        return
      }
      try {
        const parsed = JSON.parse(stored)
        if (!parsed?.id) {
          window.location.href = "/signin"
          return
        }
        const response = await fetch(`${API_BASE_URL}/api/orders/user/${parsed.id}`)
        const data = (await response.json()) as OrderApi[]
        if (!response.ok || !Array.isArray(data)) {
          setOrders([])
          return
        }
        const mapped = data.map(toOrderView)
        setOrders(mapped)
        setExpandedOrder(mapped[0]?.id || null)
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-serif text-3xl lg:text-4xl mb-2">My Account</h1>
            <p className="text-muted-foreground">View your order history</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <h2 className="font-serif text-2xl mb-8">Order History</h2>

              {loading ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                  <Link
                    href="/shop"
                    className="text-sm tracking-[0.15em] uppercase underline underline-offset-4 hover:no-underline transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border border-border"
                    >
                      {/* Order header */}
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                          <span className="font-mono text-sm">{order.orderNo}</span>
                          <span className="text-sm text-muted-foreground">{order.date}</span>
                          <span className={`flex items-center gap-1.5 text-sm ${order.statusColor}`}>
                            <StatusIcon status={order.status} />
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm hidden sm:block">Tk {order.total.toLocaleString()}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 ${
                              expandedOrder === order.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Order details - converted to Next.js Image with lazy loading */}
                      <AnimatePresence>
                        {expandedOrder === order.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 border-t border-border">
                              <div className="space-y-4 pt-6">
                                {order.items.map((item) => (
                                  <Link key={item.id} href={`/product/${item.productId}`} className="flex gap-4 group">
                                    <div className="w-16 h-20 bg-muted flex-shrink-0 relative overflow-hidden">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        sizes="64px"
                                        loading="lazy"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-serif text-sm group-hover:underline">{item.name}</h4>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {item.color} / Qty {item.quantity}
                                      </p>
                                    </div>
                                    <div className="text-sm">Tk {(item.price * item.quantity).toLocaleString()}</div>
                                  </Link>
                                ))}
                              </div>

                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t border-border">
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Order Total: </span>
                                  <span className="font-medium">Tk {order.total.toLocaleString()}</span>
                                </div>
                                <div className="flex gap-4">
                                  <button className="text-sm underline underline-offset-4 hover:no-underline transition-all">
                                    View Invoice
                                  </button>
                                  {order.status === "In Transit" && (
                                    <button className="text-sm underline underline-offset-4 hover:no-underline transition-all">
                                      Track Order
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <PremiumFooter />
    </>
  )
}
