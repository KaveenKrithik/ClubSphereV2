"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { UILogo } from "@/components/ui-logo"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="container flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="w-full max-w-md z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <UILogo />
              <h1 className="text-3xl font-bold">ClubSphere</h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-2 shadow-2xl relative bg-background/80 backdrop-blur overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500" />
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-white bg-destructive rounded-md text-center">
                    {error}
                  </div>
                )}
                
                <Button 
                  onClick={handleGoogleSignIn} 
                  variant="outline" 
                  size="lg"
                  className="w-full h-14 text-lg font-medium border-2 hover:bg-muted transition-all gap-3" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="h-6 w-6" viewBox="0 0 24 24">
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
                  )}
                  Continue with Google
                </Button>

                <p className="text-xs text-center text-muted-foreground px-6">
                  By clicking continue, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
              <CardFooter className="bg-muted/30 p-6 flex justify-center">
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
