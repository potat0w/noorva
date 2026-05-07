"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const timeline = [
  {
    year: "2018",
    title: "The Beginning",
    description:
      "We started as a small local shop with a passion for providing quality products and friendly customer service to our community.",
  },
  {
    year: "2021",
    title: "Building Customer Trust",
    description:
      "Over the years, our store became a trusted destination for customers looking for reliable products at affordable prices.",
  },
  {
    year: "2024",
    title: "Going Online",
    description:
      "To serve more customers beyond our local area, we launched our social media and online pages, making shopping easier and more accessible.",
  },
  {
    year: "2025",
    title: "Launching Our Website",
    description:
      "This year marks a new chapter with the launch of our official ecommerce website - offering a smoother, faster, and more convenient shopping experience.",
  },
  {
    year: "Today",
    title: "Growing Every Day",
    description:
      "We continue expanding our collection and improving our services while staying committed to the trust and support of our customers.",
  },
]

const values = [
  {
    title: "Quality First",
    description:
      "Every product is selected carefully to ensure quality, reliability, and customer satisfaction.",
    image: "/artisan-hands-crafting-leather-luxury-goods.jpg",
  },
  {
    title: "Customer Satisfaction",
    description:
      "We value every customer and aim to provide the best shopping experience possible.",
    image: "/premium-leather-material-sustainable-luxury.jpg",
  },
  {
    title: "Honest Pricing",
    description:
      "Good products should be accessible at fair and reasonable prices.",
    image: "/minimalist-luxury-handbag-timeless-design.jpg",
  },
  {
    title: "Modern Shopping Experience",
    description:
      "From offline shopping to online convenience, we are constantly evolving to serve you better.",
    image: "/shop-hero-luxury-fashion-collection.jpg",
  },
]

export default function HeritagePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - converted to Next.js Image with priority */}
      <section className="relative h-[70vh] lg:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/heri.jpg"
            alt="Florence, Italy"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.4em] uppercase text-background/70 mb-6 block"
          >
            Our Journey
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-background mb-6 leading-[1.1] text-balance"
          >
            From Local Store to Online Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-background/80 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Built on trust, quality, and customer care - now available both offline and online.
          </motion.p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg lg:text-xl text-muted-foreground leading-relaxed"
          >
            What began as a neighborhood store has grown into a complete shopping experience. We continue to blend
            personal service with modern convenience so every customer can shop with confidence.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-32 bg-muted">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-24"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 block">Our Journey</span>
            <h2 className="font-serif text-3xl lg:text-5xl">From Local Store to Online Experience</h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line - hidden on mobile */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12 mb-12 lg:mb-16 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <span className="font-serif text-3xl lg:text-4xl text-muted-foreground/50 block mb-2">
                    {item.year}
                  </span>
                  <h3 className="font-serif text-xl lg:text-2xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">{item.description}</p>
                </div>

                {/* Dot - hidden on mobile */}
                <div className="hidden lg:block relative z-10">
                  <div className="w-4 h-4 bg-foreground" />
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden lg:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section - converted to Next.js Image with lazy loading */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-24"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 block">Our Philosophy</span>
            <h2 className="font-serif text-3xl lg:text-5xl">What We Believe In</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="aspect-[5/6] overflow-hidden mb-6 relative">
                  <Image
                    src={value.image || "/placeholder.svg"}
                    alt={value.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-xl lg:text-2xl mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmen Section - converted to Next.js Image with lazy loading */}
      <section className="py-20 lg:py-32 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-24"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-background/60 mb-4 block">Built With Trust</span>
            <h2 className="font-serif text-3xl lg:text-5xl">Built With Trust</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Local Store Roots",
                description: "Started offline with real customer relationships.",
              },
              {
                title: "Growing Online",
                description: "Expanding through social media and ecommerce.",
              },
              {
                title: "Customer Focused",
                description: "Every improvement is made with customers in mind.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-background/20 p-8 text-center"
              >
                <h3 className="font-serif text-xl lg:text-2xl mb-3">{item.title}</h3>
                <p className="text-background/70 text-sm lg:text-base leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-serif text-2xl lg:text-4xl leading-relaxed mb-8 text-balance">
              "From a small local shop to an online store, our journey has always been about trust, quality, and
              customer satisfaction."
            </p>
            <cite className="not-italic">
              <span className="block text-sm tracking-[0.2em] uppercase text-muted-foreground">
                - Team Noorva
              </span>
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-muted">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 block">Explore</span>
            <h2 className="font-serif text-3xl lg:text-5xl mb-6">Discover the Collection</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the culmination of our heritage in every piece we create.
            </p>
            <Link
              href="/"
              className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm tracking-[0.2em] uppercase hover:gap-5 transition-all duration-300"
            >
              View Collection
              <ArrowRight className="h-4 w-4 stroke-[1.5]" />
            </Link>
          </motion.div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  )
}
