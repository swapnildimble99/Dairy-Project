import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Package, Droplet, Plus, History, Box, Layers, Trash2 } from 'lucide-react';

export default function ProductionDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [production, setProduction] = useState<any[]>([]);
  const [form, setForm] = useState({ productId: '', milkUsed: '', quantityProduced: '' });

  useEffect(() => {
    fetchApi('/products').then(setProducts).catch(console.error);
    fetchApi('/production').then(setProduction).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/production', { 
        method: 'POST', 
        body: JSON.stringify({ 
          productId: Number(form.productId), 
          milkUsed: Number(form.milkUsed), 
          quantityProduced: Number(form.quantityProduced) 
        }) 
      });
      alert('Production recorded successfully');
      fetchApi('/production').then(setProduction);
      setForm({ productId: '', milkUsed: '', quantityProduced: '' });
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteProduction = async (id: number) => {
    if (!confirm('Are you sure you want to delete this production record? (Inventory will be adjusted)')) return;
    try {
      await fetchApi(`/production/${id}`, { method: 'DELETE' });
      fetchApi('/production').then(setProduction);
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Production Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Record Production</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Product</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Box className="h-4 w-4 text-slate-400" /></div>
                <select required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors appearance-none" value={form.productId} onChange={e => setForm({...form, productId: e.target.value})}>
                  <option value="">Select Product</option>
                  {products.filter(p => p.name !== 'Milk').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Milk Used (Liters)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Droplet className="h-4 w-4 text-slate-400" /></div>
                <input type="number" step="0.1" placeholder="0.0" required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" value={form.milkUsed} onChange={e => setForm({...form, milkUsed: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quantity Produced</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Layers className="h-4 w-4 text-slate-400" /></div>
                <input type="number" step="0.1" placeholder="0.0" required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" value={form.quantityProduced} onChange={e => setForm({...form, quantityProduced: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Save Record
            </button>
          </form>
        </div>
        
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Production History</h2>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Milk Used (L)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Produced</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {production.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">{p.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{p.milkUsed} L</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600 dark:text-emerald-400">{p.quantityProduced} units</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDeleteProduction(p.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {production.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No production records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
