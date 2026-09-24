'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Store, 
  Wrench, 
  Truck, 
  Home, 
  BookOpen, 
  User, 
  FileText, 
  Package, 
  Star, 
  Settings, 
  ChevronRight, 
  Car, 
  Bike,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function HomeDashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'comprar' | 'vender' | 'oficinas' | 'guinchos' | 'guia'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleQuadrantClick = (action: string) => {
    setActiveModal(action);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200">
      
      {/* HEADER / TOPO */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo e Tagline */}
          <Link href="/" className="flex items-center gap-3" onClick={() => setActiveTab('home')}>
            <img 
              src="/PeçaAki_Logomarca_SF.png" 
              alt="PeçaAki Logo" 
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Peça<span className="text-red-600 dark:text-red-500">Aki</span> <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">SLZ</span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Marketplace de Peças • Grande São Luís</p>
            </div>
          </Link>

          {/* Botão Meu Espaço (Topo Direito) */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all active:scale-95 shadow-sm"
            >
              <User className="w-4 h-4 text-red-600 dark:text-red-500" />
              <span>Meu Espaço</span>
            </button>

            {/* Dropdown do Menu "Meu Espaço" */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Painel do Usuário</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Minha Conta SLZ</p>
                </div>
                
                <button 
                  onClick={() => { setActiveModal('orcamentos'); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-red-600 dark:text-red-500" />
                  <span>Orçamentos (Solicitados & Recebidos)</span>
                </button>

                <button 
                  onClick={() => { setActiveModal('compras'); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                >
                  <Package className="w-4 h-4 text-red-600 dark:text-red-500" />
                  <span>Minhas Compras e Pedidos</span>
                </button>

                <button 
                  onClick={() => { setActiveModal('avaliacoes'); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                >
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Avaliações Feitas e Recebidas</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                <button 
                  onClick={() => { setActiveModal('dados'); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-red-600 dark:text-red-500" />
                  <span>Dados Cadastrais & Exclusão de Conta</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-24">
        
        {/* BANNER DESTAQUE DE PEÇAS E VEÍCULOS (Carros e Motos) */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-red-950/80 dark:from-slate-950 dark:via-slate-900 dark:to-red-950/40 border border-slate-800 mb-8 p-6 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 dark:text-red-400 text-xs font-semibold mb-4">
              <MapPin className="w-3.5 h-3.5" /> Cobertura Total: São Luís, Paço, Ribamar e Raposa
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
              Encontre peças para <span className="text-red-500">carros e motos</span> na hora!
            </h2>
            <p className="text-sm md:text-base text-slate-200 dark:text-slate-300 mb-6">
              Faça sua cotação sob demanda. As autopeças e motopeças da Ilha respondem direto no seu celular com preço e frete.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/cotacoes/nova"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs md:text-sm shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Solicitar Cotação Agora
              </Link>
              <Link 
                href="/lojista/radar"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-5 py-3 rounded-xl text-xs md:text-sm transition-all active:scale-95 flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-red-400" /> Sou Lojista / Fornecedor
              </Link>
            </div>
          </div>

          {/* Imagem de Destaque / Ícones visuais */}
          <div className="relative w-full md:w-auto flex justify-center items-center">
            <div className="absolute w-48 h-48 bg-red-600/20 rounded-full blur-3xl -z-10"></div>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center shadow-lg">
                <Car className="w-10 h-10 text-red-500 mb-2" />
                <span className="text-xs font-bold text-white">Autopeças</span>
                <span className="text-[10px] text-slate-400">Suspensão, Motor, Freios</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center shadow-lg">
                <Bike className="w-10 h-10 text-red-500 mb-2" />
                <span className="text-xs font-bold text-white">Motopeças</span>
                <span className="text-[10px] text-slate-400">Transmissão, Pneus, Óleo</span>
              </div>
            </div>
          </div>
        </section>

        {/* TÍTULO DA SEÇÃO DOS QUADRANTES */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Acesse o Cadastro Desejado</span>
            <span className="text-xs bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">Toque em um quadrante</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Selecione abaixo a opção correspondente ao seu perfil para iniciar o cadastro ou acesso rápido.</p>
        </div>

        {/* 4 QUADRANTES PRINCIPAIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10">
          
          {/* Quadrante 1: Comprar */}
          <div 
            onClick={() => handleQuadrantClick('comprar')}
            className="group bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 p-6 rounded-3xl cursor-pointer transition-all duration-200 active:scale-95 shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-red-600/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Comprar Peças</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Para motoristas, motociclistas e mecânicos. Envie foto e descrição da peça necessária e receba orçamentos de várias lojas de São Luís.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs font-bold text-red-600 dark:text-red-400">
              <span>Iniciar Cotação / Cadastro</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Quadrante 2: Vender */}
          <div 
            onClick={() => handleQuadrantClick('vender')}
            className="group bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 p-6 rounded-3xl cursor-pointer transition-all duration-200 active:scale-95 shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-red-600/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Vender (Lojistas & Fornecedores)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Para autopeças e distribuidoras. Cadastre sua loja na Ilha para receber cotações de clientes em tempo real e aumentar suas vendas.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs font-bold text-red-600 dark:text-red-400">
              <span>Cadastrar Minha Loja</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Quadrante 3: Oficinas */}
          <div 
            onClick={() => handleQuadrantClick('oficinas')}
            className="group bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 p-6 rounded-3xl cursor-pointer transition-all duration-200 active:scale-95 shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-red-600/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Cadastrar Oficinas</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Para mecânicos e centros automotivos. Insira sua oficina no diretório especializado para ser encontrada por motoristas na região.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs font-bold text-red-600 dark:text-red-400">
              <span>Cadastrar Oficina</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Quadrante 4: Guinchos */}
          <div 
            onClick={() => handleQuadrantClick('guinchos')}
            className="group bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 p-6 rounded-3xl cursor-pointer transition-all duration-200 active:scale-95 shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-red-600/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Cadastrar Guinchos / Reboque</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Para profissionais de reboque e socorro mecânico 24h na Grande São Luís. Divulgue seu serviço de resgate com rapidez.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs font-bold text-red-600 dark:text-red-400">
              <span>Cadastrar Guincho</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </main>

      {/* RODAPÉ FIXO / BOTTOM BAR (Com botões dos quadrantes + Início + Guia de Uso) */}
      <nav aria-label="Navegação Principal" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 shadow-2xl">
        <div className="max-w-4xl mx-auto grid grid-cols-6 gap-1">
          
          {/* Início */}
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all active:scale-90 ${activeTab === 'home' ? 'text-red-600 dark:text-red-500 bg-red-500/10 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Início</span>
          </button>

          {/* Comprar */}
          <button 
            onClick={() => { setActiveTab('comprar'); handleQuadrantClick('comprar'); }}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all active:scale-90 ${activeTab === 'comprar' ? 'text-red-600 dark:text-red-500 bg-red-500/10 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <ShoppingBag className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Comprar</span>
          </button>

          {/* Vender */}
          <button 
            onClick={() => { setActiveTab('vender'); handleQuadrantClick('vender'); }}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all active:scale-90 ${activeTab === 'vender' ? 'text-red-600 dark:text-red-500 bg-red-500/10 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Store className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Vender</span>
          </button>

          {/* Oficinas */}
          <button 
            onClick={() => { setActiveTab('oficinas'); handleQuadrantClick('oficinas'); }}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all active:scale-90 ${activeTab === 'oficinas' ? 'text-red-600 dark:text-red-500 bg-red-500/10 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Wrench className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Oficinas</span>
          </button>

          {/* Guinchos */}
          <button 
            onClick={() => { setActiveTab('guinchos'); handleQuadrantClick('guinchos'); }}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all active:scale-90 ${activeTab === 'guinchos' ? 'text-red-600 dark:text-red-500 bg-red-500/10 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Truck className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Guinchos</span>
          </button>

          {/* Guia de Uso */}
          <button 
            onClick={() => { setActiveTab('guia'); handleQuadrantClick('guia'); }}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all active:scale-90 ${activeTab === 'guia' ? 'text-red-600 dark:text-red-500 bg-red-500/10 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Guia</span>
          </button>

        </div>
      </nav>

      {/* MODAL DE EXEMPLO PARA INTERAÇÃO DOS CADASTROS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-900 dark:text-slate-100">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 capitalize">
              {activeModal === 'comprar' && '🛒 Cadastro / Solicitação de Compra'}
              {activeModal === 'vender' && '🏪 Cadastro de Lojas e Fornecedores'}
              {activeModal === 'oficinas' && '🔧 Cadastro de Oficinas Especializadas'}
              {activeModal === 'guinchos' && '🚚 Cadastro de Guinchos 24h'}
              {activeModal === 'guia' && '📖 Guia de Uso do PeçaAki SLZ'}
              {activeModal === 'orcamentos' && '📄 Meus Orçamentos'}
              {activeModal === 'compras' && '📦 Histórico de Compras'}
              {activeModal === 'avaliacoes' && '⭐ Avaliações e Reputação'}
              {activeModal === 'dados' && '⚙️ Dados Cadastrais e Exclusão'}
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-6">
              {activeModal === 'comprar' && 'Informe os dados do seu veículo e a peça desejada para disparar a cotação para as autopeças de São Luís.'}
              {activeModal === 'vender' && 'Cadastre o CNPJ, especialidade e localização da sua autopeça para começar a receber pedidos no painel.'}
              {activeModal === 'oficinas' && 'Insira o endereço da sua oficina e serviços prestados para aparecer no diretório local.'}
              {activeModal === 'guinchos' && 'Cadastre seu veículo de reboque, área de atendimento na Ilha e telefone de contato direto.'}
              {activeModal === 'guia' && '1. Solicite sua peça. 2. Receba propostas das lojas de SLZ. 3. Escolha a melhor oferta e feche negócio!'}
              {activeModal === 'orcamentos' && 'Acompanhe aqui todas as cotações solicitadas por você e as respostas enviadas pelas lojas.'}
              {activeModal === 'compras' && 'Consulte os pedidos aceitos, status de entrega e contato dos lojistas parceiros.'}
              {activeModal === 'avaliacoes' && 'Veja as avaliações deixadas para os lojistas e sua pontuação na comunidade.'}
              {activeModal === 'dados' && 'Gerencie seus dados pessoais, altere sua senha ou solicite a exclusão definitiva da sua conta e dados (LGPD).'}
            </p>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
              >
                Fechar
              </button>
              <button 
                onClick={() => {
                  if (activeModal === 'comprar') {
                    window.location.href = '/cotacoes/nova';
                  } else if (activeModal === 'vender') {
                    window.location.href = '/cadastro?tipo=lojista';
                  } else if (activeModal === 'oficinas') {
                    window.location.href = '/cadastro?tipo=oficina';
                  } else if (activeModal === 'guinchos') {
                    window.location.href = '/cadastro?tipo=guincho';
                  } else {
                    alert('Ação processada com sucesso no PeçaAki SLZ!');
                  }
                  setActiveModal(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
