"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X, Smartphone, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if user is on iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      const isDismissed = sessionStorage.getItem("pwa-prompt-dismissed")
      if (!isDismissed) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    // iOS doesn't trigger beforeinstallprompt, so we show it manually
    if (isIOSDevice) {
      const isDismissed = sessionStorage.getItem("pwa-prompt-dismissed")
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone
      if (!isDismissed && !isStandalone) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === "accepted") {
      console.log("User accepted the PWA install")
    } else {
      console.log("User dismissed the PWA install")
    }

    // We've used the prompt, and can't use it again
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    sessionStorage.setItem("pwa-prompt-dismissed", "true")
  }

  if (!showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-[100]"
      >
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-background/80 backdrop-blur-xl shadow-2xl p-6 group">
          
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-primary/10 transition-colors opacity-60 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 animate-pulse">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg tracking-tight">Install ClubSphere</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isIOS 
                  ? "Tap the 'Share' icon in your browser and select 'Add to Home Screen' to install."
                  : "Add ClubSphere to your home screen for a faster, full-screen campus experience."
                }
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {!isIOS ? (
              <>
                <Button 
                  onClick={handleInstall}
                  className="flex-1 rounded-xl h-11 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Install Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDismiss}
                  className="rounded-xl h-11 border-primary/10 hover:bg-primary/5"
                >
                  Maybe Later
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleDismiss}
                className="flex-1 rounded-xl h-11 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                Got it
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
