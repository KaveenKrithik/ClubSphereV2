"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

interface ConfettiButtonProps {
  children: React.ReactNode
  href: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ConfettiButton({
  children,
  href,
  variant = "default",
  size = "default",
  className,
}: ConfettiButtonProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  const handleClick = (e: React.MouseEvent) => {
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      window.location.href = href
    }, 1500)
    e.preventDefault()
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}
      <Button variant={variant} size={size} className={className} onClick={handleClick}>
        {children}
      </Button>
    </>
  )
}

