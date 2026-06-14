'use client'

import { useState } from 'react'
import { Check, Star, Crown, X } from 'lucide-react'
import type { Plan } from '@/types'

interface Props {
  plans: Plan[]
}

const durationLabel: Record<string, string> = {
  daily: '/day',
  weekly: '/week',
  monthly: '/month',
}

function daysLabel(plan: Plan): string {
  if (plan.duration === 'daily') return 'Per day'
  if (plan.duration === 'weekly') return `${plan.days_count ?? 7} days / week`
  if (plan.duration === 'monthly') return `${plan.days_count ?? 30} days / month`
  return ''
}

export default function PlansSection({ plans }: Props) {
  const [selected, setSelected] = useState<Plan | null>(null)
  const regularPlans = plans.filter((p) => !p.is_custom)

  return (
    <>
      <section id="plans" className="py-24 px-4 bg-slate-50 dark:bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-600 dark:text-green-500 text-sm font-semibold uppercase tracking-widest mb-3">
              Subscription Plans
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
              Pick Your Perfect Plan
            </h2>
            <p className="text-slate-500 dark:text-gray-400 mt-4 max-w-lg mx-auto">
              Commit to a healthier you. Cancel or change anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {regularPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onClick={() => setSelected(plan)} />
            ))}
          </div>

          {/* Custom / Premium CTA */}
          <div className="relative bg-gradient-to-br from-white dark:from-[#1a1a1a] to-green-50 dark:to-[#0f1f0f] border border-green-200 dark:border-green-600/30 rounded-2xl p-8 md:p-10 overflow-hidden shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-lime-100 dark:bg-lime-400/10 border border-lime-300 dark:border-lime-400/30 text-lime-700 dark:text-lime-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    Premium Custom
                  </span>
                  <Crown size={16} className="text-lime-600 dark:text-lime-400" />
                </div>
                <h3 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-black mb-2">
                  Build Your Own Plan
                </h3>
                <p className="text-slate-500 dark:text-gray-400 max-w-md">
                  Hand-pick every salad in your plan — choose ingredients, portions, and
                  delivery days. Fully personalised, premium experience.
                </p>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Choose every salad yourself',
                    'Custom ingredients & portions',
                    'Flexible delivery schedule',
                    'Dedicated nutrition support',
                    'Premium packaging',
                    'Priority delivery',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
                      <Check size={14} className="text-lime-600 dark:text-lime-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#contact"
                className="shrink-0 bg-lime-500 hover:bg-lime-400 text-black font-black px-8 py-4 rounded-xl text-base transition-all hover:scale-105 whitespace-nowrap"
              >
                Contact Us →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Plan detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-xl dark:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-[#2a2a2a]">
              <div>
                {selected.is_popular && (
                  <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full mb-2 w-fit">
                    <Star size={10} fill="white" /> Most Popular
                  </span>
                )}
                <h3 className="text-slate-900 dark:text-white font-black text-xl">{selected.name}</h3>
                <p className="text-slate-400 dark:text-gray-500 text-xs mt-0.5">{daysLabel(selected)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2a]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Price */}
              <div>
                <span className="text-slate-900 dark:text-white text-4xl font-black">₹{selected.price}</span>
                <span className="text-slate-400 dark:text-gray-500 text-sm ml-1">{durationLabel[selected.duration]}</span>
              </div>

              {/* Description */}
              {selected.description && (
                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{selected.description}</p>
              )}

              {/* Features */}
              {selected.features.length > 0 && (
                <ul className="space-y-2.5">
                  {selected.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-gray-300">
                      <Check size={14} className="text-green-600 dark:text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <a
                href="#contact"
                onClick={() => setSelected(null)}
                className={`block w-full text-center font-bold py-3 rounded-xl transition-all ${
                  selected.is_popular
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-slate-100 dark:bg-[#1a1a1a] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2a2a2a]'
                }`}
              >
                Get Started →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function PlanCard({ plan, onClick }: { plan: Plan; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white dark:bg-[#111111] rounded-2xl p-7 flex flex-col border transition-all duration-200 hover:border-green-500 dark:hover:border-green-600/50 shadow-sm dark:shadow-none cursor-pointer ${
        plan.is_popular
          ? 'border-green-500 dark:border-green-600 green-glow'
          : 'border-slate-200 dark:border-[#2a2a2a]'
      }`}
    >
      {plan.is_popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            <Star size={10} fill="white" />
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <span className="text-green-600 dark:text-green-500 text-xs font-black uppercase tracking-widest">
          {plan.name}
        </span>
        <p className="text-slate-400 dark:text-gray-500 text-xs mt-0.5 font-medium">{daysLabel(plan)}</p>
        {plan.description && (
          <p className="text-slate-500 dark:text-gray-500 text-sm mt-2">{plan.description}</p>
        )}
      </div>

      <div className="mb-6">
        <span className="text-slate-900 dark:text-white text-4xl font-black">₹{plan.price}</span>
        <span className="text-slate-400 dark:text-gray-500 text-sm ml-1">{durationLabel[plan.duration]}</span>
      </div>

      <ul className="flex-1 space-y-2.5 mb-8">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-gray-300">
            <Check size={14} className="text-green-600 dark:text-green-500 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <span
        className={`block text-center font-bold py-3 rounded-xl transition-all ${
          plan.is_popular
            ? 'bg-green-600 hover:bg-green-500 text-white'
            : 'bg-slate-100 dark:bg-[#1a1a1a] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-700 dark:text-white border border-slate-200 dark:border-[#2a2a2a] hover:border-green-500 dark:hover:border-green-600/50'
        }`}
      >
        View Details
      </span>
    </div>
  )
}
