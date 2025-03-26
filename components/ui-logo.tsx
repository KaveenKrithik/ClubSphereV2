"use client"
import { motion } from "framer-motion"

export function UILogo() {
  return (
    <div className="relative h-8 w-8">
      <motion.div
        className="absolute inset-0 rounded-full bg-primary opacity-20"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <div className="h-6 w-6 rounded-full border-2 border-primary" />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ rotate: 45 }}
        animate={{ rotate: -315 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <div className="h-4 w-4 rounded-full bg-primary" />
      </motion.div>
    </div>
  )
}

