
import React, { useState } from 'react';
import { Sale, Product } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ReportsProps {
  sales: Sale[];
  products: Product[];
}

const Reports: React.FC<ReportsProps> = ({ sales, products }) => {
  const [period, setPeriod] = useState('Geral');

  const filteredSales = sales.filter(s => {
    const saleDate = new Date(s.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (period === 'Hoje') {
      const d = new Date(s.date);
      return d.toDateString() === new Date().toDateString();
    }
    if (period === 'Últimos 7 dias') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return saleDate >= sevenDaysAgo;
    }
    if (period === 'Mês Atual') {
      return saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear();
    }
    return true; // Geral
  });

  const totalSold = filteredSales.reduce((acc, s) => acc + s.finalPrice, 0);
  const totalProfit = filteredSales.reduce((acc, s) => acc + s.profit, 0);
  const totalItemsCount = filteredSales.reduce((acc, s) => acc + s.quantity, 0);

  // Group by category
  const categoryDataMap: Record<string, number> = {};
  filteredSales.forEach(s => {
    const category = products.find(p => p.id === s.productId)?.category || 'Outros';
    categoryDataMap[category] = (categoryDataMap[category] || 0) + s.finalPrice;
  });

  const categoryData = Object.entries(categoryDataMap).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Relatórios</h2>
          <p className="text-slate-400">Visão analítica do seu negócio.</p>
        </div>
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-slate-800 border-none rounded-2xl px-4 py-2 text-sm text-white"
        >
          <option>Geral</option>
          <option>Hoje</option>
          <option>Últimos 7 dias</option>
          <option>Mês Atual</option>
        </select>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card p-6 rounded-3xl border border-slate-800 shadow-xl">
            <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Métricas Consolidadas</h4>
            <div className="space-y-6">
              <div>
                <p className="text-2xl font-black text-white">R$ {totalSold.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Volume Total de Vendas</p>
              </div>
              <div>
                <p className="text-2xl font-black text-green-500">R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Lucro Real Líquido</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-black text-blue-500">{sales.length}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Transações</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-purple-500">{totalItemsCount}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Total Itens</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-900/20">
            <h4 className="font-bold mb-2">Dica de Performance</h4>
            <p className="text-sm text-blue-100 opacity-90 leading-relaxed">
              Suas trocas representam {(filteredSales.filter(s => s.tradeItemValue > 0).length / (filteredSales.length || 1) * 100).toFixed(0)}% das negociações no período selecionado. Considere aumentar a margem nesses produtos para maior rentabilidade.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-slate-800 h-[450px] shadow-xl">
          <h4 className="text-lg font-bold mb-6 text-white">Vendas por Categoria (Valor em R$)</h4>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
