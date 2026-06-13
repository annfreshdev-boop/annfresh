import { Check, Star, Crown } from 'lucide-react'
import type { Plan } from '@/types'

interface Props {
  plans: Plan[]
}

const durationLabel: Record<string, string> = {
  daily: '/day',
  weekly: '/week',
  monthly: '/month',
}

const durationBadge: Record<string, string> = {
  daily: 'DAILY',
  weekly: 'WEEKLY',
  monthly: 'MONTHLY',
}

export default function PlansSection({ plans }: Props) {
  const regularPlans = plans.filter((p) => !p.is_custom)

  return (
    <section id="plans" className="py-24 px-4 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-green-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Subscription Plans
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Pick Your Perfect Plan
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto">
            Commit to a healthier you. Cancel or change anytime.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {regularPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Custom / Premium CTA */}
        <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f1f0f] border border-green-600/30 rounded-2xl p-8 md:p-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Premium Custom
                </span>
                <Crown size={16} className="text-lime-400" />
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-black mb-2">
                Build Your Own Plan
              </h3>
              <p className="text-gray-400 max-w-md">
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
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={14} className="text-lime-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="#contact"
              className="shrink-0 bg-lime-400 hover:bg-lime-300 text-black font-black px-8 py-4 rounded-xl text-base transition-all hover:scale-105 whitespace-nowrap"
            >
              Contact Us →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative bg-[#111111] rounded-2xl p-7 flex flex-col border transition-all duration-200 hover:border-green-600/50 ${
        plan.is_popular
          ? 'border-green-600 green-glow'
          : 'border-[#2a2a2a]'
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
        <span className="text-green-500 text-xs font-black uppercase tracking-widest">
          {durationBadge[plan.duration]}
        </span>
        <h3 className="text-white text-xl font-black mt-1">{plan.name}</h3>
        <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
      </div>

      <div className="mb-6">
        <span className="text-white text-4xl font-black">₹{plan.price}</span>
        <span className="text-gray-500 text-sm ml-1">{durationLabel[plan.duration]}</span>
      </div>

      <ul className="flex-1 space-y-2.5 mb-8">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
            <Check size={14} className="text-green-500 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className={`block text-center font-bold py-3 rounded-xl transition-all ${
          plan.is_popular
            ? 'bg-green-600 hover:bg-green-500 text-white'
            : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-[#2a2a2a] hover:border-green-600/50'
        }`}
      >
        Get Started
      </a>
    </div>
  )
}
