import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { ShoppingBag, Plus, Minus, Trash2, CreditCard, Banknote, Calculator, Receipt, ShoppingCart } from 'lucide-react';

/* ── Decorative SVG Illustrations ── */
const POSIllustration = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Monitor */}
    <rect x="18" y="20" width="64" height="44" rx="5" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
    <rect x="22" y="24" width="56" height="36" rx="3" fill="white" fillOpacity="0.15" />
    {/* Screen lines */}
    <rect x="26" y="28" width="30" height="3" rx="1.5" fill="white" fillOpacity="0.5" />
    <rect x="26" y="34" width="20" height="2" rx="1" fill="white" fillOpacity="0.3" />
    <rect x="26" y="39" width="24" height="2" rx="1" fill="white" fillOpacity="0.3" />
    {/* Price tag on screen */}
    <rect x="60" y="28" width="14" height="10" rx="2" fill="#fbbf24" fillOpacity="0.8" />
    <text x="63" y="36" fontSize="6" fill="#78350f" fontWeight="bold">₹</text>
    {/* Stand */}
    <rect x="44" y="64" width="12" height="6" rx="2" fill="white" fillOpacity="0.2" />
    <rect x="36" y="70" width="28" height="4" rx="2" fill="white" fillOpacity="0.15" />
    {/* Keypad */}
    {[0,1,2].map(row => [0,1,2].map(col => (
      <rect key={`${row}-${col}`} x={26 + col * 7} y={28 + row * 5} width="5" height="3" rx="1" fill="white" fillOpacity="0.0" />
    )))}
  </svg>
);

const CartIllustration = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="50" cy="50" r="46" fill="url(#cartGrad)" />
    {/* Cart body */}
    <path d="M22 30 L28 30 L36 58 L70 58 L76 38 L34 38" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Cart items */}
    <rect x="40" y="42" width="8" height="10" rx="2" fill="white" fillOpacity="0.7" />
    <rect x="52" y="44" width="8" height="8" rx="2" fill="white" fillOpacity="0.5" />
    <rect x="62" y="43" width="6" height="9" rx="2" fill="white" fillOpacity="0.6" />
    {/* Wheels */}
    <circle cx="42" cy="65" r="5" fill="white" fillOpacity="0.8" />
    <circle cx="62" cy="65" r="5" fill="white" fillOpacity="0.8" />
    <circle cx="42" cy="65" r="2" fill="url(#cartGrad)" />
    <circle cx="62" cy="65" r="2" fill="url(#cartGrad)" />
    <defs>
      <linearGradient id="cartGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
  </svg>
);

const ReceiptIllustration = () => (
  <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Receipt paper */}
    <path d="M8 8 L72 8 L72 88 L64 82 L56 88 L48 82 L40 88 L32 82 L24 88 L16 82 L8 88 Z" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
    {/* Lines */}
    <rect x="16" y="20" width="48" height="3" rx="1.5" fill="white" fillOpacity="0.5" />
    <rect x="16" y="28" width="32" height="2" rx="1" fill="white" fillOpacity="0.3" />
    <rect x="16" y="34" width="28" height="2" rx="1" fill="white" fillOpacity="0.3" />
    <rect x="16" y="40" width="36" height="2" rx="1" fill="white" fillOpacity="0.3" />
    {/* Divider */}
    <line x1="16" y1="50" x2="64" y2="50" stroke="white" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 2" />
    {/* Total */}
    <rect x="16" y="58" width="20" height="3" rx="1.5" fill="white" fillOpacity="0.4" />
    <rect x="44" y="56" width="20" height="6" rx="2" fill="#fbbf24" fillOpacity="0.8" />
  </svg>
);

