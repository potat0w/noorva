"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { User, Package, MapPin, Settings, LogOut } from "lucide-react"
import { motion } from "framer-motion"

const accountLinks = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/settings", label: "Settings", icon: Settings },
]

export function AccountSidebar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      setIsAdmin(parsed?.role === "admin")
    } catch {
      setIsAdmin(false)
    }
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/signin"
  }

  const visibleLinks = isAdmin
    ? accountLinks.filter((link) => link.href !== "/account/orders" && link.href !== "/account/addresses")
    : accountLinks

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <nav className="space-y-1">
        {visibleLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-colors relative ${
                isActive ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="account-sidebar-indicator"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-foreground"
                  transition={{ duration: 0.2 }}
                />
              )}
              <link.icon className="h-4 w-4 stroke-[1.5]" />
              {link.label}
            </Link>
          )
        })}
        {isAdmin ? (
          <Link
            href="/account/admin-orders"
            className={`flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-colors relative ${
              pathname === "/account/admin-orders"
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {pathname === "/account/admin-orders" ? (
              <motion.div
                layoutId="account-sidebar-indicator"
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-foreground"
                transition={{ duration: 0.2 }}
              />
            ) : null}
            <Package className="h-4 w-4 stroke-[1.5]" />
            Admin Orders
          </Link>
        ) : null}
        <button
          className="flex items-center gap-3 px-4 py-3 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors w-full"
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="h-4 w-4 stroke-[1.5]" />
          Sign Out
        </button>
      </nav>
    </aside>
  )
}
