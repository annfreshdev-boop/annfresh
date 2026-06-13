import { Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-[#2a2a2a] py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="bg-green-600 p-1.5 rounded-lg">
            <Leaf size={16} className="text-white" />
          </span>
          <span className="text-slate-900 dark:text-white font-black text-lg tracking-tight">
            Ann<span className="text-green-600">fresh</span>
          </span>
        </div>

        <div className="flex gap-6 text-sm text-slate-500 dark:text-gray-500">
          <a href="#salads" className="hover:text-slate-900 dark:hover:text-white transition-colors">Menu</a>
          <a href="#plans" className="hover:text-slate-900 dark:hover:text-white transition-colors">Plans</a>
          <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          <a href="/admin" className="hover:text-slate-900 dark:hover:text-white transition-colors">Admin</a>
        </div>

        <p className="text-slate-400 dark:text-gray-600 text-xs">
          © {new Date().getFullYear()} Annfresh. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
