export interface Corvette {
  id: string
  user_id: string
  nickname: string
  year: number
  model: string
  trim?: string
  color?: string
  vin?: string
  mileage?: number
  photo_url?: string
  is_public: boolean
  in_gallery: boolean
  for_sale: boolean
  show_carfax: boolean
  email_token?: string
  created_at: string
  updated_at: string
}

export interface Mod {
  id: string
  corvette_id: string
  user_id: string
  name: string
  category?: string
  vendor?: string
  cost?: number
  install_date?: string
  purchase_url?: string
  notes?: string
  created_at: string
}

export interface ServiceRecord {
  id: string
  corvette_id: string
  user_id: string
  title: string
  category?: string
  shop?: string
  mileage?: number
  cost?: number
  service_date?: string
  notes?: string
  created_at: string
}

export interface Document {
  id: string
  corvette_id: string
  user_id: string
  mod_id?: string
  service_id?: string
  name: string
  file_url: string
  file_type?: string
  file_size?: number
  is_shared?: boolean
  created_at: string
}

export interface VehiclePhoto {
  id: string
  corvette_id: string
  user_id: string
  storage_path: string
  public_url: string
  is_shared: boolean
  caption?: string
  sort_order: number
  created_at: string
}

export const MOD_CATEGORIES = [
  'Performance', 'Appearance', 'Audio/Video', 'Wheels & Tires',
  'Suspension', 'Interior', 'Lighting', 'Safety', 'Other'
]

export const SERVICE_CATEGORIES = [
  'Oil Change', 'Tire Rotation', 'Tires', 'Brakes', 'Transmission',
  'Coolant', 'Inspection', 'Repair', 'Detailing', 'Other'
]
