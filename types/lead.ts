export interface Lead {
  id?: string
  nombre: string
  email: string
  contacto_pref?: string
  presupuesto?: string
  consent?: boolean
  origen?: string
  status?: 'pending' | 'sent' | 'failed'
  attempts?: number
  last_attempt_at?: string
  discord_sent_at?: string
  created_at?: string
}

export interface LeadInsert {
  nombre: string
  email: string
  contacto_pref?: string
  presupuesto?: string
  consent?: boolean
  origen?: string
  status?: string
  attempts?: number
}
