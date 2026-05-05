"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

interface ConfettiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  href: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ConfettiButton({
  children,
  href,
  variant = "default",
  size = "default",
  className,
  disabled,
  ...props
}: ConfettiButtonProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  const handleClick = async (e: React.MouseEvent) => {
    if (href && href !== "#") {
      e.preventDefault()
    }
    
    setShowConfetti(true)
    
    setTimeout(() => {
      setShowConfetti(false)
      if (href && href !== "#") {
        window.location.href = href
      }
    }, 1500)
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}
      <Button variant={variant} size={size} className={className} onClick={handleClick} disabled={disabled} {...props}>
        {children}
      </Button>
    </>
  )
}

