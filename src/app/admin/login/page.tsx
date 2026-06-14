'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Eye, EyeOff, LogIn, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/admin')
    })
  }, [router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Invalid email or password.')
      setLoading(false)
    } else {
      router.replace('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center px-4 transition-colors">
      {/* Theme toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="fixed top-4 right-4 text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-white p-2 rounded-lg bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] shadow-sm dark:shadow-none transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 dark:bg-green-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="bg-green-600 p-2 rounded-xl">
              <Leaf size={20} className="text-white" />
            </span>
            <span className="text-slate-900 dark:text-white font-black text-2xl">
              Ann<span className="text-green-600 dark:text-green-500">fresh</span>
            </span>
          </div>
          <p className="text-slate-400 dark:text-gray-500 text-sm">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] rounded-2xl p-8 shadow-sm dark:shadow-none">
          <h1 className="text-slate-900 dark:text-white font-black text-2xl mb-1">Welcome back</h1>
          <p className="text-slate-500 dark:text-gray-500 text-sm mb-7">Sign in to manage your store</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-slate-500 dark:text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@annfresh.com"
                className={inp}
              />
            </div>

            <div>
              <label className="text-slate-500 dark:text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={inp + ' pr-12'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {loading
                ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />
                : <LogIn size={16} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 dark:text-gray-600 text-xs mt-6">
          <a href="/" className="hover:text-slate-700 dark:hover:text-gray-400 transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  )
}

const inp = 'w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 dark:focus:border-green-600 transition-colors'
