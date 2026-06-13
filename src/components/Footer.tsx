import { Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a] py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="bg-green-600 p-1.5 rounded-lg">
            <Leaf size={16} className="text-white" />
          </span>
          <span className="text-white font-black text-lg tracking-tight">
            Ann<span className="text-green-500">fresh</span>
          </span>
        </div>

        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#salads" className="hover:text-white transition-colors">Menu</a>
          <a href="#plans" className="hover:text-white transition-colors">Plans</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <a href="/admin" className="hover:text-white transition-colors">Admin</a>
        </div>

        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} Annfresh. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
