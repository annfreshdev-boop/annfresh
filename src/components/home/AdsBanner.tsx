'use client'

import { Tag } from 'lucide-react'
import type { Ad } from '@/types'

interface Props {
  ads: Ad[]
}

export default function AdsBanner({ ads }: Props) {
  if (ads.length === 0) return null

  // Duplicate for seamless loop
  const items = [...ads, ...ads]

  return (
    <section className="relative overflow-hidden py-4 bg-[#111111] border-y border-[#2a2a2a]">
      <div className="flex animate-marquee gap-4 w-max">
        {items.map((ad, i) => (
          <div
            key={`${ad.id}-${i}`}
            className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-5 py-3 min-w-max"
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ backgroundColor: ad.bg_color + '22', color: ad.bg_color }}
            >
              <Tag size={14} />
            </span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">{ad.title}</p>
              {ad.subtitle && (
                <p className="text-gray-400 text-xs">{ad.subtitle}</p>
              )}
            </div>
            {ad.discount_text && (
              <span
                className="ml-2 text-xs font-black px-2 py-1 rounded-md"
                style={{ backgroundColor: ad.bg_color + '22', color: ad.bg_color }}
              >
                {ad.discount_text}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