const MilkBottleIcon = () => (
  <svg viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M14 4 L14 10 Q4 14 4 24 L4 46 Q4 52 10 52 L30 52 Q36 52 36 46 L36 24 Q36 14 26 10 L26 4 Z" fill="url(#bottleGrad)" />
    <rect x="13" y="2" width="14" height="6" rx="3" fill="#cbd5e1" />
    <ellipse cx="20" cy="30" rx="10" ry="6" fill="white" fillOpacity="0.3" />
    <path d="M10 36 Q20 30 30 36" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" fill="none" />
    <defs>
      <linearGradient id="bottleGrad" x1="0" y1="0" x2="40" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
  </svg>
);

const WaveAccent = () => (
  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 100 Q100 60 200 100 Q300 140 400 100 L400 160 L0 160 Z" fill="white" fillOpacity="0.07" />
    <path d="M0 125 Q100 90 200 125 Q300 160 400 125 L400 160 L0 160 Z" fill="white" fillOpacity="0.05" />
  </svg>
);

const DotsPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="white" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

export default function CounterDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<{productId: number, quantity: number, price: number, name: string}[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

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
    setManualProduct('');
    setManualQuantity(1);
    setManualPrice('');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await fetchApi('/orders', { method: 'POST', body: JSON.stringify({ items: cart, paymentMethod }) });
      alert('Sale completed successfully');
      setCart([]);
      fetchApi('/orders').then(setOrders);
    } catch (err: any) { alert(err.message); }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  /* Vivid product card color palette */
  const cardColors = [
    { bg: 'from-violet-500 to-indigo-600', light: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-200', hover: 'hover:border-violet-400' },
    { bg: 'from-rose-500 to-pink-600', light: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-200', hover: 'hover:border-rose-400' },
    { bg: 'from-amber-500 to-orange-500', light: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-200', hover: 'hover:border-amber-400' },
    { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-200', hover: 'hover:border-emerald-400' },
    { bg: 'from-sky-500 to-blue-600', light: 'bg-sky-50', icon: 'text-sky-600', border: 'border-sky-200', hover: 'hover:border-sky-400' },
    { bg: 'from-fuchsia-500 to-purple-600', light: 'bg-fuchsia-50', icon: 'text-fuchsia-600', border: 'border-fuchsia-200', hover: 'hover:border-fuchsia-400' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 30%, #e0f2fe 100%)' }}>

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl mb-8"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)' }}>
        <DotsPattern />
        <WaveAccent />
        {/* Floating orbs */}
        <div className="absolute top-3 right-8 w-24 h-24 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-4 right-32 w-32 h-32 rounded-full opacity-5 bg-white" />
        <div className="absolute top-6 left-1/2 w-12 h-12 rounded-full opacity-10 bg-white" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 sm:p-8">
          <div className="flex items-center gap-5">
            {/* POS illustration badge */}
            <div className="w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <div className="w-14 h-14">
                <POSIllustration />
              </div>
            </div>
            <div>
              <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-0.5">Point of Sale</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Counter Dashboard</h1>
              <p className="text-violet-200 text-sm mt-0.5">Manage sales, cart & payments</p>
            </div>
          </div>
          {/* Stats pill */}
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
              <p className="text-white/60 text-xs font-semibold">Products</p>
              <p className="text-white font-extrabold text-xl">{products.length}</p>
            </div>
            <div className="px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
              <p className="text-white/60 text-xs font-semibold">Orders</p>
              <p className="text-white font-extrabold text-xl">{orders.length}</p>
            </div>
            <div className="px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
              <p className="text-white/60 text-xs font-semibold">In Cart</p>
              <p className="text-white font-extrabold text-xl">{cart.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* ── Quick Add Products ── */}
            <div className="bg-white rounded-2xl shadow-md border border-violet-100 overflow-hidden">
              {/* Card header */}
              <div className="relative overflow-hidden h-20"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
                <DotsPattern />
                <WaveAccent />
                <div className="absolute right-5 bottom-0 w-14 h-14 opacity-30">
                  <CartIllustration />
                </div>
                <div className="relative z-10 flex items-center gap-3 px-6 py-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">Quick Add Products</h2>
                    <p className="text-violet-200 text-xs">Tap a product to add it to the cart</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {products.map((p, i) => {
                    const color = cardColors[i % cardColors.length];
                    return (
                      <button
                        key={p.id}
                        onClick={() => addToCart(p)}
                        className={`relative p-4 bg-white border-2 ${color.border} ${color.hover} rounded-2xl hover:shadow-lg transition-all flex flex-col items-center justify-center gap-3 group overflow-hidden`}
                      >
                        {/* Gradient shine on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />
                        {/* Milk bottle icon */}
                        <div className={`w-12 h-14 transition-transform group-hover:scale-110`}>
                          <MilkBottleIcon />
                        </div>
                        <div className="text-center relative z-10">
                          <span className="block font-extrabold text-slate-800 text-sm leading-tight">{p.name}</span>
                          <span className={`block text-sm font-bold mt-0.5 ${color.icon}`}>₹{p.price}</span>
                        </div>
                        {/* Add badge */}
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br ${color.bg} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md`}>
                          <Plus className="w-3 h-3 text-white" />
                        </div>
                      </button>
                    );
                  })}
                  {products.length === 0 && (
                    <div className="col-span-4 py-10 flex flex-col items-center gap-3 text-slate-400">
                      <ShoppingBag className="w-10 h-10 opacity-20" />
                      <p className="text-sm">No products available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Manual Entry ── */}
            <div className="bg-white rounded-2xl shadow-md border border-indigo-100 overflow-hidden">
              {/* Card header */}
              <div className="relative overflow-hidden h-20"
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%)' }}>
                <DotsPattern />
                <WaveAccent />
                <div className="absolute right-5 bottom-0 w-14 h-14 opacity-25">
                  <ReceiptIllustration />
                </div>
                <div className="relative z-10 flex items-center gap-3 px-6 py-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">Manual Entry</h2>
                    <p className="text-sky-200 text-xs">Custom quantity & override price</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleManualAdd} className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Product</label>
                    <select required className="w-full bg-white border border-indigo-200 text-slate-900 p-2.5 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm" value={manualProduct} onChange={e => setManualProduct(e.target.value)}>
                      <option value="">Select Product...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (Default: ₹{p.price})</option>)}
                    </select>
                  </div>
                  <div className="w-full sm:w-24">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Qty</label>
                    <input type="number" min="0.1" step="0.1" required className="w-full bg-white border border-violet-200 text-slate-900 p-2.5 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all shadow-sm" value={manualQuantity} onChange={e => setManualQuantity(parseFloat(e.target.value))} />
                  </div>
                  <div className="w-full sm:w-32">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Price (₹)</label>
                    <input type="number" min="0" step="0.01" placeholder="Default" className="w-full bg-white border border-amber-200 text-slate-900 p-2.5 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all shadow-sm" value={manualPrice} onChange={e => setManualPrice(e.target.value)} />
                  </div>
                  <button type="submit" className="w-full sm:w-auto text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ── Cart / Order Panel ── */}
          <div className="lg:col-span-1 rounded-2xl border border-violet-200 flex flex-col h-[calc(100vh-8rem)] sticky top-6 shadow-xl overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #1e1b4b 100%)' }}>

            {/* Cart header */}
            <div className="relative overflow-hidden px-6 py-5 border-b border-white/10">
              <DotsPattern />
              <div className="absolute right-4 top-2 w-16 h-16 opacity-15">
                <ReceiptIllustration />
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">Current Order</h2>
                  <p className="text-violet-300 text-xs">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
                </div>
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center rounded-xl p-3 border transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{item.name}</div>
                    <div className="text-xs text-violet-300 mt-0.5">
                      ₹{item.price} × {item.quantity} = <span className="text-amber-300 font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <button onClick={() => removeFromCart(item.productId, item.price)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-violet-300 hover:text-white hover:bg-orange-500/40 transition-all">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-white font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => addToCart({id: item.productId, price: item.price}, 1, item.price)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-violet-300 hover:text-white hover:bg-blue-500/40 transition-all">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteFromCart(item.productId, item.price)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-violet-300 hover:text-white hover:bg-red-500/40 transition-all ml-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center gap-4 py-12">
                  <div className="w-20 h-20">
                    <CartIllustration />
                  </div>
                  <p className="text-violet-300 font-medium text-sm">Cart is empty</p>
                  <p className="text-violet-400/60 text-xs text-center">Tap any product to add it here</p>
                </div>
              )}
            </div>

            {/* Checkout section */}
            <div className="p-5 border-t border-white/10" style={{ background: 'rgba(0,0,0,0.2)' }}>
              {/* Payment method */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-violet-300 uppercase tracking-wider mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'Cash'
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                      : 'border-white/10 bg-white/5 text-violet-300 hover:border-white/20'
                  }`}>
                    <input type="radio" name="payment" value="Cash" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} className="sr-only" />
                    <Banknote className="w-4 h-4" />
                    <span className="font-bold text-sm">Cash</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'Online'
                      ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                      : 'border-white/10 bg-white/5 text-violet-300 hover:border-white/20'
                  }`}>
                    <input type="radio" name="payment" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} className="sr-only" />
                    <CreditCard className="w-4 h-4" />
                    <span className="font-bold text-sm">Online</span>
                  </label>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-4 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-violet-300 font-semibold text-sm">Total Amount</span>
                <span className="text-3xl font-black text-white">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-4 rounded-xl font-extrabold text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                style={{ background: cart.length > 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined,
                  backgroundColor: cart.length === 0 ? 'rgba(255,255,255,0.1)' : undefined,
                  color: 'white' }}>
                <Receipt className="w-5 h-5" />
                Process Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}