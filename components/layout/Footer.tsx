import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-forge-bg-dark border-t border-forge-blue-mid/20 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="text-center md:text-left">
            <span className="font-humanst text-xl text-white">
              Eleva<span className="text-forge-orange-main">Forge</span>
            </span>
            <p className="text-white/40 text-sm mt-1">
              Forjamos tu crecimiento con un solo clic
            </p>
          </div>

          {/* Links legales */}
          <nav aria-label="Links del footer">
            <ul className="flex gap-6 text-sm text-white/40">
              <li>
                <Link
                  href="/privacidad"
                  className="hover:text-white transition-colors"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="hover:text-white transition-colors"
                >
                  Términos
                </Link>
              </li>
            </ul>
          </nav>

          {/* Copyright dinámico */}
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} ElevaForge. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
