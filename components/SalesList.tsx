
import React, { useState } from 'react';
import { Sale } from '../types';
import { ICONS } from '../constants';
import ConfirmModal from './ConfirmModal';
import { ArrowRightLeft, Banknote, Calendar, Plus, RefreshCw, Layers } from 'lucide-react';

interface SalesListProps {
  sales: Sale[];
  onDeleteSale: (id: string) => void;
  onNewSale: () => void;
}

const SalesList: React.FC<SalesListProps> = ({ sales, onDeleteSale, onNewSale }) => {
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, name: string } | null>(null);

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      onDeleteSale(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Histórico de Vendas</h2>
          <p className="text-slate-400">Registro detalhado de cada transação realizada.</p>
        </div>
        <button 
          onClick={onNewSale}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Nova Venda / Brique
        </button>
      </header>

      {sales.length === 0 ? (
        <div className="bg-card p-12 rounded-[2.5rem] text-center border border-slate-800">
          <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
            {ICONS.Vendas}
          </div>
          <p className="text-slate-500 font-medium">Nenhuma venda registrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map(s => {
            const hasTrade = s.tradeItemValue > 0;
            
            return (
              <div key={s.id} className="bg-card p-6 rounded-[2rem] border border-slate-800 shadow-lg transition-all hover:bg-slate-800/40 group relative overflow-hidden">
                {hasTrade && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-lg flex items-center gap-1.5">
                      <RefreshCw size={10} className="animate-spin-slow" />
                      Brique Realizado
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                  <div className="flex items-center gap-4">
                    <div className={`${hasTrade ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'} p-4 rounded-2xl transition-colors`}>
                      {hasTrade ? <RefreshCw size={24} /> : <Banknote size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">{s.productName}</h4>
                        <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg text-[10px] font-black border border-slate-700 flex items-center gap-1">
                          <Layers size={10} /> {s.quantity}x
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                        <Calendar size={12} className="text-slate-600" />
                        {new Date(s.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Valor Total</p>
                      <p className={`font-black text-2xl ${hasTrade ? 'text-blue-400' : 'text-white'}`}>R$ {s.finalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Lucro Bruto</p>
                      <div className="bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                        <p className="font-black text-lg text-green-500">R$ {s.profit.toFixed(2)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setConfirmDelete({ id: s.id, name: s.productName })}
                      className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Excluir Venda"
                    >
                      {ICONS.Trash}
                    </button>
                  </div>
                </div>

                {hasTrade && (
                  <div className="mt-6 pt-6 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-green-500">{ICONS.Money}</div>
                        <span className="text-sm font-bold text-slate-300">Entrada em Dinheiro</span>
                      </div>
                      <span className="font-bold text-white">R$ {s.cashAmount.toFixed(2)}</span>
                    </div>

                    <div className="bg-blue-600/5 p-4 rounded-2xl border border-blue-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <ArrowRightLeft size={16} className="text-blue-500 shrink-0" />
                        <div className="overflow-hidden">
                          <span className="text-sm font-bold text-blue-300 block leading-tight truncate">Recebido: {s.tradeItemName}</span>
                          <span className="text-[10px] text-blue-500/80 font-bold uppercase tracking-wider">Novo Item no Estoque</span>
                        </div>
                      </div>
                      <span className="font-bold text-blue-400 ml-4 shrink-0">R$ {s.tradeItemValue.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal 
        isOpen={!!confirmDelete}
        title="Excluir Registro de Venda"
        message={`Deseja realmente excluir a venda de "${confirmDelete?.name}"? Esta ação removerá o lucro e o valor da venda dos seus relatórios.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default SalesList;
