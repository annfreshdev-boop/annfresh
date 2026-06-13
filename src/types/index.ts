export interface Salad {
  id: string
  name: string
  type: 'veg' | 'non-veg'
  description: string
  ingredients: string[]
  calories: number
  price: number
  image_url: string | null
  is_active: boolean
  created_at: string
}

export interface Ad {
  id: string
  title: string
  subtitle: string | null
  discount_text: string | null
  bg_color: string
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export interface Plan {
  id: string
  name: string
  duration: 'daily' | 'weekly' | 'monthly'
  days_count: number | null
  price: number
  description: string
  features: string[]
  is_custom: boolean
  is_active: boolean
  is_popular: boolean
}

export interface Setting {
  id: string
  key: string
  value: string
  updated_at: string
}
