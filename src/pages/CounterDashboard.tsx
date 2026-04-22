import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { ShoppingBag, Plus, Minus, Trash2, CreditCard, Banknote, Calculator, Receipt, ShoppingCart } from 'lucide-react';

export default function CounterDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<{productId: number, quantity: number, price: number, name: string}[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  
  // Manual entry state
  const [manualProduct, setManualProduct] = useState('');
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualPrice, setManualPrice] = useState('');

  useEffect(() => {
    fetchApi('/products').then(setProducts).catch(console.error);
    fetchApi('/orders').then(setOrders).catch(console.error);
  }, []);

  const addToCart = (product: any, qty: number = 1, customPrice?: number) => {
    const priceToUse = customPrice !== undefined ? customPrice : product.price;
    const existing = cart.find(item => item.productId === product.id && item.price === priceToUse);
    if (existing) {
      setCart(cart.map(item => item.productId === product.id && item.price === priceToUse ? { ...item, quantity: item.quantity + qty } : item));
    } else {
      setCart([...cart, { productId: product.id, quantity: qty, price: priceToUse, name: product.name }]);
    }
  };

  const removeFromCart = (productId: number, price: number) => {
    const existing = cart.find(item => item.productId === productId && item.price === price);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(item => item.productId === productId && item.price === price ? { ...item, quantity: item.quantity - 1 } : item));
    } else {
      setCart(cart.filter(item => !(item.productId === productId && item.price === price)));
    }
  };

  const deleteFromCart = (productId: number, price: number) => {
    setCart(cart.filter(item => !(item.productId === productId && item.price === price)));
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualProduct) return;
    const product = products.find(p => p.id.toString() === manualProduct);
    if (!product) return;
    
    const price = manualPrice ? parseFloat(manualPrice) : product.price;
    addToCart(product, manualQuantity, price);
    
    // Reset manual form
    setManualProduct('');
    setManualQuantity(1);
    setManualPrice('');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify({ items: cart, paymentMethod })
      });
      alert('Sale completed successfully');
      setCart([]);
      fetchApi('/orders').then(setOrders);
    } catch (err: any) { alert(err.message); }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Counter / POS Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Quick Add Products</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => addToCart(p)} 
                  className="relative p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-slate-800 dark:text-slate-200 text-sm">{p.name}</span>
                    <span className="block text-sm font-medium text-slate-500 dark:text-slate-400">₹{p.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Manual Entry</h2>
            </div>
            <form onSubmit={handleManualAdd} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Product</label>
                <select 
                  required 
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" 
                  value={manualProduct} 
                  onChange={e => setManualProduct(e.target.value)}
                >
                  <option value="">Select Product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Default: ₹{p.price})</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-24">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Qty</label>
                <input 
                  type="number" 
                  min="0.1" 
                  step="0.1" 
                  required 
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" 
                  value={manualQuantity} 
                  onChange={e => setManualQuantity(parseFloat(e.target.value))} 
                />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Price (₹)</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="Default" 
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" 
                  value={manualPrice} 
                  onChange={e => setManualPrice(e.target.value)} 
                />
              </div>
              <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-[calc(100vh-8rem)] sticky top-6 shadow-inner">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-dashed border-slate-300 dark:border-slate-600 pb-4">
            <Receipt className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Current Order</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 custom-scrollbar">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">{item.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">₹{item.price} × {item.quantity} = <span className="font-semibold text-slate-700 dark:text-slate-300">₹{(item.price * item.quantity).toFixed(2)}</span></div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button onClick={() => removeFromCart(item.productId, item.price)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-md transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <button onClick={() => addToCart({id: item.productId, price: item.price}, 1, item.price)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteFromCart(item.productId, item.price)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-md transition-colors ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2">
                <ShoppingCart className="w-12 h-12 opacity-20" />
                <p>Cart is empty</p>
              </div>
            )}
          </div>
          
          <div className="border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-4 mt-auto">
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'Cash' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                  <input type="radio" name="payment" value="Cash" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} className="sr-only" />
                  <Banknote className="w-5 h-5" />
                  <span className="font-semibold">Cash</span>
                </label>
                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'Online' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                  <input type="radio" name="payment" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} className="sr-only" />
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">Online</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-6 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Total Amount</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white">₹{total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout} 
              disabled={cart.length === 0} 
              className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Process Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
