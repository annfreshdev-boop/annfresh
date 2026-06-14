'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'

interface Props {
  whatsappNumber: string
}

export default function ContactSection({ whatsappNumber }: Props) {
  const waLink = `https://wa.me/91${whatsappNumber}?text=Hi%20Annfresh%2C%20I%20am%20interested%20in%20your%20salad%20plans!`

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone || 'Not provided',
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 px-4 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-green-600 dark:text-green-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
            Let&apos;s Talk Salads
          </h2>
          <p className="text-slate-500 dark:text-gray-400 mt-4 max-w-md mx-auto">
            Questions about plans, custom orders, or just want to say hi? We&apos;re a message away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WhatsApp CTA */}
          <div className="bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-5 hover:border-green-500 dark:hover:border-green-600/40 transition-colors shadow-sm dark:shadow-none">
            <div className="bg-green-100 dark:bg-green-600/10 border border-green-200 dark:border-green-600/20 w-16 h-16 rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600 dark:text-green-500">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-black text-xl mb-1">Chat on WhatsApp</h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Fastest way to reach us. We reply within minutes.
              </p>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl text-center transition-all hover:scale-[1.02]"
            >
              Message Us on WhatsApp
            </a>
          </div>

          {/* Contact form */}
          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] rounded-2xl p-8 flex flex-col gap-4 shadow-sm dark:shadow-none"
          >
            <h3 className="text-slate-900 dark:text-white font-black text-xl mb-1">Send a Message</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 dark:text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Name</label>
                <input name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputCls} />
              </div>
              <div>
                <label className="text-slate-500 dark:text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Phone</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Your phone" className={inputCls} />
              </div>
            </div>

            <div>
              <label className="text-slate-500 dark:text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Email</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputCls} />
            </div>

            <div>
              <label className="text-slate-500 dark:text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Message</label>
              <textarea name="message" required rows={4} value={form.message} onChange={handleChange} placeholder="Tell us what you need..." className={inputCls + ' resize-none'} />
            </div>

            {status === 'sent' && (
              <div className="bg-green-50 dark:bg-green-600/10 border border-green-200 dark:border-green-600/30 text-green-700 dark:text-green-400 text-sm rounded-lg px-4 py-3 font-semibold">
                ✓ Message sent! We&apos;ll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-3">
                Something went wrong. Please try WhatsApp instead.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className="bg-slate-900 dark:bg-[#1a1a1a] hover:bg-green-600 dark:hover:bg-green-600 disabled:opacity-50 border border-slate-200 dark:border-[#2a2a2a] hover:border-green-600 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {status === 'sending' ? (
                <><span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />Sending...</>
              ) : status === 'sent' ? (
                '✓ Sent!'
              ) : (
                'Send Message →'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

const inputCls = 'w-full bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 dark:focus:border-green-600 transition-colors'
