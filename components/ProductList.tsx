
import React, { useState, useRef } from 'react';
import { Product, ProductStatus } from '../types';
import { ICONS, CATEGORIES } from '../constants';
import ConfirmModal from './ConfirmModal';
import { AlertCircle, TrendingUp, DollarSign, Layers } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onAdd: (p: Omit<Product, 'id' | 'createdAt' | 'status'>) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, name: string } | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
  const [activeTab, setActiveTab] = useState<ProductStatus>('Disponível');

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: CATEGORIES[0],
    purchasePrice: 0,
    suggestedPrice: 0,
    quantity: 1
  });

  const calculateProfitValue = (purchase: number, suggested: number) => suggested - purchase;
  const calculateMargin = (purchase: number, suggested: number) => {
    if (purchase <= 0) return 0;
    return ((suggested - purchase) / purchase) * 100;
  };

  const isNewProductValid = newProduct.name.trim() !== '' && 
                            newProduct.purchasePrice > 0 && 
                            newProduct.suggestedPrice > 0 &&
                            newProduct.quantity > 0;

  const filteredProducts = products.filter(p => {
    if (!p) return false;
    const matchesName = (p.name || '').toLowerCase().includes(filter.toLowerCase());
    const matchesCat = categoryFilter === 'Todas' || p.category === categoryFilter;
    const matchesStatus = p.status === activeTab;
    return matchesName && matchesCat && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewProductValid) {
      onAdd(newProduct);
      setNewProduct({ name: '', category: CATEGORIES[0], purchasePrice: 0, suggestedPrice: 0, quantity: 1 });
      setShowAddModal(false);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      onDelete(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Produtos</h2>
          <p className="text-slate-400">Gerencie seu estoque e visualize seus lucros.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          {ICONS.Plus} Novo Produto
        </button>
      </header>

      <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 max-w-fit">
        <button
          onClick={() => setActiveTab('Disponível')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'Disponível' 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Disponíveis ({products.filter(p => p && p.status === 'Disponível').length})
        </button>
        <button
          onClick={() => setActiveTab('Vendido')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'Vendido' 
            ? 'bg-red-600 text-white shadow-lg' 
            : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Vendidos ({products.filter(p => p && p.status === 'Vendido').length})
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{ICONS.Filter}</span>
          <input 
            type="text" 
            placeholder="Buscar por nome..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-white"
          />
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 appearance-none text-white min-w-[150px]"
        >
          <option>Todas</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(p => {
          if (!p) return null;
          const profitValue = calculateProfitValue(p.purchasePrice, p.suggestedPrice);
          const totalProfitValue = profitValue * p.quantity;
          const profitPerc = calculateMargin(p.purchasePrice, p.suggestedPrice);
          const isSold = p.status === 'Vendido';

          return (
            <div key={p.id} className={`bg-card rounded-3xl border ${isSold ? 'border-slate-800 opacity-75' : 'border-slate-800'} overflow-hidden shadow-xl transition-all hover:border-slate-700 flex flex-col`}>
              <div className="relative p-6 bg-slate-800/50 flex items-center justify-between border-b border-slate-800/50">
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                    isSold 
                    ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                    : 'bg-green-500/20 text-green-400 border-green-500/30'
                  } backdrop-blur-md`}>
                    {p.status}
                  </span>
                  {!isSold && (
                    <span className="bg-blue-600/40 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-blue-500/30 backdrop-blur-md flex items-center gap-1">
                      <Layers size={10} /> {p.quantity} un.
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingProduct(p)}
                    className="p-2 bg-slate-900/60 text-white rounded-xl hover:bg-slate-900 transition-all backdrop-blur-md"
                  >
                    {ICONS.Edit}
                  </button>
                  <button 
                    onClick={() => setConfirmDelete({ id: p.id, name: p.name })}
                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 transition-all rounded-xl backdrop-blur-md"
                  >
                    {ICONS.Trash}
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{p.category}</p>
                <h3 className="text-xl font-bold mb-4 truncate text-white">{p.name || 'Sem nome'}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Unitário:</span>
                    <span className="font-bold text-slate-300">R$ {(p.purchasePrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Venda:</span>
                    <span className="font-bold text-blue-400">R$ {(p.suggestedPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/50 flex justify-between text-sm">
                    <span className="text-slate-400">Lucro/Unid:</span>
                    <span className="font-bold text-green-400">R$ {profitValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 italic">Margem:</span>
                    <span className="font-medium text-green-500/80">{profitPerc.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-8 overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">Novo Produto</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Nome do Item</label>
                  <input 
                    required
                    type="text" 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Ex: Tênis Air Max"
                    className="w-full bg-slate-800 rounded-2xl p-4 border-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Categoria</label>
                    <select 
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-slate-800 rounded-2xl p-4 border-none focus:ring-2 focus:ring-blue-500 appearance-none text-white"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Quantidade</label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      value={newProduct.quantity === 0 ? '' : newProduct.quantity}
                      onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-800 rounded-2xl p-4 border-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Preço Compra</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={newProduct.purchasePrice === 0 ? '' : newProduct.purchasePrice}
                      onChange={e => setNewProduct({...newProduct, purchasePrice: parseFloat(e.target.value) || 0})}
                      className="w-full bg-slate-800 rounded-2xl p-4 border-none focus:ring-2 focus:ring-blue-500 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Venda Sugerida</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={newProduct.suggestedPrice === 0 ? '' : newProduct.suggestedPrice}
                      onChange={e => setNewProduct({...newProduct, suggestedPrice: parseFloat(e.target.value) || 0})}
                      className="w-full bg-slate-800 rounded-2xl p-4 border-none focus:ring-2 focus:ring-blue-500 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold transition-all text-white">Cancelar</button>
                  <button type="submit" disabled={!isNewProductValid} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-4 rounded-2xl font-bold transition-all text-white shadow-lg shadow-blue-900/20">Salvar Item</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-8 overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">Editar Produto</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                onUpdate(editingProduct);
                setEditingProduct(null);
              }} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Nome do Item</label>
                  <input required type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-slate-800 rounded-2xl p-4 border-none text-white" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Qtd</label>
                    <input 
                      required 
                      type="number" 
                      min="0" 
                      value={editingProduct.quantity === 0 ? '' : editingProduct.quantity} 
                      onChange={e => setEditingProduct({...editingProduct, quantity: parseInt(e.target.value) || 0})} 
                      className="w-full bg-slate-800 rounded-2xl p-4 border-none text-white font-bold" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Compra</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      value={editingProduct.purchasePrice === 0 ? '' : editingProduct.purchasePrice} 
                      onChange={e => setEditingProduct({...editingProduct, purchasePrice: parseFloat(e.target.value) || 0})} 
                      className="w-full bg-slate-800 rounded-2xl p-4 border-none text-white font-bold" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Venda</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      value={editingProduct.suggestedPrice === 0 ? '' : editingProduct.suggestedPrice} 
                      onChange={e => setEditingProduct({...editingProduct, suggestedPrice: parseFloat(e.target.value) || 0})} 
                      className="w-full bg-slate-800 rounded-2xl p-4 border-none text-white font-bold" 
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold transition-all text-white">Cancelar</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold transition-all text-white shadow-lg shadow-blue-900/20">Salvar Alterações</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!confirmDelete}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir "${confirmDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default ProductList;
