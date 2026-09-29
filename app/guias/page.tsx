'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, Gauge, HelpCircle, ShieldCheck, Smartphone, Star, Store, Truck, UserRound, Wrench } from 'lucide-react'

type Guide = {
  id: string
  title: string
  audience: string
  summary: string
  icon: typeof BookOpen
  color: string
  steps: { title: string; text: string }[]
  tips: string[]
}

const guides: Guide[] = [
  {
    id: 'primeiros-passos', title: 'Primeiros passos e cadastro', audience: 'Todos os usuários', summary: 'Crie sua conta, escolha o perfil correto e acesse seu espaço personalizado.', icon: UserRound, color: 'sky',
    steps: [
      { title: 'Abra Usuário na barra superior', text: 'Em qualquer tela, toque em Usuário. Quando estiver desconectado, o botão aparece em vermelho e oferece o acesso ao cadastro.' },
      { title: 'Escolha o tipo de uso', text: 'Selecione Cliente comprador, Vendedor, Oficina ou Guincho. Escolha o perfil que representa a atividade principal que você deseja realizar na plataforma.' },
      { title: 'Preencha seus dados reais', text: 'Informe nome completo, e-mail, telefone ou WhatsApp, município, bairro e senha. Vendedores, oficinas e guinchos também devem preencher os dados comerciais solicitados.' },
      { title: 'Confirme e faça login', text: 'Depois do cadastro, a tela de login será aberta. Entre com o e-mail e a senha criados para carregar o painel vinculado ao seu perfil.' },
    ],
    tips: ['Use um e-mail que você consulta regularmente.', 'Mantenha telefone, município e bairro atualizados para receber contatos adequados.', 'Nunca compartilhe sua senha.']
  },
  {
    id: 'comprador', title: 'Guia do comprador', audience: 'Clientes e oficinas que compram', summary: 'Solicite peças, compare propostas, acompanhe pedidos e avalie o atendimento.', icon: ClipboardList, color: 'emerald',
    steps: [
      { title: 'Solicite uma cotação', text: 'Abra Comprar ou Orçamentos > Solicitar. Informe carro ou moto, peça desejada, descrição, preferência de entrega e cidades onde deseja receber ofertas.' },
      { title: 'Acompanhe os orçamentos', text: 'Em Orçamentos > Solicitados, veja cada solicitação, o status e as propostas recebidas. Abra uma cotação para comparar loja, preço, condição, prazo e entrega.' },
      { title: 'Escolha uma proposta', text: 'Compare o valor total, disponibilidade, condição da peça, prazo e observações. Aceite somente a proposta que realmente atende à sua necessidade.' },
      { title: 'Acompanhe o pedido', text: 'Em Minhas Compras e Pedidos, avance o pedido conforme o contato com a loja: confirmar compra, marcar em entrega e confirmar recebimento.' },
      { title: 'Avalie após receber', text: 'Quando o pedido estiver como entregue, use Avaliar loja para registrar de 1 a 5 estrelas e deixar um comentário útil para a comunidade.' },
    ],
    tips: ['Descreva sintomas, medidas, ano, motor e lado da peça quando forem relevantes.', 'Confira se a peça é nova, original, similar ou usada antes de aceitar.', 'Use as notificações internas do painel para não perder novas propostas.']
  },
  {
    id: 'lojista', title: 'Guia do vendedor', audience: 'Lojistas e vendedores', summary: 'Configure sua loja, encontre oportunidades no Radar e envie propostas competitivas.', icon: Store, color: 'amber',
    steps: [
      { title: 'Complete seu perfil comercial', text: 'Cadastre nome da empresa, nome fantasia, documento, telefone, endereço, categorias e marcas atendidas. Esses dados ajudam o comprador a confiar e escolher.' },
      { title: 'Abra o Radar do Lojista', text: 'Entre em Vender ou no Radar. Filtre as solicitações por categoria, marca, cidade e compatibilidade com o seu estoque ou rede de fornecedores.' },
      { title: 'Leia a necessidade inteira', text: 'Confira veículo, peça, descrição, fotos, preferência de entrega e cidades de destino antes de montar a oferta.' },
      { title: 'Envie uma proposta clara', text: 'Informe disponibilidade, condição, preço à vista, parcelamento se houver, frete, prazo, observações e foto quando ajudar a comprovar o produto.' },
      { title: 'Acompanhe aceite e avaliação', text: 'Quando o comprador aceitar, acompanhe a negociação e o status do pedido. Um bom atendimento e uma resposta precisa ajudam na avaliação da loja.' },
    ],
    tips: ['Não envie preço sem confirmar compatibilidade.', 'Se não tiver a peça em estoque, informe prazo de encomenda com transparência.', 'Mantenha o telefone e o endereço comercial atualizados.']
  },
  {
    id: 'oficina', title: 'Guia da oficina', audience: 'Oficinas e profissionais', summary: 'Use o PeçaAki para pedir componentes e orientar clientes com mais agilidade.', icon: Wrench, color: 'orange',
    steps: [
      { title: 'Cadastre-se como Oficina', text: 'No cadastro, selecione Oficina e informe a região de atendimento. O perfil permite solicitar peças como comprador e, conforme a evolução do negócio, apresentar seus serviços.' },
      { title: 'Descreva o diagnóstico', text: 'Ao pedir uma cotação, inclua veículo, ano, motorização, sintomas, código da peça quando disponível e fotos da peça antiga.' },
      { title: 'Compare disponibilidade', text: 'Use as propostas para equilibrar preço, prazo, procedência e garantia. Para uma oficina, prazo confiável pode ser tão importante quanto o menor valor.' },
      { title: 'Acompanhe a entrega', text: 'Registre no painel quando confirmar a compra, receber o material e concluir a instalação. Isso mantém o histórico organizado.' },
    ],
    tips: ['Evite solicitar uma peça sem informar versão ou motorização.', 'Use fotos nítidas e uma descrição objetiva.', 'Concentre solicitações diferentes em cotações separadas para facilitar a comparação.']
  },
  {
    id: 'guincho', title: 'Guia do guincho', audience: 'Guinchos e reboques', summary: 'Receba solicitações com contexto suficiente para agir com segurança e rapidez.', icon: Truck, color: 'violet',
    steps: [
      { title: 'Cadastre o serviço de guincho', text: 'Selecione Guincho e informe telefone, cidade, bairros ou áreas de atendimento e disponibilidade. Dados corretos ajudam a direcionar chamados.' },
      { title: 'Solicite ou acompanhe atendimento', text: 'O cliente pode abrir uma solicitação pela opção Guinchos. Ao receber uma oportunidade, verifique localização aproximada, tipo de veículo e urgência.' },
      { title: 'Informe condições do serviço', text: 'Envie valor, tempo estimado de chegada, capacidade do reboque, forma de pagamento e qualquer restrição operacional.' },
      { title: 'Priorize segurança', text: 'Confirme o ponto de encontro por contato direto e nunca peça dados sensíveis desnecessários. Em risco ou acidente, oriente o usuário a acionar os serviços públicos adequados.' },
    ],
    tips: ['Mantenha a disponibilidade atualizada.', 'Confirme se o veículo é carro, moto ou outro tipo antes de aceitar.', 'Explique custos adicionais antes do deslocamento.']
  },
  {
    id: 'pedidos-avaliacoes', title: 'Pedidos, notificações e avaliações', audience: 'Todos os perfis', summary: 'Entenda os status e use o painel para não perder nenhuma etapa.', icon: Star, color: 'blue',
    steps: [
      { title: 'Solicitados e Recebidos', text: 'Solicitados mostra o que você pediu. Recebidos mostra as propostas ou oportunidades relacionadas ao seu perfil. Os dados aparecem no menu Usuário.' },
      { title: 'Notificações internas', text: 'O sistema consulta automaticamente o painel em intervalos regulares. Quando surgir uma nova proposta, pedido ou alteração relevante, um aviso visual aparece na tela.' },
      { title: 'Status do pedido', text: 'Pendente de contato significa que os próximos passos precisam ser combinados. Depois vêm confirmado, em entrega, entregue ou cancelado.' },
      { title: 'Avaliação responsável', text: 'Avalie depois de concluir o atendimento. Descreva fatos, prazo, comunicação e qualidade. Evite publicar dados pessoais ou informações que não sejam necessárias.' },
    ],
    tips: ['Abra o painel periodicamente, especialmente após criar uma cotação.', 'Use os links do aviso para ir diretamente ao recurso relacionado.', 'Uma avaliação honesta melhora a experiência de todos.']
  },
  {
    id: 'pwa', title: 'Uso no celular e instalação PWA', audience: 'Todos os usuários', summary: 'Instale o PeçaAki como app, use a barra inferior e alterne o modo de exibição.', icon: Smartphone, color: 'indigo',
    steps: [
      { title: 'Instale quando o aviso aparecer', text: 'Em navegadores compatíveis, use o aviso Instalar PeçaAki. No iPhone, use Compartilhar > Adicionar à Tela de Início.' },
      { title: 'Use os atalhos inferiores', text: 'No celular, a barra fixa aparece em todas as telas: Início, Comprar, Vender, Oficinas, Guinchos e Guia. Ela permanece disponível mesmo dentro dos fluxos.' },
      { title: 'Escolha claro ou escuro', text: 'Use o botão Dia/Noite no topo ou no rodapé. A marca e os cartões foram preparados para manter contraste nos dois modos.' },
      { title: 'Se ficar sem conexão', text: 'O app tenta carregar a versão mais recente disponível no cache. Assim que a conexão voltar, atualize a tela para buscar novos dados e notificações.' },
    ],
    tips: ['Mantenha o navegador atualizado.', 'Permita notificações do navegador se quiser receber avisos locais quando disponíveis.', 'Em problemas, faça uma atualização completa antes de repetir o cadastro ou pedido.']
  },
]

