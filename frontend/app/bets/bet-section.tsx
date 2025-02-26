"use client"

import { motion } from "framer-motion"
import { BetCard } from "./bet-card"
import type { Bet } from "./types"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link"

interface BetSectionProps {
  title: string
  bets: Bet[]
  currentPage: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  showViewAll?: boolean
}

export function BetSection({
  title,
  bets,
  currentPage,
  onPageChange,
  itemsPerPage = 6,
  showViewAll = false,
}: BetSectionProps) {
  const totalPages = Math.ceil(bets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleBets = bets.slice(startIndex, startIndex + itemsPerPage)
  const totalBets = bets.length

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">{totalBets} total</span>
        </div>
        {showViewAll && (
          <Link href="/bets/active" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            View All Active Bets
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleBets.map((bet, index) => (
          <motion.div
            key={bet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <BetCard bet={bet} />
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalBets)} of {totalBets} bets
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) onPageChange(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                // Show first page, last page, and pages around current page
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onPageChange(page)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                // Show ellipsis for breaks in page numbers
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }
                return null
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) onPageChange(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  )
}

