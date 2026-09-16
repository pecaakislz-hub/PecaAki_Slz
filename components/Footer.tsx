import Link from 'next/link'
import { MapPin, ShieldCheck, Phone, FileText, Info, HelpCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1: Marca & Região */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-lg">
                P⚡
              </div>
              <span className="font-bold text-lg text-white">
                Peça<span className="text-amber-400">Aki</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Marketplace reverso de cotação de autopeças e motopeças líder na Região Metropolitana da Grande São Luís.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>São Luís • Paço do Lumiar • Ribamar • Raposa</span>
            </div>
          </div>

          {/* Coluna 2: Navegação & Serviços */}
          <div>
            <h4 className="font-semibold text-white mb-3 uppercase tracking-wider text-xs">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cotacoes/nova" className="hover:text-amber-400 transition-colors">
                  Solicitar Orçamento de Peça
                </Link>
              </li>
              <li>
                <Link href="/garagem" className="hover:text-amber-400 transition-colors">
                  Garagem Virtual
                </Link>
              </li>
              <li>
                <Link href="/lojista/radar" className="hover:text-amber-400 transition-colors">
                  Radar do Lojista (Painel ao Vivo)
                </Link>
              </li>
              <li>
                <Link href="/cadastro?role=LOJISTA" className="hover:text-amber-400 transition-colors">
                  Cadastrar Minha Autopeça / Motopeça
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Institucional & Legal */}
          <div>
            <h4 className="font-semibold text-white mb-3 uppercase tracking-wider text-xs">Institucional & LGPD</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/sobre" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Política de Privacidade (LGPD)
                </Link>
              </li>
              <li>
                <Link href="/termos" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <FileText className="w-3.5 h-3.5" />
                  Termos de Uso & Código do Consumidor
                </Link>
              </li>
              <li>
                <Link href="/contato" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  Contato & Suporte WhatsApp
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Atendimento & Redes */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs">Atendimento na Ilha</h4>
            <p className="text-xs leading-relaxed">
              Segunda a Sexta: 08:00 às 18:00
              <br />
              Sábado: 08:00 às 13:00
            </p>
            <div className="pt-2">
              <span className="text-xs text-slate-400 block mb-1">Redes Sociais:</span>
              <a
                href="https://instagram.com/pecaaki.slz"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md hover:bg-amber-500/20 transition-colors"
              >
                @pecaaki.slz
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
