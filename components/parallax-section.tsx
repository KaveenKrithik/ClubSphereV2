"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  bgImage?: string
  overlayColor?: string
}

export function ParallaxSection({
  children,
  className,
  bgImage,
  overlayColor = "from-primary/30 to-background/95",
}: ParallaxSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {bgImage && (
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b z-10 dark:opacity-90 opacity-80 backdrop-blur-[2px]" />
          <img src={bgImage || "/placeholder.svg"} alt="Background" className="h-full w-full object-cover" />
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

