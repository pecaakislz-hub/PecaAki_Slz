import Link from 'next/link'
import { MapPin, ShieldCheck, Phone, FileText, Info } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Footer() {
  return (
    <footer className="bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1: Marca & Região */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/PeçaAki_Logomarca_SF.png"
                alt="PeçaAki Logo"
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Marketplace reverso de cotação de autopeças e motopeças líder na Região Metropolitana da Grande São Luís.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>São Luís • Paço do Lumiar • Ribamar • Raposa</span>
            </div>
          </div>

          {/* Coluna 2: Navegação & Serviços */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-xs">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cotacoes/nova" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  Solicitar Orçamento de Peça
                </Link>
              </li>
              <li>
                <Link href="/garagem" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  Garagem Virtual
                </Link>
              </li>
              <li>
                <Link href="/lojista/radar" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  Radar do Lojista (Painel ao Vivo)
                </Link>
              </li>
              <li>
                <Link href="/cadastro?role=LOJISTA" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  Cadastrar Minha Autopeça / Motopeça
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Institucional & Legal */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-xs">Institucional & LGPD</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/sobre" className="flex items-center gap-1.5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="flex items-center gap-1.5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Política de Privacidade (LGPD)
                </Link>
              </li>
              <li>
                <Link href="/termos" className="flex items-center gap-1.5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  <FileText className="w-3.5 h-3.5" />
                  Termos de Uso & Código do Consumidor
                </Link>
              </li>
              <li>
                <Link href="/contato" className="flex items-center gap-1.5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  Contato & Suporte WhatsApp
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Atendimento & Alternar Tema */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Atendimento na Ilha</h4>
            <p className="text-xs leading-relaxed">
              Segunda a Sexta: 08:00 às 18:00
              <br />
              Sábado: 08:00 às 13:00
            </p>
            
            <div className="pt-2 flex flex-col gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Modo de Exibição:</span>
              <ThemeToggle showLabel={true} className="self-start" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} PeçaAki Auto & Moto. Todos os direitos reservados. Maranhão, Brasil.</p>
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Ambiente 100% Seguro • Conexão Criptografada SSL</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
