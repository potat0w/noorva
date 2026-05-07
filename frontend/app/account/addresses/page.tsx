"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { API_BASE_URL } from "@/lib/api"

interface OrderAddressApi {
  id: string
  full_name?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
}

interface SavedAddress {
  id: string
  label: string
  default: boolean
  name: string
  street: string
  cityState: string
  zip: string
  country: string
  phone: string
}

export default function AddressesPage() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAddresses = async () => {
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
        const data = (await response.json()) as OrderAddressApi[]
        if (!response.ok || !Array.isArray(data)) {
          setAddresses([])
          return
        }
        const map = new Map<string, SavedAddress>()
        data.forEach((order, index) => {
          const fullName = (order.full_name || "").trim()
          const phone = (order.phone || "").trim()
          const street = (order.address || "").trim()
          const cityState = (order.city || "").trim()
          const zip = (order.postal_code || "").trim()
          if (!fullName || !phone || !street || !cityState) return
          const key = `${fullName}|${phone}|${street}|${cityState}|${zip}`
          if (!map.has(key)) {
            map.set(key, {
              id: order.id,
              label: map.size === 0 ? "Default" : `Address ${map.size + 1}`,
              default: map.size === 0,
              name: fullName,
              street,
              cityState,
              zip,
              country: "Bangladesh",
              phone,
            })
          }
          if (index === data.length - 1 && map.size > 0 && !selectedAddress) {
            setSelectedAddress(Array.from(map.values())[0].id)
          }
        })
        setAddresses(Array.from(map.values()))
      } catch {
        setAddresses([])
      } finally {
        setLoading(false)
      }
    }
    loadAddresses()
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
            <p className="text-muted-foreground">Manage your shipping addresses</p>
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
                <h2 className="font-serif text-2xl">Saved Addresses</h2>
                <Button disabled variant="outline" className="gap-2 text-sm tracking-[0.1em] uppercase bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </div>

              {loading ? (
                <p className="text-sm text-muted-foreground">Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved addresses yet. Place an order to save one.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                {addresses.map((address, index) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`relative border p-6 transition-colors cursor-pointer ${
                      selectedAddress === address.id || address.default
                        ? "border-foreground"
                        : "border-border hover:border-foreground/50"
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    {address.default && (
                      <span className="absolute top-4 right-4 text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                        Default
                      </span>
                    )}

                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{address.label}</span>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1 ml-7">
                      <p>{address.name}</p>
                      <p>{address.street}</p>
                      <p>{address.cityState}</p>
                      <p>{address.zip}</p>
                      <p>{address.country}</p>
                      <p className="pt-2">{address.phone}</p>
                    </div>
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
