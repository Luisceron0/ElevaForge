'use client'

import React from 'react'

interface Props {
  onLogout?: () => void
  onNavigate?: (key: 'content' | 'admins' | 'leads') => void
}

export default function AdminNavbar({ onLogout, onNavigate }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-forge-bg-dark/95 border-b border-forge-blue-mid/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/LogoEleva.svg" alt="ElevaForge" className="h-9 w-auto object-contain" />
            <span className="text-white font-semibold text-sm">Admin</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-6" aria-label="Navegación admin">
          <button onClick={() => onNavigate?.('content')} className="text-white/70 hover:text-white text-sm transition-colors duration-150">Contenido</button>
          <button onClick={() => onNavigate?.('admins')} className="text-white/70 hover:text-white text-sm transition-colors duration-150">Administradores</button>
          <button onClick={() => onNavigate?.('leads')} className="text-white/70 hover:text-white text-sm transition-colors duration-150">Leads</button>
          <div className="h-4 w-px bg-white/10" />
          <button
            onClick={onLogout}
            className="bg-forge-orange-main text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-forge-orange-main/90 transition-colors duration-150"
          >
            Cerrar sesión
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex items-center gap-2">
          <button onClick={() => { onNavigate?.('content') }} className="text-white/70 hover:text-white text-xs px-2 py-1 rounded transition-colors">Contenido</button>
          <button onClick={() => { onNavigate?.('admins') }} className="text-white/70 hover:text-white text-xs px-2 py-1 rounded transition-colors">Admins</button>
          <button onClick={() => { onNavigate?.('leads') }} className="text-white/70 hover:text-white text-xs px-2 py-1 rounded transition-colors">Leads</button>
          <button onClick={onLogout} className="bg-forge-orange-main text-white px-2 py-1 rounded text-xs font-medium hover:bg-forge-orange-main/90 transition-colors">Salir</button>
        </div>
      </div>
    </header>
  )
}