const colorClasses: Record<string, { soft: string; text: string; border: string; button: string }> = {
  sky: { soft: 'bg-sky-500/10', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800', button: 'bg-sky-500' },
  emerald: { soft: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', button: 'bg-emerald-500' },
  amber: { soft: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', button: 'bg-amber-500' },
  orange: { soft: 'bg-orange-500/10', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800', button: 'bg-orange-500' },
  violet: { soft: 'bg-violet-500/10', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800', button: 'bg-violet-500' },
  blue: { soft: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', button: 'bg-blue-500' },
  indigo: { soft: 'bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', button: 'bg-indigo-500' },
}

export default function GuidesPage() {
  const [selectedId, setSelectedId] = useState('primeiros-passos')
  const selected = useMemo(() => guides.find((guide) => guide.id === selectedId) || guides[0], [selectedId])
  const style = colorClasses[selected.color]
  const Icon = selected.icon

  return <div className="mx-auto max-w-6xl space-y-7 py-2 sm:py-5">
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-950 text-white shadow-2xl">
      <img src="/guia-pecaaki-cenario-01.webp" alt="Peças automotivas, carro e moto em um cenário PeçaAki" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/95 via-slate-950/70 to-slate-950/35" />
      <div className="relative grid gap-7 px-5 py-8 sm:px-9 sm:py-11 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:px-12">
        <div><span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[.15em] text-amber-200"><BookOpen className="h-4 w-4" /> Central de orientação</span><h1 className="mt-4 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">Aprenda a usar cada caminho do PeçaAki.</h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">Guias simples, ilustrados e passo a passo para compradores, lojistas, oficinas, guinchos e todos os perfis da plataforma.</p></div>
        <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:p-5"><div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-400 p-3 text-slate-950"><Gauge className="h-6 w-6" /></div><div><p className="text-sm font-black">Comece pelo seu perfil</p><p className="mt-1 text-xs text-slate-300">Escolha um guia abaixo e avance no seu ritmo.</p></div></div></div>
      </div>
    </section>

    <div className="grid gap-6 lg:grid-cols-[18rem_1fr] lg:items-start">
      <aside className="space-y-3 lg:sticky lg:top-24"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-slate-500 dark:text-slate-400"><HelpCircle className="h-4 w-4 text-amber-500" /> Escolha um guia</div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">{guides.map((guide) => { const GuideIcon = guide.icon; const active = guide.id === selected.id; const c = colorClasses[guide.color]; return <button key={guide.id} type="button" onClick={() => setSelectedId(guide.id)} className={`flex min-h-[76px] items-center gap-2 rounded-2xl border p-3 text-left transition active:scale-[.98] ${active ? `${c.border} ${c.soft} shadow-sm` : 'border-slate-200 bg-white hover:border-amber-200 dark:border-slate-800 dark:bg-slate-900'}`}><GuideIcon className={`h-5 w-5 shrink-0 ${active ? c.text : 'text-slate-400'}`} /><span className={`text-[11px] font-black leading-tight ${active ? c.text : 'text-slate-700 dark:text-slate-200'}`}>{guide.title}</span></button> })}</div></aside>

      <article className={`overflow-hidden rounded-[2rem] border ${style.border} bg-white shadow-sm dark:bg-slate-900`}>
        <div className={`flex flex-col gap-4 border-b ${style.border} ${style.soft} p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7`}><div className="flex items-start gap-3"><div className={`rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950 ${style.text}`}><Icon className="h-7 w-7" /></div><div><p className={`text-[11px] font-black uppercase tracking-[.16em] ${style.text}`}>{selected.audience}</p><h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{selected.title}</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selected.summary}</p></div></div><Link href="/cadastro" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-black text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"><UserRound className="h-4 w-4" /> Criar cadastro</Link></div>
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_.8fr]"><div><div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[.15em] text-slate-500 dark:text-slate-400"><ClipboardList className="h-4 w-4 text-amber-500" /> Passo a passo</div><div className="space-y-3">{selected.steps.map((step, index) => <div key={step.title} className="flex gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${style.button}`}>{index + 1}</div><div><h3 className="text-sm font-black text-slate-900 dark:text-white">{step.title}</h3><p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{step.text}</p></div></div>)}</div></div><div className="space-y-5"><img src="/guia-pecaaki-cenario-02.webp" alt="Carro, moto e peças automotivas ilustrando os serviços" className="h-40 w-full rounded-2xl object-cover shadow-sm sm:h-52" /><div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Boas práticas</div><ul className="mt-3 space-y-2">{selected.tips.map((tip) => <li key={tip} className="flex gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{tip}</li>)}</ul></div><Link href="/contato" className="inline-flex items-center gap-2 text-xs font-black text-amber-700 hover:underline dark:text-amber-300">Ainda ficou com dúvida? Fale com o suporte <ArrowRight className="h-4 w-4" /></Link></div></div>
      </article>
    </div>

    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.16em] text-amber-600 dark:text-amber-400">Orientação rápida</p><h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">A qualquer momento, toque em Guia.</h2><p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">A barra inferior fica disponível nas telas mobile e PWA para você retornar a esta central sem perder o fluxo de compra, venda ou atendimento.</p></div><Smartphone className="hidden h-12 w-12 text-amber-500 sm:block" /></div></section>
  </div>
}
