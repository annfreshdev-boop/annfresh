'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Plan } from '@/types'

interface Props {
  initialPlans: Plan[]
}

const emptyPlan = (): Omit<Plan, 'id'> => ({
  name: '',
  duration: 'weekly',
  days_count: null,
  price: 0,
  description: '',
  features: [],
  is_custom: false,
  is_active: true,
  is_popular: false,
})

const durationHint: Record<string, string> = {
  daily: 'Typically 1 — leave blank to hide',
  weekly: 'e.g. 5 (Mon–Fri) or 7 (all week)',
  monthly: 'e.g. 20 (weekdays) or 26 or 30',
}

const durationSuffix: Record<string, string> = {
  daily: '/day',
  weekly: '/week',
  monthly: '/month',
}

export default function PlansManager({ initialPlans }: Props) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [form, setForm] = useState(emptyPlan())
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [featuresRaw, setFeaturesRaw] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openNew() {
    setForm(emptyPlan())
    setFeaturesRaw('')
    setEditId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(p: Plan) {
    setForm({ name: p.name, duration: p.duration, days_count: p.days_count, price: p.price, description: p.description, features: p.features, is_custom: p.is_custom, is_active: p.is_active, is_popular: p.is_popular })
    setFeaturesRaw(p.features.join('\n'))
    setEditId(p.id)
    setShowForm(true)
    setError('')
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Plan name is required.'); return }
    if (!form.price) { setError('Price is required.'); return }
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      features: featuresRaw.split('\n').map((f) => f.trim()).filter(Boolean),
      days_count: form.days_count || null,
    }

    if (editId) {
      const { data, error: e } = await supabase.from('plans').update(payload).eq('id', editId).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setPlans((prev) => prev.map((p) => (p.id === editId ? (data as Plan) : p)))
    } else {
      const { data, error: e } = await supabase.from('plans').insert(payload).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setPlans((prev) => [...prev, data as Plan])
    }

    setSaving(false)
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this plan?')) return
    await supabase.from('plans').delete().eq('id', id)
    setPlans((prev) => prev.filter((p) => p.id !== id))
  }

  async function toggleField(p: Plan, field: 'is_active' | 'is_popular') {
    const { data } = await supabase.from('plans').update({ [field]: !p[field] }).eq('id', p.id).select().single()
    if (data) setPlans((prev) => prev.map((x) => (x.id === p.id ? (data as Plan) : x)))
  }

  function daysLabel(p: Plan) {
    if (p.duration === 'daily') return 'Per day'
    if (p.duration === 'weekly') return `${p.days_count ?? 7} days/week`
    if (p.duration === 'monthly') return `${p.days_count ?? 30} days/month`
    return ''
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-black text-xl">Plans</h2>
          <p className="text-gray-500 text-sm">{plans.length} plans</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#2a2a2a]">
              <h3 className="text-white font-black">{editId ? 'Edit Plan' : 'Add Plan'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              <Field label="Plan Name *">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Weekly Wellness" className={inp} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Billing Cycle *">
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value as Plan['duration'], days_count: null })}
                    className={inp}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </Field>

                <Field label={`Days (${form.duration})`}>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={form.days_count ?? ''}
                    onChange={(e) => setForm({ ...form, days_count: e.target.value ? Number(e.target.value) : null })}
                    placeholder={form.duration === 'weekly' ? '5 or 7' : form.duration === 'monthly' ? '20 or 30' : '1'}
                    className={inp}
                  />
                  <p className="text-gray-600 text-xs mt-1">{durationHint[form.duration]}</p>
                </Field>
              </div>

              <Field label={`Price ₹ ${durationSuffix[form.duration]} *`}>
                <input
                  type="number"
                  min={0}
                  value={form.price || ''}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  placeholder="799"
                  className={inp}
                />
              </Field>

              <Field label="Description">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Short description shown on the plan card" className={inp + ' resize-none'} />
              </Field>

              <Field label="Features (one per line)">
                <textarea
                  value={featuresRaw}
                  onChange={(e) => setFeaturesRaw(e.target.value)}
                  rows={5}
                  placeholder={"7 salads per week\nFree delivery\nNutrition tracking"}
                  className={inp + ' resize-none font-mono text-xs leading-relaxed'}
                />
                <p className="text-gray-600 text-xs mt-1">Each line becomes a bullet point on the plan card.</p>
              </Field>

              <div className="flex gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-green-500" />
                  <span className="text-gray-300 text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} className="w-4 h-4 accent-green-500" />
                  <span className="text-gray-300 text-sm">Mark as Popular</span>
                </label>
              </div>

              {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                  {saving ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-3.5 h-3.5" /> : <Check size={14} />}
                  {saving ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {plans.length === 0 ? (
        <div className="text-center py-16 text-gray-500 border border-dashed border-[#2a2a2a] rounded-2xl">
          No plans yet. Add your first one!
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((p) => (
            <div key={p.id} className="flex items-center gap-4 bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
              <div className="w-10 h-10 bg-green-600/10 border border-green-600/20 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-green-500 text-xs font-black uppercase">
                  {p.duration === 'daily' ? 'D' : p.duration === 'weekly' ? 'W' : 'M'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-bold text-sm">{p.name}</span>
                  {p.is_popular && (
                    <span className="flex items-center gap-0.5 text-xs bg-green-600/20 text-green-400 border border-green-600/30 px-1.5 py-0.5 rounded-full">
                      <Star size={9} fill="currentColor" /> Popular
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  <span className="text-green-400 font-bold">₹{p.price}{durationSuffix[p.duration]}</span>
                  <span>{daysLabel(p)}</span>
                  <span>{p.features.length} features</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleField(p, 'is_active')}
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors ${p.is_active ? 'bg-green-600/10 text-green-400 border-green-600/30 hover:bg-green-600/20' : 'bg-[#1a1a1a] text-gray-500 border-[#2a2a2a] hover:border-gray-500'}`}
                >
                  {p.is_active ? 'Live' : 'Hidden'}
                </button>
                <button onClick={() => openEdit(p)} className="text-gray-500 hover:text-white p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
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

const inp = 'w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600 transition-colors'
