
import { useState, useEffect, useCallback } from 'react';
import { Product, Sale, View } from '../types';

const STORAGE_KEY_PRODUCTS = 'brixlucro_products';
const STORAGE_KEY_SALES = 'brixlucro_sales';
const STORAGE_KEY_SETTINGS = 'brixlucro_settings';

const INITIAL_PRODUCTS: Product[] = [];
const INITIAL_SALES: Sale[] = [];

export const useAppState = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_PRODUCTS;
    } catch (e) {
      console.error('Error loading products:', e);
      return INITIAL_PRODUCTS;
    }
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SALES);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_SALES;
    } catch (e) {
      console.error('Error loading sales:', e);
      return INITIAL_SALES;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && typeof parsed === 'object' ? parsed : { businessName: 'BrixLucro' };
    } catch (e) {
      console.error('Error loading settings:', e);
      return { businessName: 'BrixLucro' };
    }
  });

  const [currentView, setCurrentView] = useState<View>('Dashboard');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const addProduct = (p: Omit<Product, 'id' | 'createdAt' | 'status'>) => {
    const newProduct: Product = {
      ...p,
      id: generateId(),
      status: 'Disponível',
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const deleteSale = (id: string) => {
    const saleToDelete = sales.find(s => s.id === id);
    if (saleToDelete) {
      setProducts(prev => prev.map(p => {
        if (p.id === saleToDelete.productId) {
          const newQty = p.quantity + saleToDelete.quantity;
          return { 
            ...p, 
            quantity: newQty,
            status: 'Disponível'
          };
        }
        return p;
      }));
    }
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const updateSettings = (newSettings: any) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const importData = (data: any) => {
    if (data.products) setProducts(data.products);
    if (data.sales) setSales(data.sales);
    if (data.settings) setSettings(data.settings);
  };

  const sellProduct = (
    productId: string, 
    quantity: number,
    finalPrice: number, 
    cashAmount: number, 
    tradeItemValue: number, 
    date: string,
    tradeName?: string,
    tradeCategory?: string,
    tradeSuggestedPrice?: number
  ) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity < quantity) return;

    const newSale: Sale = {
      id: generateId(),
      productId: product.id,
      productName: product.name,
      quantity: quantity,
      date: date,
      finalPrice: finalPrice,
      cashAmount: cashAmount,
      tradeItemValue: tradeItemValue,
      tradeItemName: tradeName,
      purchasePrice: product.purchasePrice,
      profit: finalPrice - (product.purchasePrice * quantity)
    };

    setSales(prev => [newSale, ...prev]);
    
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newQty = Math.max(0, p.quantity - quantity);
        return { 
          ...p, 
          quantity: newQty,
          status: newQty === 0 ? 'Vendido' : 'Disponível'
        };
      }
      return p;
    }));

    if (tradeItemValue > 0 && tradeName) {
      const tradedProduct: Product = {
        id: generateId(),
        name: tradeName,
        category: tradeCategory || 'Troca',
        purchasePrice: tradeItemValue,
        suggestedPrice: tradeSuggestedPrice || (tradeItemValue * 1.5),
        quantity: 1,
        status: 'Disponível',
        createdAt: new Date().toISOString()
      };
      setProducts(prev => [tradedProduct, ...prev]);
    }
  };

  return {
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
  };
};
