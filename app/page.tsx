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
  CheckCircle2
} from 'lucide-react';

export default function HomeDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'comprar' | 'vender' | 'oficinas' | 'guinchos' | 'guia'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. BARRA SUPERIOR (HEADER) */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md px-4 py-2.5 transition-colors ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Logo Oficial e Texto ao Lado */}
          <Link href="/" className="flex items-center gap-3" onClick={() => setActiveTab('home')}>
            <img 
              src="/PeçaAki_Logomarca_SF.png" 
              alt="PeçaAki Logo" 
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
              <h1 className="text-base md:text-lg font-black tracking-tight leading-tight flex items-center gap-1.5">
                Peça<span className="text-red-600">Aki</span> 
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-600/10 text-red-500 font-bold border border-red-500/20">SLZ</span>
              </h1>
              <p className={`text-[10px] md:text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Marketplace de peças - Grande São Luís
              </p>
            </div>
          </Link>

          {/* Botões Direitos: Meu Espaço + Dia/Noite (Sem menu sanduíche) */}
          <div className="flex items-center gap-2">
            
            {/* Botão Meu Espaço */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 border ${darkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'}`}
              >
                <User className="w-4 h-4 text-red-600" />
                <span className="hidden sm:inline">Meu Espaço</span>
              </button>

              {/* Dropdown Meu Espaço */}
              {isMenuOpen && (
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl py-2 z-50 border animate-in fade-in ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                  <div className={`px-4 py-2 border-b mb-1 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Painel do Usuário</p>
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

            {/* Botão Dia / Noite */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Alternar Modo Claro e Escuro"
              className={`p-2.5 rounded-xl border transition-all active:scale-95 ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-24">
        
        {/* 2. BANNER PRINCIPAL (Com textos até "Faça sua cotação..." e menu de Cadastro integrado) */}
        <section className={`relative rounded-3xl overflow-hidden border mb-8 p-6 md:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 ${darkMode ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/30 border-slate-800' : 'bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/20 border-slate-800 text-white'}`}>
          <div className="max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-semibold mb-3">
              <MapPin className="w-3.5 h-3.5" /> Cobertura: São Luís, Paço, Ribamar e Raposa
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
              Encontre peças para <span className="text-red-600">carros e motos</span> na hora!
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mb-6 leading-relaxed">
              Faça sua cotação sob demanda. As autopeças e motopeças da Ilha respondem direto no seu celular com preço e frete.
            </p>
            
            {/* Opções de Cadastro Substitutas */}
            <div className="flex flex-wrap gap-2.5">
              <button 
                onClick={() => openCadastroModal('comprador')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Cadastrar Comprador
              </button>
              <button 
                onClick={() => openCadastroModal('vendedor')}
                className={`border font-semibold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 flex items-center gap-2 ${darkMode ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'}`}
              >
                <Store className="w-4 h-4 text-red-500" /> Cadastrar Vendedor
              </button>
              <button 
                onClick={() => openCadastroModal('oficina')}
                className={`border font-semibold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 flex items-center gap-2 ${darkMode ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'}`}
              >
                <Wrench className="w-4 h-4 text-red-500" /> Cadastrar Oficina
              </button>
              <button 
                onClick={() => openCadastroModal('guincho')}
                className={`border font-semibold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 flex items-center gap-2 ${darkMode ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'}`}
              >
                <Truck className="w-4 h-4 text-red-500" /> Cadastrar Guincho
              </button>
            </div>
          </div>

          {/* Destaque Visual Carros e Motos */}
          <div className="relative w-full lg:w-auto flex justify-center items-center">
            <div className="absolute w-40 h-40 bg-red-600/20 rounded-full blur-2xl -z-10"></div>
            <div className="grid grid-cols-2 gap-3 max-w-xs w-full">
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col items-center text-center shadow-lg">
                <Car className="w-8 h-8 text-red-500 mb-1.5" />
                <span className="text-xs font-bold text-white">Carros</span>
                <span className="text-[10px] text-slate-400">Suspensão & Motor</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col items-center text-center shadow-lg">
                <Bike className="w-8 h-8 text-red-500 mb-1.5" />
                <span className="text-xs font-bold text-white">Motos</span>
                <span className="text-[10px] text-slate-400">Transmissão & Óleo</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cabeçalho da Seção de Quadrantes */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Acessos Rápidos</h3>
            <p className="text-xs text-slate-400">Selecione uma das opções abaixo para gerenciar ou solicitar serviços:</p>
          </div>
        </div>

        {/* 3. QUADRANTES AJUSTADOS MENORES (Dois a dois / Grid compacto) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
          
          {/* Comprar */}
          <div 
            onClick={() => { setActiveTab('comprar'); openCadastroModal('comprador'); }}
            className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-200 active:scale-98 shadow-sm flex items-center justify-between ${darkMode ? 'bg-slate-900/80 border-slate-800 hover:border-red-500/50' : 'bg-white border-slate-200 hover:border-red-500/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600 shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold group-hover:text-red-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>Comprar Peças</h4>
                <p className="text-[11px] text-slate-400">Cotação sob demanda na Ilha</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Vender */}
          <div 
            onClick={() => { setActiveTab('vender'); openCadastroModal('vendedor'); }}
            className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-200 active:scale-98 shadow-sm flex items-center justify-between ${darkMode ? 'bg-slate-900/80 border-slate-800 hover:border-red-500/50' : 'bg-white border-slate-200 hover:border-red-500/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600 shrink-0 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold group-hover:text-red-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>Vender (Lojistas)</h4>
                <p className="text-[11px] text-slate-400">Receba pedidos de autopeças</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Oficinas */}
          <div 
            onClick={() => { setActiveTab('oficinas'); openCadastroModal('oficina'); }}
            className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-200 active:scale-98 shadow-sm flex items-center justify-between ${darkMode ? 'bg-slate-900/80 border-slate-800 hover:border-red-500/50' : 'bg-white border-slate-200 hover:border-red-500/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600 shrink-0 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold group-hover:text-red-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>Oficinas</h4>
                <p className="text-[11px] text-slate-400">Diretório de centros automotivos</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Guinchos */}
          <div 
            onClick={() => { setActiveTab('guinchos'); openCadastroModal('guincho'); }}
            className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-200 active:scale-98 shadow-sm flex items-center justify-between ${darkMode ? 'bg-slate-900/80 border-slate-800 hover:border-red-500/50' : 'bg-white border-slate-200 hover:border-red-500/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600 shrink-0 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold group-hover:text-red-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>Guinchos 24h</h4>
                <p className="text-[11px] text-slate-400">Socorro mecânico e reboque</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>

        </div>

      </main>

      {/* 4. BARRA DE RODAPÉ (BOTTOM NAVIGATION COM BOTÕES DOS QUADRANTES + INÍCIO + GUIA) */}
      <nav aria-label="Navegação do Rodapé" className={`fixed bottom-0 left-0 right-0 z-40 border-t px-2 py-2 backdrop-blur-md shadow-2xl ${darkMode ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
        <div className="max-w-xl mx-auto grid grid-cols-6 gap-1">
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-90 ${activeTab === 'home' ? 'text-red-600 bg-red-600/10 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Home className="w-4 h-4 mb-1" />
            <span className="text-[9px]">Início</span>
          </button>

          <button 
            onClick={() => { setActiveTab('comprar'); openCadastroModal('comprador'); }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-90 ${activeTab === 'comprar' ? 'text-red-600 bg-red-600/10 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ShoppingBag className="w-4 h-4 mb-1" />
            <span className="text-[9px]">Comprar</span>
          </button>

          <button 
            onClick={() => { setActiveTab('vender'); openCadastroModal('vendedor'); }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-90 ${activeTab === 'vender' ? 'text-red-600 bg-red-600/10 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Store className="w-4 h-4 mb-1" />
            <span className="text-[9px]">Vender</span>
          </button>

          <button 
            onClick={() => { setActiveTab('oficinas'); openCadastroModal('oficina'); }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-90 ${activeTab === 'oficinas' ? 'text-red-600 bg-red-600/10 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Wrench className="w-4 h-4 mb-1" />
            <span className="text-[9px]">Oficinas</span>
          </button>

          <button 
            onClick={() => { setActiveTab('guinchos'); openCadastroModal('guincho'); }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-90 ${activeTab === 'guinchos' ? 'text-red-600 bg-red-600/10 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Truck className="w-4 h-4 mb-1" />
            <span className="text-[9px]">Guinchos</span>
          </button>

          <button 
            onClick={() => setActiveTab('guia')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-90 ${activeTab === 'guia' ? 'text-red-600 bg-red-600/10 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <BookOpen className="w-4 h-4 mb-1" />
            <span className="text-[9px]">Guia</span>
          </button>

        </div>
      </nav>

      {/* 5. MODAIS DE CADASTRO E GERENCIAMENTO */}
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
                    <p className="text-xs text-slate-400">Para motoristas, motociclistas e mecânicos em São Luís</p>
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
                    <label className="block font-semibold mb-1">Bairro / Região (Grande São Luís)</label>
                    <input type="text" placeholder="Ex: Cohab, Maiobão, Anil, Renascença..." className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Veículo Principal na Garagem</label>
                    <input type="text" placeholder="Ex: Nissan Versa Unique 1.6 / Honda CG 160" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
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
                      <input type="text" placeholder="(98) 9... técnico" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
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

            {/* OUTROS MODAIS (Orçamentos, Compras, Dados) */}
            {activeModal === 'orcamentos' && (
              <div>
                <h3 className="text-base font-bold mb-2">📄 Meus Orçamentos</h3>
                <p className="text-xs text-slate-400 mb-4">Acompanhe as cotações solicitadas e respostas recebidas das autopeças.</p>
                <div className={`p-3 rounded-xl border text-xs ${darkMode ? 'bg-slate-800/30 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  Nenhuma cotação em aberto no momento. Clique em "Comprar" para solicitar uma peça.
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
