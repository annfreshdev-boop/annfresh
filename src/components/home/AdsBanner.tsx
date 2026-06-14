'use client'

import { useState } from 'react'
import { Tag, X, Clock } from 'lucide-react'
import type { Ad } from '@/types'

interface Props {
  ads: Ad[]
}

export default function AdsBanner({ ads }: Props) {
  const [selected, setSelected] = useState<Ad | null>(null)

  if (ads.length === 0) return null

  const items = [...ads, ...ads]

  return (
    <>
      <section className="relative overflow-hidden py-4 bg-slate-50 dark:bg-[#111111] border-y border-slate-200 dark:border-[#2a2a2a] group">
        <div className="flex animate-marquee gap-4 w-max group-hover:[animation-play-state:paused]">
          {items.map((ad, i) => (
            <div
              key={`${ad.id}-${i}`}
              onClick={() => setSelected(ad)}
              className="flex items-center gap-3 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] rounded-xl px-5 py-3 min-w-max shadow-sm dark:shadow-none cursor-pointer hover:border-green-500/50 dark:hover:border-green-600/30 transition-colors"
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ backgroundColor: ad.bg_color + '22', color: ad.bg_color }}
              >
                <Tag size={14} />
              </span>
              <div>
                <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight">{ad.title}</p>
                {ad.subtitle && (
                  <p className="text-slate-500 dark:text-gray-400 text-xs">{ad.subtitle}</p>
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

      {selected && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] rounded-2xl w-full max-w-sm shadow-xl dark:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{ backgroundColor: selected.bg_color + '22', color: selected.bg_color }}
                >
                  <Tag size={18} />
                </span>
                <h3 className="text-slate-900 dark:text-white font-black text-lg">{selected.title}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2a]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {selected.discount_text && (
                <div
                  className="inline-block text-3xl font-black px-5 py-2 rounded-xl"
                  style={{ backgroundColor: selected.bg_color + '22', color: selected.bg_color }}
                >
                  {selected.discount_text}
                </div>
              )}
              {selected.subtitle && (
                <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{selected.subtitle}</p>
              )}
              {selected.expires_at && (
                <div className="flex items-center gap-2 text-slate-400 dark:text-gray-500 text-sm">
                  <Clock size={14} />
                  Expires {new Date(selected.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
              <a
                href="#contact"
                onClick={() => setSelected(null)}
                className="block w-full text-center font-bold py-3 rounded-xl text-white transition-all hover:opacity-90 mt-2"
                style={{ backgroundColor: selected.bg_color }}
              >
                Claim This Offer →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
