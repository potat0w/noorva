"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const safeProductName = productName?.trim() || "Product image"
  const activeImage = images[activeIndex] || "/placeholder.svg"

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    })
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails - added lazy loading for non-active thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`relative w-20 h-24 md:w-20 md:h-28 flex-shrink-0 overflow-hidden transition-all duration-300 ${
              activeIndex === index ? "ring-1 ring-foreground" : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${safeProductName} view ${index + 1}`}
              fill
              sizes="80px"
              loading="lazy"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="flex-1">
        <div
          className="relative aspect-[3/4] bg-muted overflow-hidden"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={activeImage}
                alt={safeProductName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={activeIndex === 0}
                className={`object-cover transition-transform duration-150 ${isZoomed ? "scale-[2.2]" : "scale-100"}`}
                style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
