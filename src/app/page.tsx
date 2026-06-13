import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/home/Hero'
import AdsBanner from '@/components/home/AdsBanner'
import SaladsSection from '@/components/home/SaladsSection'
import PlansSection from '@/components/home/PlansSection'
import ContactSection from '@/components/home/ContactSection'
import type { Salad, Ad, Plan } from '@/types'

async function getData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const now = new Date().toISOString()

  const [saladsRes, adsRes, plansRes, settingsRes] = await Promise.all([
    supabase
      .from('salads')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('ads')
      .select('*')
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('created_at', { ascending: false }),
    supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true }),
    supabase
      .from('settings')
      .select('*')
      .eq('key', 'whatsapp_number')
      .single(),
  ])

  return {
    salads: (saladsRes.data ?? []) as Salad[],
    ads: (adsRes.data ?? []) as Ad[],
    plans: (plansRes.data ?? []) as Plan[],
    whatsappNumber: settingsRes.data?.value ?? '8939760408',
  }
}

export const revalidate = 60 // revalidate every 60 seconds

export default async function HomePage() {
  const { salads, ads, plans, whatsappNumber } = await getData()

  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero />
      <AdsBanner ads={ads} />
      <SaladsSection salads={salads} />
      <PlansSection plans={plans} />
      <ContactSection whatsappNumber={whatsappNumber} />
      <Footer />
    </main>
  )
}
