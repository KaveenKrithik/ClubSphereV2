"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LogIn, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { UILogo } from "@/components/ui-logo"
import { createClient } from "@/lib/supabase/client"

export function SignInPrompt() {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [hasDismissed, setHasDismissed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // If user is already logged in, never show the prompt
    if (user) return

    // Check if user has already dismissed it in this session
    const dismissed = sessionStorage.getItem("sign-in-prompt-dismissed")
    if (dismissed) {
      setHasDismissed(true)
      return
    }

    const handleScroll = () => {
      if (hasDismissed) return

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const fullHeight = document.documentElement.scrollHeight

      // Show after scrolling 25% of the page
      if (scrollPosition > (fullHeight - windowHeight) * 0.25) {
        setIsVisible(true)
      }
    }

    const handleCarouselInteraction = (e: WheelEvent) => {
      if (hasDismissed) return
      // Detect horizontal scroll (likely carousel)
      if (Math.abs(e.deltaX) > 10) {
        setIsVisible(true)
      }
    }

    const handleTouchInteraction = () => {
      if (hasDismissed) return
      // Any touch move could be a carousel swipe or scroll
      // We'll show it after a bit of interaction
      const timer = setTimeout(() => setIsVisible(true), 2000)
      window.removeEventListener("touchmove", handleTouchInteraction)
      return () => clearTimeout(timer)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("wheel", handleCarouselInteraction)
    window.addEventListener("touchmove", handleTouchInteraction)
    
    // Also show if they interact with the page for more than 10 seconds
    const timer = setTimeout(() => {
      if (!hasDismissed) {
        setIsVisible(true)
      }
    }, 10000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("wheel", handleCarouselInteraction)
      window.removeEventListener("touchmove", handleTouchInteraction)
      clearTimeout(timer)
    }
  }, [user, hasDismissed])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error.message)
      setIsLoading(false)
    }
  }

  const dismissPrompt = () => {
    setIsVisible(false)
    setHasDismissed(true)
    sessionStorage.setItem("sign-in-prompt-dismissed", "true")
  }

  if (user || !isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-md bg-background/80 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] p-8 relative pointer-events-auto overflow-hidden group"
          >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl transition-all group-hover:bg-primary/30 group-hover:scale-110 duration-700" />
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-secondary/20 rounded-full blur-3xl transition-all group-hover:bg-secondary/30 group-hover:scale-110 duration-700" />

            <button 
              onClick={dismissPrompt}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors z-10 p-1 rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center gap-6 relative z-10">
              <div className="h-20 w-20 flex items-center justify-center relative transition-transform duration-500">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                >
                  <UILogo size={60} />
                </motion.div>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                  Never Miss a Beat
                </h3>
                <p className="text-muted-foreground text-balance leading-relaxed">
                  Join our community with one click to get the latest event updates and personalized hackathon alerts.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 mt-2">
                <Button 
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  size="lg" 
                  className="w-full font-bold h-14 text-md shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 bg-white text-black hover:bg-slate-50 border-2 border-slate-200"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Continue with Google
                    </div>
                  )}
                </Button>
                <Button variant="ghost" onClick={dismissPrompt} className="text-sm font-medium hover:bg-transparent hover:text-primary transition-colors">
                  Maybe later, I'll explore first
                </Button>
              </div>
            </div>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
