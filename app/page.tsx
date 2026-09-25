'use client';

import { useState, useEffect } from 'react';
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
  Sun,
  Moon,
  MapPin,
  X,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export default function HomeDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'comprar' | 'vender' | 'oficinas' | 'guinchos' | 'guia'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCadastreseOpen, setIsCadastreseOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Alternar tema Claro/Escuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const openCadastroModal = (tipo: string) => {
    setActiveModal(`cadastro_${tipo}`);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* 1. BARRA SUPERIOR (HEADER) */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md px-4 py-2.5 transition-colors ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Logo Oficial e Texto ao Lado */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setActiveTab('home')}>
            <img 
              src="/PeçaAki_Logomarca_SF.png" 
              alt="PeçaAki Auto & Moto" 
              className="h-10 md:h-11 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className={`text-xs md:text-sm font-bold leading-tight ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Marketplace de peças – Grande São Luís/MA
              </span>
            </div>
          </Link>

          {/* Botões Direitos de Ícone: Perfil de Usuário + Alternância de Tema (Sol/Lua) */}
          <div className="flex items-center gap-2">
            
            {/* Botão Perfil (Ícone Circular) */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu do Usuário"
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-95 shadow-sm ${darkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}
              >
                <User className="w-5 h-5 text-red-600" />
              </button>

              {/* Dropdown Meu Espaço */}
              {isMenuOpen && (
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl py-2 z-50 border animate-in fade-in ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                  <div className={`px-4 py-2 border-b mb-1 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Painel do Usuário</p>
                    <p className="text-xs font-bold">Minha Conta SLZ</p>
                  </div>
                  
                  <button onClick={() => { setActiveModal('orcamentos'); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                    <FileText className="w-4 h-4 text-red-600" /> Orçamentos (Solicitados & Recebidos)
                  </button>
                  <button onClick={() => { setActiveModal('compras'); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                    <Package className="w-4 h-4 text-red-600" /> Minhas Compras e Pedidos
                  </button>
                  <button onClick={() => { setActiveModal('avaliacoes'); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                    <Star className="w-4 h-4 text-amber-500" /> Avaliações Feitas e Recebidas
                  </button>
                  
                  <div className={`border-t my-1 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}></div>
                  
                  <button onClick={() => { setActiveModal('dados'); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs text-red-500 flex items-center gap-2.5 transition-colors ${darkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}>
                    <Settings className="w-4 h-4" /> Dados Cadastrais & Exclusão de Conta
                  </button>
                </div>
              )}
            </div>

            {/* Botão Alternância de Tema (Lua / Sol) */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Alternar Modo Claro e Escuro"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95 ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 py-4 pb-28">
        
        {/* 2. BANNER PRINCIPAL (CARD DESTAQUE CENTRAL COM DEGRADÊ ESCURO E BORDA ARREDONDADA) */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white border border-slate-800 p-5 md:p-8 shadow-2xl mb-6">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            
            {/* Selo Indicador Arredondado com Ícone de Localização */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs md:text-sm font-medium mb-5 shadow-inner">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>Cobertura: São Luís, Paço, Ribamar e Raposa</span>
            </div>

            {/* Título Principal */}
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-3 leading-snug">
              Encontre peças para <span className="text-red-500 font-extrabold">carros e motos</span> na hora!
            </h2>

            {/* Subtítulo Explicativo */}
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl mb-6 font-normal">
              Faça sua cotação sob demanda. As autopeças e motopeças da Ilha respondem direto no seu celular com preço e frete.
            </p>

            {/* 3. SEÇÃO DE CADASTRO INTERATIVO E ILUSTRAÇÕES NAS LATERAIS */}
            <div className="w-full flex items-center justify-between gap-2 md:gap-4 mt-2">
              
              {/* Ilustração Esquerda: Componentes de Carro */}
              <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 w-28 md:w-36 text-center shrink-0 shadow-lg">
                <div className="flex gap-1 mb-1.5 text-red-500">
                  <Car className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-white">Linha Auto</span>
                <span className="text-[9px] text-slate-400 leading-tight">Motor, Freios & Suspensão</span>
              </div>

              {/* Bloco Centralizado "Cadastre-se" com Seta Indicativa */}
              <div className="flex-1 bg-white text-slate-900 rounded-3xl p-4 md:p-5 shadow-2xl border border-slate-200 text-center relative z-10">
                <button 
                  onClick={() => setIsCadastreseOpen(!isCadastreseOpen)}
                  className="w-full flex items-center justify-center gap-1.5 text-red-600 font-extrabold text-sm md:text-base mb-1 hover:text-red-700 transition-colors"
                >
                  <span>Cadastre-se</span>
                  <span className="text-red-600 text-lg">⇩</span>
                </button>
                <p className="text-[10px] md:text-xs text-amber-700 font-semibold mb-2.5">(abre as opções:)</p>

                {/* Opções de Cadastro */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button 
                    onClick={() => openCadastroModal('comprador')}
                    className="bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-600 font-bold py-2 px-2 rounded-xl text-xs transition-all border border-slate-200 active:scale-95 flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
                    <span>Comprador</span>
                  </button>

                  <button 
                    onClick={() => openCadastroModal('vendedor')}
                    className="bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-600 font-bold py-2 px-2 rounded-xl text-xs transition-all border border-slate-200 active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Store className="w-3.5 h-3.5 text-red-600" />
                    <span>Vendedor</span>
                  </button>

                  <button 
                    onClick={() => openCadastroModal('oficina')}
                    className="bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-600 font-bold py-2 px-2 rounded-xl text-xs transition-all border border-slate-200 active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Wrench className="w-3.5 h-3.5 text-red-600" />
                    <span>Oficina</span>
                  </button>

                  <button 
                    onClick={() => openCadastroModal('guincho')}
                    className="bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-600 font-bold py-2 px-2 rounded-xl text-xs transition-all border border-slate-200 active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5 text-red-600" />
                    <span>Guincho</span>
                  </button>
                </div>
              </div>

              {/* Ilustração Direita: Componentes de Moto */}
              <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 w-28 md:w-36 text-center shrink-0 shadow-lg">
                <div className="flex gap-1 mb-1.5 text-red-500">
                  <Bike className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-white">Linha Moto</span>
                <span className="text-[9px] text-slate-400 leading-tight">Transmissão & Elétrica</span>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTÕES DE ACESSO RÁPIDO (GRID 2x2 COM CORES DISTINTAS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
          
          {/* Botão 1 (Azul Claro): COMPRAR - "Faça sua cotação" */}
          <Link 
            href="/cotacoes/nova"
            className="group bg-blue-200 hover:bg-blue-300 text-slate-900 border border-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900/70 dark:text-blue-100 dark:border-blue-700/60 p-5 rounded-2xl transition-all duration-200 active:scale-95 shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-extrabold tracking-wide uppercase">COMPRAR</span>
              <ShoppingBag className="w-6 h-6 text-blue-700 dark:text-blue-300 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-blue-200">
              Faça sua cotação
            </p>
          </Link>

          {/* Botão 2 (Verde Claro): VENDER (Lojista) - "Receba o pedido" */}
          <Link 
            href="/lojista/radar"
            className="group bg-emerald-200 hover:bg-emerald-300 text-slate-900 border border-emerald-300 dark:bg-emerald-900/50 dark:hover:bg-emerald-900/70 dark:text-emerald-100 dark:border-emerald-700/60 p-5 rounded-2xl transition-all duration-200 active:scale-95 shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-extrabold tracking-wide uppercase">VENDER (Lojista)</span>
              <Store className="w-6 h-6 text-emerald-700 dark:text-emerald-300 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
              Receba o pedido
            </p>
          </Link>

          {/* Botão 3 (Amarelo/Dourado Claro): OFICINAS - "Localize uma oficina próxima" */}
          <button 
            onClick={() => openCadastroModal('oficina')}
            className="group text-left bg-amber-200 hover:bg-amber-300 text-slate-900 border border-amber-300 dark:bg-amber-900/50 dark:hover:bg-amber-900/70 dark:text-amber-100 dark:border-amber-700/60 p-5 rounded-2xl transition-all duration-200 active:scale-95 shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-extrabold tracking-wide uppercase">OFICINAS</span>
              <Wrench className="w-6 h-6 text-amber-700 dark:text-amber-300 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-amber-200">
              Localize uma oficina próxima
            </p>
          </button>

          {/* Botão 4 (Cinza Claro): GUINCHOS - "Solicite reboque" */}
          <button 
            onClick={() => openCadastroModal('guincho')}
            className="group text-left bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700 p-5 rounded-2xl transition-all duration-200 active:scale-95 shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-extrabold tracking-wide uppercase">GUINCHOS</span>
              <Truck className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Solicite reboque
            </p>
          </button>

        </div>

      </main>

      {/* 5. BARRA DE NAVEGAÇÃO INFERIOR (BOTTOM NAVIGATION FIXA NO RODAPÉ) */}
      <nav aria-label="Navegação Principal" className={`fixed bottom-0 left-0 right-0 z-40 border-t px-2 py-2 backdrop-blur-md shadow-2xl ${darkMode ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
        <div className="max-w-md mx-auto grid grid-cols-6 gap-1">
          
          {/* Início */}
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 ${activeTab === 'home' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Início</span>
          </button>

          {/* Comprar */}
          <Link 
            href="/cotacoes/nova"
            onClick={() => setActiveTab('comprar')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 ${activeTab === 'comprar' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Comprar</span>
          </Link>

          {/* Vender */}
          <Link 
            href="/lojista/radar"
            onClick={() => setActiveTab('vender')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 ${activeTab === 'vender' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Store className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Vender</span>
          </Link>

          {/* Oficinas */}
          <button 
            onClick={() => { setActiveTab('oficinas'); openCadastroModal('oficina'); }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 ${activeTab === 'oficinas' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Wrench className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Oficinas</span>
          </button>

          {/* Guinchos (DESTACADO EM VERMELHO/ROSA NA IMAGEM DE REFERÊNCIA) */}
          <button 
            onClick={() => { setActiveTab('guinchos'); openCadastroModal('guincho'); }}
            className="flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-800/60 shadow-sm"
          >
            <Truck className="w-4 h-4 mb-0.5 text-red-600" />
            <span className="text-[9px]">Guinchos</span>
          </button>

          {/* Guia */}
          <button 
            onClick={() => { setActiveTab('guia'); setActiveModal('guia'); }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 ${activeTab === 'guia' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Guia</span>
          </button>

        </div>
      </nav>

      {/* MODAIS DE CADASTRO E GERENCIAMENTO */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`border rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* FORMULÁRIO DE CADASTRO: COMPRADOR */}
            {activeModal === 'cadastro_comprador' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-red-600/10 text-red-600"><ShoppingBag className="w-5 h-5"/></div>
                  <div>
                    <h3 className="text-base font-bold">Cadastro de Comprador</h3>
                    <p className="text-xs text-slate-400">Para motoristas, motociclistas e mecânicos na Grande São Luís</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Nome Completo</label>
                    <input type="text" placeholder="Ex: Doriedson Serra" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">WhatsApp de Contato</label>
                    <input type="text" placeholder="(98) 99999-9999" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Bairro / Região (São Luís, Paço, Ribamar, Raposa)</label>
                    <input type="text" placeholder="Ex: Cohab, Maiobão, Anil, Renascença..." className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Veículo Principal na Garagem</label>
                    <input type="text" placeholder="Ex: Nissan Versa 1.6 / Honda CG 160 Fan" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                </div>
              </div>
            )}

            {/* FORMULÁRIO DE CADASTRO: VENDEDOR */}
            {activeModal === 'cadastro_vendedor' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-red-600/10 text-red-600"><Store className="w-5 h-5"/></div>
                  <div>
                    <h3 className="text-base font-bold">Cadastro de Vendedor / Autopeça</h3>
                    <p className="text-xs text-slate-400">Disponibilize seu estoque para a Grande São Luís</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Nome da Empresa / Autopeça</label>
                    <input type="text" placeholder="Ex: Auto Peças São Luís" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold mb-1">CNPJ</label>
                      <input type="text" placeholder="00.000.000/0001-00" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">WhatsApp Comercial</label>
                      <input type="text" placeholder="(98) 9... vendedor" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Especialidade</label>
                    <select className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}>
                      <option>Linha Leve (Carros Nacionais e Importados)</option>
                      <option>Linha Duas Rodas (Motopeças)</option>
                      <option>Multimarcas (Carros e Motos)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Endereço na Ilha</label>
                    <input type="text" placeholder="Av. Guajajaras, São Cristóvão - SLZ" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                </div>
              </div>
            )}

            {/* FORMULÁRIO DE CADASTRO: OFICINA */}
            {activeModal === 'cadastro_oficina' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-red-600/10 text-red-600"><Wrench className="w-5 h-5"/></div>
                  <div>
                    <h3 className="text-base font-bold">Cadastro de Oficina Mecânica</h3>
                    <p className="text-xs text-slate-400">Insira sua oficina no diretório especializado</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Nome da Oficina</label>
                    <input type="text" placeholder="Ex: Oficina Mecânica Central" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Responsável / Mecânico Principal</label>
                    <input type="text" placeholder="Nome do profissional" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Serviços Prestados</label>
                    <input type="text" placeholder="Injeção, Suspensão, Motor, Elétrica..." className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                </div>
              </div>
            )}

            {/* FORMULÁRIO DE CADASTRO: GUINCHO */}
            {activeModal === 'cadastro_guincho' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-red-600/10 text-red-600"><Truck className="w-5 h-5"/></div>
                  <div>
                    <h3 className="text-base font-bold">Cadastro de Guincho / Reboque</h3>
                    <p className="text-xs text-slate-400">Atendimento de socorro 24h na região</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Nome / Empresa de Reboque</label>
                    <input type="text" placeholder="Ex: Guincho SLZ 24h" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Telefone de Plantão</label>
                    <input type="text" placeholder="(98) 9..." className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Área de Atuação</label>
                    <input type="text" placeholder="São Luís, Paço do Lumiar, Ribamar" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                </div>
              </div>
            )}

            {/* OUTROS MODAIS (Guia, Orçamentos, Compras, Dados) */}
            {activeModal === 'guia' && (
              <div>
                <h3 className="text-base font-bold mb-2">📖 Guia de Uso - PeçaAki SLZ</h3>
                <p className="text-xs text-slate-400 mb-4">Como funciona o marketplace reverso na Ilha:</p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                    <strong>1. Solicite sua peça:</strong> Informe o modelo do carro/moto e foto da peça.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                    <strong>2. Receba propostas:</strong> As autopeças de SLZ respondem com preço e prazo.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                    <strong>3. Feche no Zap:</strong> Escolha a melhor oferta e fale direto com o vendedor.
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'orcamentos' && (
              <div>
                <h3 className="text-base font-bold mb-2">📄 Meus Orçamentos</h3>
                <p className="text-xs text-slate-400 mb-4">Acompanhe as cotações solicitadas e respostas recebidas das autopeças.</p>
                <div className={`p-3 rounded-xl border text-xs ${darkMode ? 'bg-slate-800/30 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  Nenhuma cotação em aberto no momento. Clique em "COMPRAR" para solicitar uma peça.
                </div>
              </div>
            )}

            {activeModal === 'compras' && (
              <div>
                <h3 className="text-base font-bold mb-2">📦 Histórico de Compras</h3>
                <p className="text-xs text-slate-400 mb-4">Pedidos aceitos e finalizados através do marketplace reverso.</p>
                <div className={`p-3 rounded-xl border text-xs ${darkMode ? 'bg-slate-800/30 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  Seu histórico está vazio.
                </div>
              </div>
            )}

            {activeModal === 'avaliacoes' && (
              <div>
                <h3 className="text-base font-bold mb-2">⭐ Avaliações</h3>
                <p className="text-xs text-slate-400 mb-4">Sua reputação e feedback com lojistas locais.</p>
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${darkMode ? 'bg-slate-800/30 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Média atual: <strong>5.0 / 5.0</strong> (Membro Verificado SLZ)</span>
                </div>
              </div>
            )}

            {activeModal === 'dados' && (
              <div>
                <h3 className="text-base font-bold mb-2 text-red-500">⚙️ Dados Cadastrais e LGPD</h3>
                <p className="text-xs text-slate-400 mb-4">Gerencie seus dados ou solicite a exclusão definitiva da conta.</p>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs space-y-3">
                  <p className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Em conformidade com a LGPD, você pode apagar permanentemente todos os seus dados salvos no banco de dados do Supabase.</p>
                  <button onClick={() => alert('Solicitação de exclusão processada com sucesso.')} className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl transition-all">
                    Excluir Minha Conta Permanentemente
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3 justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
              >
                Fechar
              </button>
              {activeModal?.startsWith('cadastro_') && (
                <button 
                  onClick={() => {
                    alert('Cadastro realizado com sucesso no PeçaAki SLZ!');
                    setActiveModal(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Salvar Cadastro
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
