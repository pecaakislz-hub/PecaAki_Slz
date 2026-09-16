import { ShieldCheck, Lock, Eye, FileText, Database } from 'lucide-react'

export const metadata = {
  title: 'Política de Privacidade (LGPD) - PeçaAki',
  description: 'Conheça nossa Política de Privacidade em conformidade com a LGPD (Lei nº 13.709/2018).'
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Conformidade LGPD
        </div>
        <h1 className="text-3xl font-black text-white">Política de Privacidade</h1>
        <p className="text-xs text-slate-400">Última atualização: Setembro de 2026</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" /> 1. Introdução e Compromisso LGPD
          </h2>
          <p>
            O <strong>PeçaAki</strong> (PeçaAki Auto & Moto) está inteiramente comprometido com a proteção dos dados pessoais de seus usuários na Região Metropolitana da Grande São Luís, em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" /> 2. Dados Coletados e Finalidade
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
            <li><strong>Dados de Cadastro:</strong> Nome completo, e-mail, número de WhatsApp, município e bairro da Grande São Luís.</li>
            <li><strong>Dados do Veículo:</strong> Marca, modelo, ano, motorização e placa opcional salvos na Garagem Virtual.</li>
            <li><strong>Fotos Enviadas:</strong> Imagens da peça danificada enviadas voluntariamente pelo comprador para esclarecer o pedido de cotação.</li>
            <li><strong>Dados Comerciais de Lojas:</strong> CNPJ/CPF, Razão Social, Nome Fantasia e Endereço Físico.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" /> 3. Compartilhamento de Dados
          </h2>
          <p>
            O PeçaAki não comercializa dados de usuários com terceiros. As fotos do pedido, o bairro do comprador e as especificações do veículo são visíveis apenas para os lojistas credenciados no Radar de Cotações para que estes possam emitir orçamentos precisos. O número de WhatsApp do comprador só é acessado pelo lojista escolhido quando o comprador clica para aceitar a proposta.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" /> 4. Seus Direitos (Art. 18 LGPD)
          </h2>
          <p>
            Você pode solicitar a qualquer momento a confirmação da existência de tratamento de dados, acesso, correção de dados incompletos ou a exclusão definitiva da sua conta e garagem virtual entrando em contato com nosso DPO/Encarregado pelo e-mail <strong>privacidade@pecaaki.com.br</strong>.
          </p>
        </section>
      </div>
    </div>
  )
}
