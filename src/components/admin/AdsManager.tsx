'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Ad } from '@/types'

interface Props {
  initialAds: Ad[]
}

const COLORS = [
  { label: 'Green', value: '#22c55e' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Yellow', value: '#eab308' },
]

const emptyAd = (): Omit<Ad, 'id' | 'created_at'> => ({
  title: '',
  subtitle: null,
  discount_text: null,
  bg_color: '#22c55e',
  is_active: true,
  expires_at: null,
})

export default function AdsManager({ initialAds }: Props) {
  const [ads, setAds] = useState<Ad[]>(initialAds)
  const [form, setForm] = useState(emptyAd())
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [expiryDate, setExpiryDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function isExpired(ad: Ad) {
    if (!ad.expires_at) return false
    return new Date(ad.expires_at) < new Date()
  }

  function openNew() {
    setForm(emptyAd())
    setExpiryDate('')
    setEditId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(a: Ad) {
    setForm({ title: a.title, subtitle: a.subtitle, discount_text: a.discount_text, bg_color: a.bg_color, is_active: a.is_active, expires_at: a.expires_at })
    setExpiryDate(a.expires_at ? a.expires_at.slice(0, 10) : '')
    setEditId(a.id)
    setShowForm(true)
    setError('')
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required.'); return }
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      expires_at: expiryDate ? new Date(expiryDate + 'T23:59:59').toISOString() : null,
    }

    if (editId) {
      const { data, error: e } = await supabase.from('ads').update(payload).eq('id', editId).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setAds((prev) => prev.map((x) => (x.id === editId ? (data as Ad) : x)))
    } else {
      const { data, error: e } = await supabase.from('ads').insert(payload).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setAds((prev) => [data as Ad, ...prev])
    }

    setSaving(false)
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this ad?')) return
    await supabase.from('ads').delete().eq('id', id)
    setAds((prev) => prev.filter((a) => a.id !== id))
  }

  async function toggleActive(a: Ad) {
    const { data } = await supabase.from('ads').update({ is_active: !a.is_active }).eq('id', a.id).select().single()
    if (data) setAds((prev) => prev.map((x) => (x.id === a.id ? (data as Ad) : x)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-black text-xl">Ads & Offers</h2>
          <p className="text-gray-500 text-sm">{ads.length} items</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add Ad
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#2a2a2a]">
              <h3 className="text-white font-black">{editId ? 'Edit Ad' : 'Create Ad'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              <Field label="Title *">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Summer Special Offer!" className={inputCls} />
              </Field>

              <Field label="Subtitle (optional)">
                <input value={form.subtitle ?? ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value || null })} placeholder="Get fresh salads delivered" className={inputCls} />
              </Field>

              <Field label="Discount Label (optional)">
                <input value={form.discount_text ?? ''} onChange={(e) => setForm({ ...form, discount_text: e.target.value || null })} placeholder="20% OFF" className={inputCls} />
              </Field>

              <Field label="Expires On (optional)">
                <input type="date" value={expiryDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setExpiryDate(e.target.value)} className={inputCls} />
                <p className="text-gray-600 text-xs mt-1">Leave blank for no expiry.</p>
              </Field>

              <Field label="Accent Color">
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm({ ...form, bg_color: c.value })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${form.bg_color === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </Field>

              {/* Preview */}
              <div className="rounded-xl px-4 py-3 flex items-center gap-3 border" style={{ borderColor: form.bg_color + '44', backgroundColor: form.bg_color + '11' }}>
                <div className="text-xs font-bold" style={{ color: form.bg_color }}>Preview →</div>
                <div>
                  <p className="text-white font-bold text-sm">{form.title || 'Ad Title'}</p>
                  {form.subtitle && <p className="text-gray-400 text-xs">{form.subtitle}</p>}
                </div>
                {form.discount_text && (
                  <span className="ml-auto text-xs font-black px-2 py-1 rounded-md" style={{ backgroundColor: form.bg_color + '22', color: form.bg_color }}>
                    {form.discount_text}
                  </span>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-green-500" />
                <span className="text-gray-300 text-sm">Active (visible on website)</span>
              </label>

              {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                  {saving ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-3.5 h-3.5" /> : <Check size={14} />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {ads.length === 0 ? (
        <div className="text-center py-16 text-gray-500 border border-dashed border-[#2a2a2a] rounded-2xl">
          No ads yet. Create your first offer!
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map((a) => {
            const expired = isExpired(a)
            return (
              <div key={a.id} className={`flex items-center gap-4 bg-[#111111] border rounded-xl p-4 ${expired ? 'opacity-50 border-[#2a2a2a]' : 'border-[#2a2a2a]'}`}>
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center" style={{ backgroundColor: a.bg_color + '22' }}>
                  <span className="text-lg" style={{ color: a.bg_color }}>%</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold text-sm">{a.title}</span>
                    {a.discount_text && (
                      <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: a.bg_color + '22', color: a.bg_color }}>{a.discount_text}</span>
                    )}
                    {expired && <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">Expired</span>}
                  </div>
                  {a.subtitle && <p className="text-gray-500 text-xs truncate">{a.subtitle}</p>}
                  {a.expires_at && (
                    <p className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      Expires {new Date(a.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(a)}
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors ${a.is_active && !expired ? 'bg-green-600/10 text-green-400 border-green-600/30 hover:bg-green-600/20' : 'bg-[#1a1a1a] text-gray-500 border-[#2a2a2a] hover:border-gray-500'}`}
                  >
                    {a.is_active && !expired ? 'Live' : 'Off'}
                  </button>
                  <button onClick={() => openEdit(a)} className="text-gray-500 hover:text-white p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(a.id)} className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600 transition-colors'
