// MenuEmptyState — displayed when no menu items match the user's active filter criteria.
import React from "react"
import { Pizza } from "lucide-react"

export interface MenuEmptyStateProps {
  onClearFilters: () => void
}

export default function MenuEmptyState({ onClearFilters }: MenuEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-surface p-12 text-center shadow-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
        <Pizza className="h-8 w-8" />
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold text-ink">
        No items match your filters
      </h3>
      <p className="mt-1.5 max-w-sm font-text text-sm text-ink-muted">
        We couldn&apos;t find any pizzas or items matching your current search or category selections.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-brand px-6 font-heading text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
      >
        Clear filters
      </button>
    </div>
  )
}
