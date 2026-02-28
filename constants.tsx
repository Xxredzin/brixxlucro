
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  BarChart3, 
  Settings,
  Plus,
  ArrowRightLeft,
  DollarSign,
  ShoppingCart,
  Trash2,
  Edit,
  ChevronRight,
  Filter
} from 'lucide-react';

export const CATEGORIES = [
  'Celular',
  'Eletrônicos',
  'Vestuário',
  'Acessórios',
  'Eletrodomésticos',
  'Brinquedos',
  'Bicicleta',
  'Videogames',
  'TV',
  'Outros',
  'Troca'
];

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Produtos: <Package size={20} />,
  Vendas: <ShoppingCart size={20} />,
  Relatórios: <BarChart3 size={20} />,
  Configurações: <Settings size={20} />,
  Plus: <Plus size={20} />,
  Trade: <ArrowRightLeft size={16} />,
  Money: <DollarSign size={16} />,
  Trash: <Trash2 size={16} />,
  Edit: <Edit size={16} />,
  Next: <ChevronRight size={16} />,
  Filter: <Filter size={16} />,
  Profit: <TrendingUp size={20} />
};
