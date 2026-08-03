import Image from 'next/image'
import Link from 'next/link'
import WhatsAppLink from '@/components/ui/WhatsAppLink'
import { WHATSAPP_URLS } from '@/lib/whatsapp'

const year = 2026

export default function Footer() {
  return (
    <footer className="bg-ef-ink border-t border-ef-paper/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <Image src="/LogoEleva.svg" alt="ElevaForge" width={180} height={52} className="h-10 w-auto" />
          <p className="text-ef-paper/60 text-base mt-4 leading-relaxed max-w-xs">
            Ingeniería de software que resuelve problemas de negocio, con transparencia y autonomía para tu equipo.
          </p>
        </div>

        <nav aria-label="Links del footer">
          <p className="text-xs font-semibold tracking-widest uppercase text-ef-paper/50 mb-4">
            Navegación
          </p>
          <ul className="space-y-3">
            <li><Link href="/#soluciones" className="text-base text-ef-paper/60 hover:text-ef-paper transition-colors">Soluciones</Link></li>
            <li><Link href="/proceso" className="text-base text-ef-paper/60 hover:text-ef-paper transition-colors">Proceso</Link></li>
            <li><Link href="/nosotros" className="text-base text-ef-paper/60 hover:text-ef-paper transition-colors">Quiénes somos</Link></li>
            <li><Link href="/contacto" className="text-base text-ef-paper/60 hover:text-ef-paper transition-colors">Contacto</Link></li>
            <li><Link href="/preguntas-frecuentes" className="text-base text-ef-paper/60 hover:text-ef-paper transition-colors">Preguntas frecuentes</Link></li>
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-ef-paper/50 mb-4">
            Contacto
          </p>
          <WhatsAppLink
            href={WHATSAPP_URLS.hero}
            source="footer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-base text-ef-paper/60 hover:text-ef-paper transition-colors mb-3 break-words"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            WhatsApp directo
          </WhatsAppLink>
          <a
            href="mailto:contacto@elevaforge.com"
            className="flex items-center gap-2 text-base text-ef-paper/60 hover:text-ef-paper transition-colors break-all"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            contacto@elevaforge.com
          </a>
        </div>
      </div>

      <div className="border-t border-ef-paper/10 mt-8 pt-8 pb-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ef-paper/50">
        <p>© {year} ElevaForge. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <Link href="/privacidad" className="hover:text-ef-paper transition-colors">Privacidad</Link>
          <Link href="/terminos" className="hover:text-ef-paper transition-colors">Términos</Link>
        </div>
      </div>
    </footer>
  )
}
