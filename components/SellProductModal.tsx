
import React, { useState } from 'react';
import { Product } from '../types';
import { CATEGORIES, ICONS } from '../constants';
import { Search, ChevronRight, PackageOpen, AlertCircle, Layers } from 'lucide-react';

interface SellProductModalProps {
  availableProducts: Product[];
  onClose: () => void;
  onConfirm: (productId: string, quantity: number, finalPrice: number, cash: number, tradeVal: number, date: string, tradeName?: string, tradeCategory?: string, tradeSuggestedPrice?: number) => void;
}

const SellProductModal: React.FC<SellProductModalProps> = ({ availableProducts, onClose, onConfirm }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const [sellQuantity, setSellQuantity] = useState<number>(1);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [tradeItemValue, setTradeItemValue] = useState<number>(0);
  const [tradeItemName, setTradeItemName] = useState<string>('');
  const [tradeItemCategory, setTradeItemCategory] = useState<string>(CATEGORIES[0]);
  const [tradeSuggestedPrice, setTradeSuggestedPrice] = useState<number>(0);
  const [saleDate, setSaleDate] = useState<string>(today);

  const filteredItems = availableProducts.filter(p => 
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setSellQuantity(1);
    setCashAmount(p.suggestedPrice);
  };

  const finalPrice = (cashAmount || 0) + (tradeItemValue || 0);
  // O lucro é calculado sobre a quantidade vendida
  const totalCost = selectedProduct ? (selectedProduct.purchasePrice * sellQuantity) : 0;
  const realProfit = finalPrice - totalCost;
  
  const isPriceValid = selectedProduct ? finalPrice >= totalCost : true;
  const isQuantityValid = selectedProduct ? (sellQuantity > 0 && sellQuantity <= selectedProduct.quantity) : true;
  const tradeValidationFailed = (tradeItemValue > 0 && !tradeItemName) || (tradeItemName && tradeItemValue <= 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-lg rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col">
        
        {!selectedProduct ? (
          <div className="p-8 flex flex-col h-full overflow-hidden">
            <header className="mb-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">Nova Venda / Brique</h3>
              <p className="text-slate-400 font-medium">Selecione o item que sairá do estoque.</p>
            </header>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="Buscar item disponível..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {filteredItems.length > 0 ? (
                filteredItems.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="w-full text-left p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-500 group-hover:text-blue-500 transition-colors">
                        <PackageOpen size={20}/>
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.category} • {p.quantity} un. em estoque</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-500">Nenhum item disponível encontrado.</p>
                </div>
              )}
            </div>

            <button onClick={onClose} className="mt-6 w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-95">Cancelar</button>
          </div>
        ) : (
          <div className="p-8 overflow-y-auto custom-scrollbar">
            <header className="mb-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Detalhes do Brique</h3>
                <p className="text-slate-400 font-medium">Item: <span className="text-blue-400 font-bold">{selectedProduct.name}</span></p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-all">Trocar Item</button>
            </header>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Data</label>
                  <input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} className="w-full bg-transparent border-none p-0 focus:ring-0 text-white font-medium" />
                </div>
                <div className={`bg-slate-800/50 p-4 rounded-2xl border ${!isQuantityValid ? 'border-red-500/50 ring-1 ring-red-500' : 'border-slate-800'}`}>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Qtd a Vender (Máx: {selectedProduct.quantity})</label>
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-slate-500" />
                    <input 
                      type="number" 
                      min="1" 
                      max={selectedProduct.quantity}
                      value={sellQuantity === 0 ? '' : sellQuantity} 
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setSellQuantity(val);
                        if (val > 0) {
                          setCashAmount(selectedProduct.suggestedPrice * val);
                        }
                      }}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-white font-bold" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 p-5 rounded-3xl border border-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-green-500">{ICONS.Money}</div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Recebido em Dinheiro (Total)</h4>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-slate-500 mr-2">R$</span>
                  <input type="number" value={cashAmount === 0 ? '' : cashAmount} placeholder="0,00" onChange={e => setCashAmount(parseFloat(e.target.value) || 0)} className="flex-1 bg-transparent border-none text-2xl font-bold focus:ring-0 text-white p-0" />
                </div>
              </div>

              <div className={`p-5 rounded-3xl border transition-all ${tradeItemName || tradeItemValue > 0 ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-800/30 border-slate-800/50 opacity-60'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-blue-400">{ICONS.Trade}</div>
                  <h4 className="text-sm font-bold text-slate-300 uppercase">Item de Troca (Opcional)</h4>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Nome do item" value={tradeItemName} onChange={e => setTradeItemName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-white text-sm" />
                    <select 
                      value={tradeItemCategory}
                      onChange={e => setTradeItemCategory(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-white text-sm appearance-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 flex items-center">
                      <span className="text-sm font-bold text-slate-500 mr-1">R$</span>
                      <input type="number" placeholder="Custo" value={tradeItemValue === 0 ? '' : tradeItemValue} onChange={e => setTradeItemValue(parseFloat(e.target.value) || 0)} className="flex-1 bg-transparent border-none text-sm font-bold text-white p-0" />
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 flex items-center">
                      <span className="text-sm font-bold text-slate-500 mr-1">R$</span>
                      <input type="number" placeholder="P/ Venda" value={tradeSuggestedPrice === 0 ? '' : tradeSuggestedPrice} onChange={e => setTradeSuggestedPrice(parseFloat(e.target.value) || 0)} className="flex-1 bg-transparent border-none text-sm font-bold text-white p-0" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Valor do Negócio</p>
                  <p className="text-xl font-black text-white">R$ {finalPrice.toFixed(2)}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${isPriceValid ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <p className={`text-[10px] uppercase font-bold mb-1 ${isPriceValid ? 'text-green-400' : 'text-red-400'}`}>{isPriceValid ? 'Lucro Bruto' : 'Prejuízo!'}</p>
                  <p className={`text-xl font-black ${isPriceValid ? 'text-green-400' : 'text-red-400'}`}>R$ {realProfit.toFixed(2)}</p>
                </div>
              </div>

              {!isQuantityValid && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={16} />
                  <p className="text-[10px] text-red-400 font-bold uppercase">Quantidade superior ao estoque disponível!</p>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button onClick={onClose} className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all text-white">Cancelar</button>
                <button 
                  disabled={tradeValidationFailed || !isPriceValid || !isQuantityValid}
                  onClick={() => onConfirm(selectedProduct!.id, sellQuantity, finalPrice, cashAmount, tradeItemValue, saleDate, tradeItemName, tradeItemCategory, tradeSuggestedPrice)}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all disabled:opacity-50 text-white shadow-lg shadow-blue-900/20 active:scale-95"
                >
                  Confirmar Venda
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellProductModal;
