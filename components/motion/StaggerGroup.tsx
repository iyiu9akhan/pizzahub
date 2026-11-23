"use client"

import React from "react"
import { motion, MotionConfig } from "motion/react"

interface StaggerGroupProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerGroup({
  children,
  className = "",
  staggerDelay = 0.08,
}: StaggerGroupProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: staggerDelay,
            },
          },
        }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}
