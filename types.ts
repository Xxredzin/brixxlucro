
export type ProductStatus = 'Disponível' | 'Vendido';

export interface Product {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  suggestedPrice: number;
  quantity: number;
  status: ProductStatus;
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number; // Quantidade vendida nesta transação
  date: string;
  finalPrice: number; // Total value of sale (Cash + Trade)
  cashAmount: number;
  tradeItemValue: number;
  tradeItemName?: string;
  purchasePrice: number; // Snapshot of unit cost at time of sale
  profit: number; // (finalPrice - (purchasePrice * quantity))
}

export type View = 'Dashboard' | 'Produtos' | 'Vendas' | 'Relatórios' | 'Configurações';
