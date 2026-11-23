"use client"

import React from "react"
import { motion, MotionConfig } from "motion/react"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  duration = 0.45,
  y = 16,
}: FadeInProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration, delay, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}
