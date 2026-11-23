"use client"

import React from "react"
import { motion } from "motion/react"

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  y?: number
  duration?: number
}

export function StaggerItem({
  children,
  className = "",
  y = 16,
  duration = 0.45,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
