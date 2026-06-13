'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, LogOut, Salad, Tag, Settings, ExternalLink, CalendarDays } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import SaladsManager from '@/components/admin/SaladsManager'
import AdsManager from '@/components/admin/AdsManager'
import PlansManager from '@/components/admin/PlansManager'
import SettingsManager from '@/components/admin/SettingsManager'
import type { Salad as SaladType, Ad, Plan, Setting } from '@/types'

type Tab = 'salads' | 'plans' | 'ads' | 'settings'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'salads', label: 'Salads', icon: <Salad size={16} /> },
  { id: 'plans', label: 'Plans', icon: <CalendarDays size={16} /> },
  { id: 'ads', label: 'Ads & Offers', icon: <Tag size={16} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('salads')
  const [loading, setLoading] = useState(true)
  const [salads, setSalads] = useState<SaladType[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [settings, setSettings] = useState<Setting[]>([])

  useEffect(() => {
    async function init() {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) { router.replace('/admin/login'); return }

      const [s, a, p, st] = await Promise.all([
        supabase.from('salads').select('*').order('created_at', { ascending: false }),
        supabase.from('ads').select('*').order('created_at', { ascending: false }),
        supabase.from('plans').select('*').order('price', { ascending: true }),
        supabase.from('settings').select('*'),
      ])

      setSalads((s.data ?? []) as SaladType[])
      setAds((a.data ?? []) as Ad[])
      setPlans((p.data ?? []) as Plan[])
      setSettings((st.data ?? []) as Setting[])
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <span className="animate-spin border-2 border-gray-600 border-t-green-500 rounded-full w-5 h-5" />
          Loading...
        </div>
      </div>
    )
  }

  const activePlans = plans.filter((p) => p.is_active).length
  const activeAds = ads.filter((a) => a.is_active && (!a.expires_at || new Date(a.expires_at) > new Date())).length

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top bar */}
      <header className="bg-[#111111] border-b border-[#2a2a2a] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <span className="bg-green-600 p-1.5 rounded-lg">
              <Leaf size={16} className="text-white" />
            </span>
            <span className="text-white font-black text-lg">
              Ann<span className="text-green-500">fresh</span>
            </span>
            <span className="text-gray-600 text-sm hidden sm:block">/ Admin</span>
          </div>

          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-medium transition-colors">
              <ExternalLink size={13} /> View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-xs font-medium transition-colors border border-[#2a2a2a] hover:border-red-400/30 px-3 py-1.5 rounded-lg"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Salads" value={salads.length} sub={`${salads.filter((s) => s.is_active).length} active`} />
          <StatCard label="Active Plans" value={activePlans} sub={`${plans.length} total`} />
          <StatCard label="Active Ads" value={activeAds} sub={`${ads.length} total`} />
          <StatCard label="WhatsApp" value={1} sub="Configurable in Settings" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#111111] border border-[#2a2a2a] p-1 rounded-xl mb-8 w-fit flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'salads' && <SaladsManager initialSalads={salads} />}
        {tab === 'plans' && <PlansManager initialPlans={plans} />}
        {tab === 'ads' && <AdsManager initialAds={ads} />}
        {tab === 'settings' && <SettingsManager initialSettings={settings} />}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, className = '' }: { label: string; value: number; sub: string; className?: string }) {
  return (
    <div className={`bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 ${className}`}>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-black text-3xl">{value}</p>
      <p className="text-gray-500 text-xs mt-1">{sub}</p>
    </div>
  )
}
