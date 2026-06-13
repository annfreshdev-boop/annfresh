'use client'

import { useState } from 'react'
import { Save, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Setting } from '@/types'

interface Props {
  initialSettings: Setting[]
}

export default function SettingsManager({ initialSettings }: Props) {
  const [whatsapp, setWhatsapp] = useState(
    initialSettings.find((s) => s.key === 'whatsapp_number')?.value ?? ''
  )
  const [email, setEmail] = useState(
    initialSettings.find((s) => s.key === 'store_email')?.value ?? ''
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError('')

    const updates = [
      { key: 'whatsapp_number', value: whatsapp.trim() },
      { key: 'store_email', value: email.trim() },
    ]

    for (const u of updates) {
      const { error: e } = await supabase
        .from('settings')
        .upsert({ key: u.key, value: u.value }, { onConflict: 'key' })
      if (e) { setError(e.message); setSaving(false); return }
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-black text-xl">Settings</h2>
        <p className="text-gray-500 text-sm">Store-wide configuration</p>
      </div>

      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 max-w-xl space-y-5">
        <div>
          <label className="text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">
            WhatsApp Number
          </label>
          <div className="flex gap-2">
            <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 px-3 rounded-lg text-sm flex items-center">+91</span>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="9876543210"
              maxLength={10}
              className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>
          <p className="text-gray-600 text-xs mt-1">This number is shown as the WhatsApp contact on your website.</p>
        </div>

        <div>
          <label className="text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">
            Contact Form Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@annfresh.com"
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600 transition-colors"
          />
          <p className="text-gray-600 text-xs mt-1">
            Update the email in your contact form&apos;s action URL in ContactSection.tsx to match.
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {saving ? (
            <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-3.5 h-3.5" />
          ) : saved ? (
            <Check size={14} />
          ) : (
            <Save size={14} />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
