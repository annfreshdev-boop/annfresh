'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Leaf, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

const links = [
  { label: 'Menu', href: '#salads' },
  { label: 'Plans', href: '#plans' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur border-b border-slate-200 dark:border-[#2a2a2a]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <span className="bg-green-600 p-1.5 rounded-lg">
            <Leaf size={18} className="text-white" />
          </span>
          <span className="text-slate-900 dark:text-white font-black text-xl tracking-tight">
            Ann<span className="text-green-600">fresh</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a1a1a] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          <a
            href="#plans"
            className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-slate-500 dark:text-gray-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a1a1a] transition-colors"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}
          <button
            className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-[#111111] border-b border-slate-200 dark:border-[#2a2a2a] px-4 pb-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white font-medium border-b border-slate-100 dark:border-[#2a2a2a] last:border-0"
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
