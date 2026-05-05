
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Info, Target, Zap, Heart, Shield, Globe } from "lucide-react"

export function AboutModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-xl bg-background/80 backdrop-blur-2xl border-primary/20 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden">
        <div className="p-10 max-h-[80vh] overflow-y-auto scrollbar-hide">
          <DialogHeader className="mb-8">
            <DialogTitle className="sr-only">
              The ClubSphere Vision
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-12">
            <section className="space-y-6 text-center">
              <p className="text-2xl font-light leading-snug tracking-tight text-balance">
                Bridging the gap between <span className="text-primary font-medium italic">ambition</span> and <span className="text-primary font-medium italic">opportunity</span> through a unified campus ecosystem.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                ClubSphere was born out of a simple observation: students have incredible potential, but finding the right opportunities at the right time is often difficult. We've built a centralized hub that aggregates every hackathon, workshop, and technical club on campus.
              </p>
            </section>

            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-2 text-center group">
                <h4 className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">Unified Discovery</h4>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                  A single source of truth for all campus tech activities. No more scattered WhatsApp groups.
                </p>
              </div>

              <div className="space-y-2 text-center group">
                <h4 className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">Verified Opportunities</h4>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                  Every event listed is vetted for quality, ensuring you spend your time on what truly matters.
                </p>
              </div>

              <div className="space-y-2 text-center group">
                <h4 className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">Community Driven</h4>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                  Built by students, for students. We understand the campus pulse better than anyone.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
              <Button variant="link" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors" asChild>
                <a href="https://github.com/KaveenKrithik/ClubSphereV2" target="_blank" rel="noreferrer">
                  Explore the Codebase
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
