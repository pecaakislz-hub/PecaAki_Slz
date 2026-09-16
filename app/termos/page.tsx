import { FileText, Scale, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Termos de Uso - PeçaAki',
  description: 'Regras da plataforma, termos de intermediação e garantias do consumidor no PeçaAki.'
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4" /> Termos de Serviço
        </div>
        <h1 className="text-3xl font-black text-white">Termos e Condições de Uso</h1>
        <p className="text-xs text-slate-400">Válido para a Região Metropolitana da Grande São Luís</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" /> 1. Papel da Plataforma PeçaAki
          </h2>
          <p>
            O <strong>PeçaAki</strong> atua exclusivamente como uma plataforma tecnológica de intermediação de cotações entre Compradores (proprietários de veículos, mecânicos e motoristas) e Fornecedores/Lojistas credenciados de autopeças e motopeças na Grande São Luís.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> 2. Responsabilidade sobre Peças e Garantias (CDC)
          </h2>
          <p>
            Toda a responsabilidade legal sobre a qualidade, compatibilidade técnica, prazo de garantia e emissão de nota fiscal das peças negociadas é de responsabilidade direta da loja fornecedora escolhida, aplicando-se integralmente os direitos previstos no Código de Defesa do Consumidor (CDC - Lei nº 8.078/1990).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> 3. Trocas e Devoluções
          </h2>
          <p>
            Caso a peça entregue divirta do solicitado na cotação ou apresente defeito de fabricação, o comprador terá o direito de troca direta no balcão da loja parceira ou reembolso total conforme o prazo de garantia informado pelo lojista na proposta enviada.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" /> 4. Conduta e Boas Práticas
          </h2>
          <p>
            É proibido a publicação de cotações com conteúdo ofensivo, fotos não pertinentes ou dados falsos. Lojas que enviarem orçamentos com preços abusivos ou enviarem peças em desconformidade deliberada poderão ser descredenciadas do Radar de Cotações.
          </p>
        </section>
      </div>
    </div>
  )
}
