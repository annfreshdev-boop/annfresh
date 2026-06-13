'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Leaf } from 'lucide-react'

const links = [
  { label: 'Menu', href: '#salads' },
  { label: 'Plans', href: '#plans' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur border-b border-[#2a2a2a]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <span className="bg-green-600 p-1.5 rounded-lg">
            <Leaf size={18} className="text-white" />
          </span>
          <span className="text-white font-black text-xl tracking-tight">
            Ann<span className="text-green-500">fresh</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#plans"
            className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#111111] border-b border-[#2a2a2a] px-4 pb-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-gray-300 hover:text-white font-medium border-b border-[#2a2a2a] last:border-0"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#plans"
            onClick={() => setOpen(false)}
            className="block mt-3 bg-green-600 text-white text-center font-semibold py-2.5 rounded-lg"
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  )
}
