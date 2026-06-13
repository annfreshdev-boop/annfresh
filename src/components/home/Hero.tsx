import { ArrowDown, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-white dark:bg-[#0a0a0a]">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(22,163,74,1) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/5 dark:bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-600/10 border border-green-200 dark:border-green-600/30 text-green-700 dark:text-green-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <Sparkles size={14} />
          Fresh Ingredients. Zero Compromise.
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight text-slate-900 dark:text-white mb-6">
          EAT{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-lime-500">
            FRESH.
          </span>
          <br />
          LIVE{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-500">
            BOLD.
          </span>
        </h1>

        <p className="text-slate-500 dark:text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
          Premium salads crafted with the freshest ingredients — built for your
          lifestyle with daily, weekly, and monthly plans.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#salads"
            className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:scale-105"
          >
            Explore Menu
          </a>
          <a
            href="#plans"
            className="border border-slate-200 dark:border-[#2a2a2a] hover:border-green-500 dark:hover:border-green-600 text-slate-700 dark:text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-600/5"
          >
            View Plans
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-8 text-sm text-slate-400 dark:text-gray-500">
          <span>🥗 100% Fresh</span>
          <span>⚡ Daily Delivery</span>
          <span>🌿 Veg & Non-Veg</span>
        </div>
      </div>

      <a
        href="#salads"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-300 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-500 animate-bounce transition-colors"
      >
        <ArrowDown size={24} />
      </a>
    </section>
  )
}
