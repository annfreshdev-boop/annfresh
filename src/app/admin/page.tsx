'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Leaf, LogOut, Salad, Tag, Settings, ExternalLink, CalendarDays, TrendingUp, Sun, Moon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import SaladsManager from '@/components/admin/SaladsManager'
import AdsManager from '@/components/admin/AdsManager'
import PlansManager from '@/components/admin/PlansManager'
import SettingsManager from '@/components/admin/SettingsManager'
import type { Salad as SaladType, Ad, Plan, Setting } from '@/types'

type Tab = 'salads' | 'plans' | 'ads' | 'settings'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'salads',   label: 'Salads',      icon: <Salad size={16} /> },
  { id: 'plans',    label: 'Plans',        icon: <CalendarDays size={16} /> },
  { id: 'ads',      label: 'Ads & Offers', icon: <Tag size={16} /> },
  { id: 'settings', label: 'Settings',     icon: <Settings size={16} /> },
]

export default function AdminDashboard() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState<Tab>('salads')
  const [loading, setLoading] = useState(true)
  const [salads, setSalads] = useState<SaladType[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [settings, setSettings] = useState<Setting[]>([])
  const [visits, setVisits] = useState({ total: 0, today: 0, week: 0 })

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    async function init() {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) { router.replace('/admin/login'); return }

      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7)

      const [s, a, p, st, vTotal, vToday, vWeek] = await Promise.all([
        supabase.from('salads').select('*').order('created_at', { ascending: false }),
        supabase.from('ads').select('*').order('created_at', { ascending: false }),
        supabase.from('plans').select('*').order('price', { ascending: true }),
        supabase.from('settings').select('*'),
        supabase.from('page_visits').select('*', { count: 'exact', head: true }),
        supabase.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', todayStart.toISOString()),
        supabase.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', weekStart.toISOString()),
      ])

      setSalads((s.data ?? []) as SaladType[])
      setAds((a.data ?? []) as Ad[])
      setPlans((p.data ?? []) as Plan[])
      setSettings((st.data ?? []) as Setting[])
      setVisits({ total: vTotal.count ?? 0, today: vToday.count ?? 0, week: vWeek.count ?? 0 })
      setLoading(false)
    }
    init()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center transition-colors">
        <div className="flex items-center gap-3 text-slate-400 dark:text-gray-400">
          <span className="animate-spin border-2 border-slate-300 dark:border-gray-600 border-t-green-500 rounded-full w-5 h-5" />
          Loading...
        </div>
      </div>
    )
  }

  const activePlans = plans.filter((p) => p.is_active).length
  const activeAds = ads.filter((a) => a.is_active && (!a.expires_at || new Date(a.expires_at) > new Date())).length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors">
      {/* Top bar */}
      <header className="bg-white dark:bg-[#111111] border-b border-slate-200 dark:border-[#2a2a2a] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <span className="bg-green-600 p-1.5 rounded-lg">
              <Leaf size={16} className="text-white" />
            </span>
            <span className="text-slate-900 dark:text-white font-black text-lg">
              Ann<span className="text-green-600 dark:text-green-500">fresh</span>
            </span>
            <span className="text-slate-400 dark:text-gray-600 text-sm hidden sm:block">/ Admin</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a1a1a] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white text-xs font-medium transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a1a1a]"
            >
              <ExternalLink size={13} /> View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-slate-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xs font-medium transition-colors border border-slate-200 dark:border-[#2a2a2a] hover:border-red-200 dark:hover:border-red-400/30 px-3 py-1.5 rounded-lg"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Visit counter */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-green-600/10 dark:to-[#111111] border border-slate-200 dark:border-green-600/20 rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-6 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-600/20 border border-green-200 dark:border-green-600/30 p-2.5 rounded-xl">
              <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Page Visits</p>
              <p className="text-slate-900 dark:text-white font-black text-2xl">{visits.total.toLocaleString()}</p>
              <p className="text-slate-400 dark:text-gray-500 text-xs">all time</p>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-[#2a2a2a] hidden sm:block" />
          <div>
            <p className="text-slate-400 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Today</p>
            <p className="text-slate-900 dark:text-white font-bold text-xl">{visits.today.toLocaleString()}</p>
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-[#2a2a2a] hidden sm:block" />
          <div>
            <p className="text-slate-400 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Last 7 Days</p>
            <p className="text-slate-900 dark:text-white font-bold text-xl">{visits.week.toLocaleString()}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Salads" value={salads.length} sub={`${salads.filter((s) => s.is_active).length} active`} />
          <StatCard label="Active Plans" value={activePlans} sub={`${plans.length} total`} />
          <StatCard label="Active Ads" value={activeAds} sub={`${ads.length} total`} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] p-1 rounded-xl mb-8 w-fit flex-wrap shadow-sm dark:shadow-none">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-green-600 text-white'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a1a1a]'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'salads'   && <SaladsManager initialSalads={salads} />}
        {tab === 'plans'    && <PlansManager initialPlans={plans} />}
        {tab === 'ads'      && <AdsManager initialAds={ads} />}
        {tab === 'settings' && <SettingsManager initialSettings={settings} />}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] rounded-xl p-5 shadow-sm dark:shadow-none">
      <p className="text-slate-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-slate-900 dark:text-white font-black text-3xl">{value}</p>
      <p className="text-slate-400 dark:text-gray-500 text-xs mt-1">{sub}</p>
    </div>
  )
}
