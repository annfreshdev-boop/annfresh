'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Flame, Leaf } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Salad } from '@/types'

interface Props {
  initialSalads: Salad[]
}

const empty = (): Omit<Salad, 'id' | 'created_at'> => ({
  name: '',
  type: 'veg',
  description: '',
  ingredients: [],
  calories: 0,
  price: 0,
  image_url: null,
  is_active: true,
})

export default function SaladsManager({ initialSalads }: Props) {
  const [salads, setSalads] = useState<Salad[]>(initialSalads)
  const [form, setForm] = useState(empty())
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [ingredientsRaw, setIngredientsRaw] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openNew() {
    setForm(empty())
    setIngredientsRaw('')
    setEditId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(s: Salad) {
    setForm({ name: s.name, type: s.type, description: s.description, ingredients: s.ingredients, calories: s.calories, price: s.price, image_url: s.image_url, is_active: s.is_active })
    setIngredientsRaw(s.ingredients.join(', '))
    setEditId(s.id)
    setShowForm(true)
    setError('')
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Name is required.'); return }
    setSaving(true)
    setError('')

    const payload = { ...form, ingredients: ingredientsRaw.split(',').map((i) => i.trim()).filter(Boolean) }

    if (editId) {
      const { data, error: e } = await supabase.from('salads').update(payload).eq('id', editId).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setSalads((prev) => prev.map((s) => (s.id === editId ? (data as Salad) : s)))
    } else {
      const { data, error: e } = await supabase.from('salads').insert(payload).select().single()
      if (e) { setError(e.message); setSaving(false); return }
      setSalads((prev) => [data as Salad, ...prev])
    }

    setSaving(false)
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this salad?')) return
    await supabase.from('salads').delete().eq('id', id)
    setSalads((prev) => prev.filter((s) => s.id !== id))
  }

  async function toggleActive(s: Salad) {
    const { data } = await supabase.from('salads').update({ is_active: !s.is_active }).eq('id', s.id).select().single()
    if (data) setSalads((prev) => prev.map((x) => (x.id === s.id ? (data as Salad) : x)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-black text-xl">Salads</h2>
          <p className="text-gray-500 text-sm">{salads.length} items</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> Add Salad
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#2a2a2a]">
              <h3 className="text-white font-black">{editId ? 'Edit Salad' : 'Add Salad'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              <Field label="Name">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Caesar Salad" className={input} />
              </Field>

              <Field label="Type">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'veg' | 'non-veg' })} className={input}>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </Field>

              <Field label="Description">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="A refreshing mix of..." className={input + ' resize-none'} />
              </Field>

              <Field label="Ingredients (comma separated)">
                <input value={ingredientsRaw} onChange={(e) => setIngredientsRaw(e.target.value)} placeholder="Lettuce, Tomato, Croutons" className={input} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Calories (kcal)">
                  <input type="number" value={form.calories || ''} onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })} placeholder="320" className={input} />
                </Field>
                <Field label="Price (₹)">
                  <input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="199" className={input} />
                </Field>
              </div>

              <Field label="Image URL (optional)">
                <input value={form.image_url ?? ''} onChange={(e) => setForm({ ...form, image_url: e.target.value || null })} placeholder="https://..." className={input} />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-green-500" />
                <span className="text-gray-300 text-sm">Active (visible on website)</span>
              </label>

              {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                  {saving ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-3.5 h-3.5" /> : <Check size={14} />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {salads.length === 0 ? (
        <div className="text-center py-16 text-gray-500 border border-dashed border-[#2a2a2a] rounded-2xl">
          No salads yet. Add your first one!
        </div>
      ) : (
        <div className="space-y-3">
          {salads.map((s) => (
            <div key={s.id} className="flex items-center gap-4 bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xl shrink-0">
                {s.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  '🥗'
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm truncate">{s.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${s.type === 'veg' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                    {s.type === 'veg' ? '🌿 Veg' : '🍗 Non-Veg'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  {s.calories > 0 && <span className="flex items-center gap-0.5"><Flame size={10} />{s.calories} kcal</span>}
                  {s.price > 0 && <span>₹{s.price}</span>}
                  {s.ingredients?.length > 0 && <span>{s.ingredients.length} ingredients</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(s)}
                  title={s.is_active ? 'Hide from site' : 'Show on site'}
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors ${s.is_active ? 'bg-green-600/10 text-green-400 border-green-600/30 hover:bg-green-600/20' : 'bg-[#1a1a1a] text-gray-500 border-[#2a2a2a] hover:border-gray-500'}`}
                >
                  {s.is_active ? 'Live' : 'Hidden'}
                </button>
                <button onClick={() => openEdit(s)} className="text-gray-500 hover:text-white p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(s.id)} className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
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

const input = 'w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600 transition-colors'
