"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { API_BASE_URL } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

interface OrderApi {
  id: string
  created_at?: string
  status?: string
  total_price?: number
  full_name?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  users?: {
    name?: string
    email?: string
  } | null
  order_items?: Array<{
    id: string
    order_id?: string
    product_id?: string
    quantity: number
    price: number
    products?: {
      title?: string
      variants?: Array<{
        id: string
        color?: string
        price?: number
        variant_images?: Array<{
          id: string
          image_url: string
          position: number
        }>
      }> | {
        id: string
        color?: string
        price?: number
        variant_images?: Array<{
          id: string
          image_url: string
          position: number
        }>
      }
    } | null
  }>
}

interface OrderEditState {
  full_name: string
  phone: string
  address: string
  city: string
  postal_code: string
  status: string
  total_price: string
}

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"]

const formatDate = (value?: string) => {
  if (!value) return "Recent"
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderApi[]>([])
  const [loading, setLoading] = useState(true)
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [editState, setEditState] = useState<OrderEditState>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    status: "pending",
    total_price: "",
  })
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [fallbackOrderItems, setFallbackOrderItems] = useState<Record<string, NonNullable<OrderApi["order_items"]>>>({})

  const loadOrderItemsByOrderId = async (orderIds: string[]) => {
    if (orderIds.length === 0) {
      setFallbackOrderItems({})
      return
    }
    try {
      const entries = await Promise.all(
        orderIds.map(async (orderId) => {
          const response = await fetch(`${API_BASE_URL}/api/order-items/order/${orderId}`)
          if (!response.ok) return [orderId, []] as const
          const data = (await response.json()) as NonNullable<OrderApi["order_items"]>
          return [orderId, Array.isArray(data) ? data : []] as const
        }),
      )
      const grouped = Object.fromEntries(entries)
      setFallbackOrderItems(grouped)
    } catch {
      setFallbackOrderItems({})
    }
  }

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      const response = await fetch(`${API_BASE_URL}/api/orders`, { headers })
      const data = (await response.json()) as OrderApi[]
      if (!response.ok || !Array.isArray(data)) {
        throw new Error("Failed to load orders")
      }
      setOrders(data)
      void loadOrderItemsByOrderId(data.map((order) => order.id))
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load orders"
      toast({
        title: "Load failed",
        description: message,
      })
      setOrders([])
      setFallbackOrderItems({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (!stored || !token) {
      window.location.href = "/signin"
      return
    }
    try {
      const parsed = JSON.parse(stored)
      if (parsed?.role !== "admin") {
        window.location.href = "/account/profile"
        return
      }
      void loadOrders()
    } catch {
      window.location.href = "/signin"
    }
  }, [])

  const startEdit = (order: OrderApi) => {
    setEditingOrderId(order.id)
    setEditState({
      full_name: order.full_name || "",
      phone: order.phone || "",
      address: order.address || "",
      city: order.city || "",
      postal_code: order.postal_code || "",
      status: order.status || "pending",
      total_price: String(order.total_price ?? ""),
    })
  }

  const cancelEdit = () => {
    setEditingOrderId(null)
    setEditState({
      full_name: "",
      phone: "",
      address: "",
      city: "",
      postal_code: "",
      status: "pending",
      total_price: "",
    })
  }

  const saveEdit = async (orderId: string) => {
    setUpdatingId(orderId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          full_name: editState.full_name.trim(),
          phone: editState.phone.trim(),
          address: editState.address.trim(),
          city: editState.city.trim(),
          postal_code: editState.postal_code.trim(),
          status: editState.status,
          total_price: Number(editState.total_price) || 0,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to update order")
      }
      setOrders((prev) => prev.map((order) => (order.id === orderId ? data : order)))
      toast({
        title: "Order updated",
        description: "Order details were updated successfully.",
      })
      cancelEdit()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update order"
      toast({
        title: "Update failed",
        description: message,
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to update status")
      }
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: data.status } : order)))
      toast({
        title: "Status updated",
        description: "Order status updated successfully.",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update status"
      toast({
        title: "Status update failed",
        description: message,
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteOrder = async (orderId: string) => {
    const shouldDelete = window.confirm("Delete this order permanently?")
    if (!shouldDelete) return
    setDeletingId(orderId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete order")
      }
      setOrders((prev) => prev.filter((order) => order.id !== orderId))
      toast({
        title: "Order deleted",
        description: "Order was deleted successfully.",
      })
      if (editingOrderId === orderId) {
        cancelEdit()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete order"
      toast({
        title: "Delete failed",
        description: message,
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="font-serif text-3xl lg:text-4xl mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all customer orders</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl">All Orders</h2>
                <Button variant="outline" onClick={() => void loadOrders()} className="text-sm bg-transparent">
                  Refresh
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-16 text-muted-foreground">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">No orders found.</div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isEditing = editingOrderId === order.id
                    const isBusy = updatingId === order.id || deletingId === order.id
                    const orderItems =
                      order.order_items && order.order_items.length > 0 ? order.order_items : fallbackOrderItems[order.id] || []
                    return (
                      <div key={order.id} className="border border-border p-6 space-y-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Order ID</p>
                            <p className="font-mono text-[13px] break-all">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                            <p className="text-sm leading-relaxed">
                              Customer: {order.users?.name || order.full_name || "N/A"} ({order.users?.email || "No email"})
                            </p>
                            <p className="text-sm">Phone: {order.phone || "No phone provided"}</p>
                            <p className="text-base font-medium">Total: Tk {(Number(order.total_price) || 0).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <select
                              value={order.status || "pending"}
                              onChange={(e) => void updateStatus(order.id, e.target.value)}
                              className="h-10 border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-foreground"
                              disabled={isBusy}
                            >
                              {statusOptions.map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                            <Button type="button" variant="outline" onClick={() => startEdit(order)} disabled={isBusy} className="bg-transparent text-sm">
                              Edit
                            </Button>
                            <Button type="button" variant="destructive" onClick={() => void deleteOrder(order.id)} disabled={isBusy}>
                              {deletingId === order.id ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </div>

                        {/* Order Items Section */}
                        {orderItems.length > 0 && (
                          <div className="border-t border-border pt-4">
                            <p className="text-xs text-muted-foreground mb-3">Order Items</p>
                            <div className="space-y-2">
                              {orderItems.map((item) => {
                                const product = Array.isArray(item.products)
                                  ? (item.products[0] ?? null)
                                  : item.products || null
                                const variants = Array.isArray(product?.variants)
                                  ? product?.variants
                                  : product?.variants
                                    ? [product.variants]
                                    : []
                                const color = variants[0]?.color || "Standard"
                                return (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                  <div className="flex-1">
                                    <p className="font-medium text-sm leading-relaxed">{product?.title || "Product"}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Color: {color} | Quantity: {item.quantity}
                                    </p>
                                    {!product?.title && item.product_id ? (
                                      <p className="text-xs text-muted-foreground">Product ID: {item.product_id}</p>
                                    ) : null}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-sm">Tk {(item.price * item.quantity).toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Tk {item.price.toLocaleString()} each</p>
                                  </div>
                                </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {isEditing ? (
                          <div className="grid sm:grid-cols-2 gap-4 border-t border-border pt-5">
                            <div>
                              <Label className="text-xs text-muted-foreground">Full Name</Label>
                              <Input
                                value={editState.full_name}
                                onChange={(e) => setEditState((prev) => ({ ...prev, full_name: e.target.value }))}
                                className="mt-1.5"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Phone</Label>
                              <Input
                                value={editState.phone}
                                onChange={(e) => setEditState((prev) => ({ ...prev, phone: e.target.value }))}
                                className="mt-1.5"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <Label className="text-xs text-muted-foreground">Address</Label>
                              <Input
                                value={editState.address}
                                onChange={(e) => setEditState((prev) => ({ ...prev, address: e.target.value }))}
                                className="mt-1.5"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">City</Label>
                              <Input
                                value={editState.city}
                                onChange={(e) => setEditState((prev) => ({ ...prev, city: e.target.value }))}
                                className="mt-1.5"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Postal Code</Label>
                              <Input
                                value={editState.postal_code}
                                onChange={(e) => setEditState((prev) => ({ ...prev, postal_code: e.target.value }))}
                                className="mt-1.5"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Status</Label>
                              <select
                                value={editState.status}
                                onChange={(e) => setEditState((prev) => ({ ...prev, status: e.target.value }))}
                                className="mt-1.5 h-10 w-full border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-foreground"
                              >
                                {statusOptions.map((value) => (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Total Price</Label>
                              <Input
                                type="number"
                                min="0"
                                value={editState.total_price}
                                onChange={(e) => setEditState((prev) => ({ ...prev, total_price: e.target.value }))}
                                className="mt-1.5"
                              />
                            </div>
                            <div className="sm:col-span-2 flex gap-2 pt-2">
                              <Button type="button" onClick={() => void saveEdit(order.id)} disabled={updatingId === order.id}>
                                {updatingId === order.id ? "Saving..." : "Save"}
                              </Button>
                              <Button type="button" variant="outline" onClick={cancelEdit} className="bg-transparent" disabled={updatingId === order.id}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
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
