export interface Lead {
  id?: string
  nombre: string
  email: string
  empresa?: string
  mensaje?: string
  telefono?: string
  contacto_pref?: string
  presupuesto?: string
  servicio?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  consent?: boolean
  origen?: string
  created_at?: string
}

export interface LeadInsert {
  nombre: string
  email: string
  empresa?: string
  mensaje?: string
  telefono?: string
  contacto_pref?: string
  presupuesto?: string
  servicio?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  consent?: boolean
  origen?: string
}
