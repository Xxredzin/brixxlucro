
import React, { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import SalesList from './components/SalesList';
import Reports from './components/Reports';
import SellProductModal from './components/SellProductModal';
import ConfirmModal from './components/ConfirmModal';
import { useAppState } from './hooks/useAppState';
import { Product } from './types';
import { ICONS } from './constants';
import { Download, Upload, Store, ShieldAlert, CheckCircle2, Infinity as InfinityIcon, Share } from 'lucide-react';

const App: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Runtime error:', error);
      setHasError(true);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const { 
    products, 
    sales, 
    settings,
    currentView, 
    setCurrentView, 
    addProduct,
    updateProduct,
    deleteProduct, 
    deleteSale,
    sellProduct,
    updateSettings,
    importData
  } = useAppState();

  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [editBusinessName, setEditBusinessName] = useState(settings.businessName);
  const fileImportRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detecta se é iOS e se NÃO está rodando como PWA instalado
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    
    if (isIOS && !isStandalone) {
      setShowInstallPrompt(true);
    }
  }, []);

  const handleFinalizeSale = (productId: string, quantity: number, finalPrice: number, cash: number, tradeVal: number, date: string, tradeName?: string, tradeCategory?: string, tradeSuggestedPrice?: number) => {
    sellProduct(productId, quantity, finalPrice, cash, tradeVal, date, tradeName, tradeCategory, tradeSuggestedPrice);
    setIsNewSaleModalOpen(false);
    setCurrentView('Vendas');
  };

  const handleResetDatabase = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleExportData = () => {
    const data = {
      products,
      sales,
      settings,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brixlucro_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (confirm('Deseja realmente importar esses dados? Isso substituirá suas informações atuais.')) {
            importData(json);
            alert('Dados importados com sucesso!');
          }
        } catch (err) {
          alert('Erro ao importar arquivo. Verifique se o formato JSON é válido.');
        }
      };
      reader.readAsText(file);
    }
    if (fileImportRef.current) fileImportRef.current.value = '';
  };

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard products={products} sales={sales} />;
      case 'Produtos':
        return (
          <ProductList 
            products={products} 
            onAdd={addProduct} 
            onUpdate={updateProduct}
            onDelete={deleteProduct} 
          />
        );
      case 'Vendas':
        return (
          <SalesList 
            sales={sales} 
            onDeleteSale={deleteSale} 
            onNewSale={() => setIsNewSaleModalOpen(true)} 
          />
        );
      case 'Relatórios':
        return <Reports sales={sales} products={products} />;
      case 'Configurações':
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <header>
              <h2 className="text-3xl font-bold text-white">Administração</h2>
              <p className="text-slate-400">Gerencie seu perfil, dados e segurança.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-500">
                    <Store size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Perfil do Negócio</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1 ml-1">Nome do Negócio</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editBusinessName}
                        onChange={(e) => setEditBusinessName(e.target.value)}
                        className="flex-1 bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-white"
                        placeholder="Ex: Minha Loja"
                      />
                      <button 
                        onClick={() => updateSettings({ businessName: editBusinessName })}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all active:scale-90"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest">Sua Licença BrixLucro</p>
                      <p className="font-black text-slate-100 text-lg flex items-center gap-2">
                        VITALÍCIA <InfinityIcon size={18} className="text-amber-500" />
                      </p>
                    </div>
                    <div className="bg-amber-500/20 text-amber-500 text-[10px] font-black px-3 py-1.5 rounded-full border border-amber-500/30">ATIVO</div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-green-600/10 p-4 rounded-2xl text-green-500">
                    <Download size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Gerenciamento de Dados</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6">Mantenha seus dados seguros exportando um arquivo de backup.</p>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={handleExportData}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-95 border border-slate-700"
                  >
                    <Download size={18} /> Exportar Backup (JSON)
                  </button>
                  <button 
                    onClick={() => fileImportRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all active:scale-95"
                  >
                    <Upload size={18} /> Importar Dados (JSON)
                  </button>
                  <input 
                    type="file" 
                    ref={fileImportRef} 
                    onChange={handleImportFile} 
                    className="hidden" 
                    accept=".json"
                  />
                </div>
              </div>

              <div className="bg-card p-8 rounded-[2.5rem] border border-slate-800 shadow-xl md:col-span-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-red-600/10 p-4 rounded-2xl text-red-500">
                    <ShieldAlert size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Zona de Perigo</h3>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <p className="text-white font-bold mb-1">Limpar Base de Dados</p>
                    <p className="text-slate-400 text-sm">Apaga todos os dados localmente.</p>
                  </div>
                  <button 
                    onClick={() => setShowResetConfirm(true)}
                    className="px-8 py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95 border border-red-500/20"
                  >
                    Resetar Sistema
                  </button>
                </div>
              </div>
            </div>

            <ConfirmModal 
              isOpen={showResetConfirm}
              title="Limpar Sistema?"
              message="Deseja realmente limpar todos os dados? Ação irreversível."
              confirmText="Limpar Tudo"
              onConfirm={handleResetDatabase}
              onCancel={() => setShowResetConfirm(false)}
            />
          </div>
        );
      default:
        return <Dashboard products={products} sales={sales} />;
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-2xl font-bold text-white">Ops! Algo deu errado.</h1>
          <p className="text-slate-400">Ocorreu um erro inesperado. Tente recarregar a página ou limpar os dados do navegador.</p>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all"
          >
            Resetar e Recarregar
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}

      {isNewSaleModalOpen && (
        <SellProductModal 
          availableProducts={products.filter(p => p.status === 'Disponível' && p.quantity > 0)} 
          onClose={() => setIsNewSaleModalOpen(false)}
          onConfirm={handleFinalizeSale}
        />
      )}

      {/* iOS PWA Install Instructions */}
      {showInstallPrompt && (
        <div className="fixed bottom-24 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10">
          <div className="bg-blue-600 text-white p-6 rounded-[2rem] shadow-2xl border border-blue-400">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-lg">Instale para salvar dados!</h4>
              <button onClick={() => setShowInstallPrompt(false)} className="text-white/50">✕</button>
            </div>
            <p className="text-sm text-blue-100 mb-4 leading-snug">No iPhone, o Safari apaga dados se não estiver instalado. Instale o app na tela de início:</p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest bg-blue-700/50 p-3 rounded-xl">
              <span className="flex items-center gap-1">Clique em <Share size={14} /></span>
              <span className="w-px h-3 bg-blue-500"></span>
              <span>"Tela de Início"</span>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
