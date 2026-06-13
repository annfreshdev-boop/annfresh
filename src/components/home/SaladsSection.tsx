'use client'

import { useState } from 'react'
import { Flame, Leaf } from 'lucide-react'
import Image from 'next/image'
import type { Salad } from '@/types'

const FILTERS = ['All', 'Veg', 'Non-Veg'] as const
type Filter = (typeof FILTERS)[number]

interface Props {
  salads: Salad[]
}

export default function SaladsSection({ salads }: Props) {
  const [filter, setFilter] = useState<Filter>('All')

  const visible = salads.filter((s) => {
    if (filter === 'Veg') return s.type === 'veg'
    if (filter === 'Non-Veg') return s.type === 'non-veg'
    return true
  })

  return (
    <section id="salads" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-green-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Our Menu
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Crafted for Every Craving
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto">
            Hand-picked ingredients, bold flavours — every salad is a complete meal.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No salads available right now.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((salad) => (
              <SaladCard key={salad.id} salad={salad} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function SaladCard({ salad }: { salad: Salad }) {
  const isVeg = salad.type === 'veg'

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden card-hover">
      {/* Image / placeholder */}
      <div className="relative h-52 bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
        {salad.image_url ? (
          <Image
            src={salad.image_url}
            alt={salad.name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-7xl select-none">🥗</span>
        )}
        <span
          className={`absolute top-3 left-3 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
            isVeg
              ? 'bg-green-600/20 text-green-400 border border-green-600/30'
              : 'bg-red-600/20 text-red-400 border border-red-600/30'
          }`}
        >
          <Leaf size={10} />
          {isVeg ? 'Veg' : 'Non-Veg'}
        </span>
        {salad.calories && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-orange-400 text-xs font-bold px-2 py-1 rounded-full border border-orange-600/20">
            <Flame size={10} />
            {salad.calories} kcal
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-bold text-lg leading-tight">{salad.name}</h3>
          {salad.price > 0 && (
            <span className="text-green-400 font-black text-lg whitespace-nowrap">
              ₹{salad.price}
            </span>
          )}
        </div>

        {salad.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{salad.description}</p>
        )}

        {salad.ingredients?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {salad.ingredients.slice(0, 4).map((ing) => (
              <span
                key={ing}
                className="text-xs bg-[#2a2a2a] text-gray-400 px-2 py-0.5 rounded-full"
              >
                {ing}
              </span>
            ))}
            {salad.ingredients.length > 4 && (
              <span className="text-xs text-gray-500">+{salad.ingredients.length - 4} more</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
