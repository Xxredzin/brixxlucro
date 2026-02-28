
import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ICONS } from '../constants';
import { ArrowRightLeft, TrendingUp } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Gera lista de anos dinamicamente baseada nas vendas + ano atual para garantir acesso "vitalício"
  const saleYears = sales.map(s => new Date(s.date).getFullYear());
  const minYear = Math.min(currentYear, ...saleYears, 2024);
  const years = Array.from(
    { length: currentYear - minYear + 1 }, 
    (_, i) => minYear + i
  ).sort((a, b) => b - a); // Ordena do mais recente para o mais antigo

  const filteredSales = sales.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalSold = filteredSales.reduce((acc, s) => acc + s.finalPrice, 0);
  const totalProfit = filteredSales.reduce((acc, s) => acc + s.profit, 0);
  const totalPurchase = filteredSales.reduce((acc, s) => acc + s.purchasePrice * s.quantity, 0);
  
  const profitPercentage = totalPurchase > 0 ? (totalProfit / totalPurchase) * 100 : 0;
  const itemsSold = filteredSales.reduce((acc, s) => acc + s.quantity, 0);

  // Unidades disponíveis (soma das quantidades)
  const availableItemsCount = products
    .filter(p => p.status === 'Disponível')
    .reduce((acc, p) => acc + p.quantity, 0);

  const totalInvested = products
    .filter(p => p.status === 'Disponível')
    .reduce((acc, p) => acc + (p.purchasePrice * p.quantity), 0);

  const potentialProfit = products
    .filter(p => p.status === 'Disponível')
    .reduce((acc, p) => acc + ((p.suggestedPrice - p.purchasePrice) * p.quantity), 0);

  const chartData = filteredSales.slice(0, 7).reverse().map((s, i) => ({
    name: (s.productName || 'Item').substring(0, 8) + '...',
    valor: s.finalPrice || 0,
    lucro: s.profit || 0
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-slate-400">Desempenho em {MONTHS[selectedMonth]} de {selectedYear}.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent border-none text-sm font-semibold px-3 py-1.5 focus:ring-0 cursor-pointer text-white"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i} className="bg-slate-900">{m}</option>
              ))}
            </select>
            <div className="w-px h-4 bg-slate-700"></div>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent border-none text-sm font-semibold px-3 py-1.5 focus:ring-0 cursor-pointer text-white"
            >
              {years.map(y => (
                <option key={y} value={y} className="bg-slate-900">{y}</option>
              ))}
              {!years.includes(selectedYear) && <option value={selectedYear} className="bg-slate-900">{selectedYear}</option>}
            </select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500 w-fit mb-4">{ICONS.Money}</div>
          <p className="text-slate-400 text-sm font-medium mb-1">Vendido no Período</p>
          <h3 className="text-2xl font-bold">R$ {totalSold.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="bg-green-500/10 p-3 rounded-2xl text-green-500 w-fit mb-4">{ICONS.Profit}</div>
          <p className="text-slate-400 text-sm font-medium mb-1">Lucro no Período</p>
          <h3 className="text-2xl font-bold">R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-500 w-fit mb-4">{ICONS.Produtos}</div>
          <p className="text-slate-400 text-sm font-medium mb-1">Unidades Vendidas</p>
          <h3 className="text-2xl font-bold">{itemsSold} <span className="text-slate-500 text-base font-normal">un.</span></h3>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="bg-orange-500/10 p-3 rounded-2xl text-orange-500 w-fit mb-4">{ICONS.Relatórios}</div>
          <p className="text-slate-400 text-sm font-medium mb-1">Margem Média</p>
          <h3 className="text-2xl font-bold">{profitPercentage.toFixed(1)}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Capital Investido (Estoque)</p>
            <h3 className="text-2xl font-bold text-white">R$ {totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-400">
            <ArrowRightLeft size={24} />
          </div>
        </div>

        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Potencial de Lucro (Estoque)</p>
            <h3 className="text-2xl font-bold text-green-400">R$ {potentialProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="bg-green-500/10 p-4 rounded-2xl text-green-400">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-3xl border border-slate-800 shadow-xl h-[400px]">
          <h4 className="text-lg font-bold mb-6">Últimas Vendas</h4>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }} itemStyle={{ color: '#f8fafc' }} />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#22c55e'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-4/5 flex flex-col items-center justify-center text-slate-500 gap-2">
              <p className="text-sm font-medium">Sem vendas para este período</p>
            </div>
          )}
        </div>

        <div className="bg-card p-6 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold">Resumo Estoque ({availableItemsCount} un.)</h4>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {products.filter(p => p.status === 'Disponível').length > 0 ? (
              products.filter(p => p.status === 'Disponível').map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center font-bold text-slate-400">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white truncate max-w-[120px]">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.quantity} unidades disponíveis</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-400">R$ {p.suggestedPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500"><p className="text-sm">Nenhum produto disponível</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
