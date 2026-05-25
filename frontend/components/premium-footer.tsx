"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"

export function PremiumFooter() {
  const footerLinks = {
    shop: [
      { label: "New Arrivals", href: "/shop" },
      { label: "Women", href: "/shop" },
      { label: "Men", href: "/shop" },
      { label: "Accessories", href: "/shop" },
      { label: "Timepieces", href: "/shop" },
    ],
    about: [
      { label: "Our Heritage", href: "/heritage" },
      { label: "Craftsmanship", href: "/heritage" },
      { label: "Sustainability", href: "/heritage" },
      { label: "Careers", href: "/heritage" },
    ],
    support: [
      { label: "Contact Us", href: "/heritage" },
      { label: "Shipping & Returns", href: "/terms" },
      { label: "Size Guide", href: "/shop" },
      { label: "Care Instructions", href: "/shop" },
    ],
  }

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="font-serif text-xl mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-background/80 leading-relaxed">
              <li>Location: Dhaka, Dhaka, Bangladesh</li>
              <li>
                <a href="mailto:annnoor567@gmail.com" className="hover:text-background transition-colors">
                  Email: annnoor567@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+8801322708213" className="hover:text-background transition-colors">
                  Phone (international): +880 1322-708213
                </a>
              </li>
              <li>
                <a href="https://m.facebook.com/noorva00/" className="hover:text-background transition-colors">
                  WhatsApp/Messenger: Noorva-নূরভা
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Shop links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-background/60">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/80 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* About links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-background/60">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/80 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-background/60">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/80 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-serif text-lg tracking-[0.3em] uppercase">
              Noorva
            </Link>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/noorva99/" className="hover:opacity-60 transition-opacity" aria-label="Instagram">
                <Instagram className="h-4 w-4 stroke-[1.5]" />
              </a>
              <a href="https://m.facebook.com/noorva00/" className="hover:opacity-60 transition-opacity" aria-label="Facebook">
                <Facebook className="h-4 w-4 stroke-[1.5]" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-background/50">
            <Link href="/privacy" className="hover:text-background/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-background/80 transition-colors">
              Terms of Service
            </Link>
            <span>© 2026 Noorva. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
