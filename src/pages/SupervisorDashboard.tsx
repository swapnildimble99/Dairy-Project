import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Users, Droplet, Plus, UserPlus, Phone, MapPin, Home, Calendar, Activity, Trash2, Edit } from 'lucide-react';

export default function SupervisorDashboard() {
  const [activeTab, setActiveTab] = useState('milk');
  const [farmers, setFarmers] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [newFarmer, setNewFarmer] = useState({ id: 0, name: '', phone: '', address: '', village: '' });
  const [newCollection, setNewCollection] = useState({ farmerId: '', quantity: '', quality: 'Good' });

  useEffect(() => {
    fetchApi('/farmers').then(setFarmers).catch(console.error);
    fetchApi('/milk-collection').then(setCollections).catch(console.error);
  }, []);

  const handleAddFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newFarmer.id) {
        await fetchApi(`/farmers/${newFarmer.id}`, { method: 'PUT', body: JSON.stringify(newFarmer) });
        alert('Farmer updated successfully');
      } else {
        await fetchApi('/farmers', { method: 'POST', body: JSON.stringify(newFarmer) });
        alert('Farmer added successfully');
      }
      fetchApi('/farmers').then(setFarmers);
      setNewFarmer({ id: 0, name: '', phone: '', address: '', village: '' });
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteFarmer = async (id: number) => {
    if (!confirm('Are you sure you want to delete this farmer?')) return;
    try {
      await fetchApi(`/farmers/${id}`, { method: 'DELETE' });
      fetchApi('/farmers').then(setFarmers);
    } catch (err: any) { alert(err.message); }
  };

  const handleEditFarmer = (f: any) => {
    setNewFarmer({ id: f.id, name: f.name, phone: f.phone, address: f.address, village: f.village });
    setActiveTab('farmers');
  };

  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollection.farmerId) {
      alert('Please select a farmer');
      return;
    }
    try {
      await fetchApi('/milk-collection', { 
        method: 'POST', 
        body: JSON.stringify({ 
          ...newCollection, 
          farmerId: Number(newCollection.farmerId),
          quantity: Number(newCollection.quantity) 
        }) 
      });
      alert('Collection recorded successfully');
      fetchApi('/milk-collection').then(setCollections);
      setNewCollection({ farmerId: '', quantity: '', quality: 'Good' });
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm('Are you sure you want to delete this collection record? (Inventory will be adjusted)')) return;
    try {
      await fetchApi(`/milk-collection/${id}`, { method: 'DELETE' });
      fetchApi('/milk-collection').then(setCollections);
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Supervisor Dashboard</h1>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button onClick={() => setActiveTab('milk')} className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'milk' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>Milk Collection</button>
          <button onClick={() => setActiveTab('farmers')} className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'farmers' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>Farmers</button>
        </div>
      </div>

      {activeTab === 'milk' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Record Collection</h2>
            </div>
            <form onSubmit={handleAddCollection} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Farmer</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users className="h-4 w-4 text-slate-400" /></div>
                  <select required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors appearance-none" value={newCollection.farmerId} onChange={e => setNewCollection({...newCollection, farmerId: e.target.value})}>
                    <option value="">Select Farmer</option>
                    {farmers.map(f => <option key={f.id} value={f.id}>{f.name} - {f.village}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quantity (Liters)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Droplet className="h-4 w-4 text-slate-400" /></div>
                  <input type="number" step="0.1" placeholder="0.0" required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" value={newCollection.quantity} onChange={e => setNewCollection({...newCollection, quantity: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quality</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Activity className="h-4 w-4 text-slate-400" /></div>
                  <select className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors appearance-none" value={newCollection.quality} onChange={e => setNewCollection({...newCollection, quality: e.target.value})}>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Average</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Save Record
              </button>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Collections</h2>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Farmer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantity (L)</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quality</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                  {collections.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">{c.farmerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{c.quantity} L</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          c.quality === 'Excellent' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          c.quality === 'Good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {c.quality}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDeleteCollection(c.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {collections.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No collections recorded yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'farmers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{newFarmer.id ? 'Edit Farmer' : 'Register Farmer'}</h2>
            </div>
            <form onSubmit={handleAddFarmer} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users className="h-4 w-4 text-slate-400" /></div>
                  <input type="text" placeholder="Farmer Name" required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" value={newFarmer.name} onChange={e => setNewFarmer({...newFarmer, name: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-slate-400" /></div>
                  <input type="text" placeholder="+91 9876543210" required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" value={newFarmer.phone} onChange={e => setNewFarmer({...newFarmer, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Home className="h-4 w-4 text-slate-400" /></div>
                  <input type="text" placeholder="House No, Street" required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" value={newFarmer.address} onChange={e => setNewFarmer({...newFarmer, address: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Village</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-4 w-4 text-slate-400" /></div>
                  <input type="text" placeholder="Village Name" required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" value={newFarmer.village} onChange={e => setNewFarmer({...newFarmer, village: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" /> {newFarmer.id ? 'Update' : 'Register'}
                </button>
                {newFarmer.id !== 0 && (
                  <button type="button" onClick={() => setNewFarmer({ id: 0, name: '', phone: '', address: '', village: '' })} className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Farmer Directory</h2>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Village</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                  {farmers.map((f: any) => (
                    <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 flex items-center justify-center font-bold mr-3">
                            {f.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{f.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {f.village}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{f.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleEditFarmer(f)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteFarmer(f.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {farmers.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No farmers registered yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
