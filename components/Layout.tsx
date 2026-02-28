
import React from 'react';
import { View } from '../types';
import { ICONS } from '../constants';
import { ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {
  const menuItems: View[] = ['Dashboard', 'Produtos', 'Vendas', 'Relatórios', 'Configurações'];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Sidebar for Desktop */}
      <nav className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4 sticky top-0 h-screen">
        <div className="mb-8 px-4 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-xl shadow-lg shadow-blue-900/20">BL</div>
          <h1 className="text-xl font-bold tracking-tight text-white">BrixLucro</h1>
        </div>
        
        <div className="space-y-1">
          {menuItems.map(item => (
            <button
              key={item}
              onClick={() => setCurrentView(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {ICONS[item as keyof typeof ICONS]}
              <span className="font-medium">{item}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} className="text-amber-500" />
            <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest">Plano Ativo</p>
          </div>
          <p className="text-sm font-black text-slate-100 italic">ACESSO VITALÍCIO</p>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">BL</div>
          <h1 className="font-bold text-lg text-white tracking-tight">BrixLucro</h1>
        </div>
        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          VITALÍCIO
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-8 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 px-2 py-3 flex justify-around items-center z-50 backdrop-blur-lg">
        {menuItems.slice(0, 4).map(item => (
          <button
            key={item}
            onClick={() => setCurrentView(item)}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === item ? 'text-blue-500' : 'text-slate-500'
            }`}
          >
            <div className={`transition-transform duration-200 ${currentView === item ? 'scale-110' : 'scale-100'}`}>
              {ICONS[item as keyof typeof ICONS]}
            </div>
            <span className="text-[10px] font-medium">{item}</span>
          </button>
        ))}
        <button
          onClick={() => setCurrentView('Configurações')}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentView === 'Configurações' ? 'text-blue-500' : 'text-slate-500'
          }`}
        >
          <div className={`transition-transform duration-200 ${currentView === 'Configurações' ? 'scale-110' : 'scale-100'}`}>
            {ICONS.Configurações}
          </div>
          <span className="text-[10px] font-medium">Admin</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
