import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Users, Droplet, Plus, UserPlus, Phone, MapPin, Home, Calendar, Activity, Trash2, Edit } from 'lucide-react';

/* ── Decorative SVG illustrations ── */
const MilkDropIllustration = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-90">
    <circle cx="60" cy="60" r="55" fill="url(#milkGrad)" />
    <ellipse cx="60" cy="75" rx="28" ry="22" fill="white" fillOpacity="0.92" />
    <path d="M44 62 Q60 42 76 62" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="52" cy="70" r="3" fill="#60a5fa" fillOpacity="0.5" />
    <circle cx="68" cy="72" r="2" fill="#60a5fa" fillOpacity="0.5" />
    <path d="M60 20 L56 32 Q60 36 64 32 Z" fill="white" fillOpacity="0.7" />
    <defs>
      <linearGradient id="milkGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
  </svg>
);

const FarmerIllustration = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-90">
    <circle cx="60" cy="60" r="55" fill="url(#farmerGrad)" />
    {/* Hat */}
    <ellipse cx="60" cy="38" rx="22" ry="6" fill="#fbbf24" />
    <rect x="50" y="28" width="20" height="12" rx="4" fill="#f59e0b" />
    {/* Head */}
    <circle cx="60" cy="52" r="12" fill="#fde68a" />
    {/* Body */}
    <path d="M42 90 Q42 70 60 68 Q78 70 78 90" fill="#10b981" />
    {/* Arms */}
    <path d="M44 76 Q36 72 34 64" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
    <path d="M76 76 Q84 72 86 64" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
    {/* Smile */}
    <path d="M55 55 Q60 59 65 55" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <defs>
      <linearGradient id="farmerGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="100%" stopColor="#065f46" />
      </linearGradient>
    </defs>
  </svg>
);

const CowIllustration = () => (
  <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Body */}
    <ellipse cx="80" cy="45" rx="45" ry="25" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
    {/* Head */}
    <circle cx="128" cy="40" r="18" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
    <ellipse cx="134" cy="46" rx="8" ry="5" fill="#fca5a5" />
    {/* Spots */}
    <ellipse cx="70" cy="40" rx="12" ry="8" fill="#94a3b8" fillOpacity="0.3" />
    <ellipse cx="90" cy="52" rx="8" ry="5" fill="#94a3b8" fillOpacity="0.25" />
    {/* Legs */}
    <rect x="50" y="66" width="8" height="14" rx="4" fill="#e2e8f0" />
    <rect x="66" y="66" width="8" height="14" rx="4" fill="#e2e8f0" />
    <rect x="94" y="66" width="8" height="14" rx="4" fill="#e2e8f0" />
    <rect x="110" y="66" width="8" height="14" rx="4" fill="#e2e8f0" />
    {/* Udder */}
    <ellipse cx="72" cy="68" rx="14" ry="7" fill="#fda4af" />
    {/* Horns */}
    <path d="M120 24 Q112 14 108 20" stroke="#d97706" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M132 22 Q140 12 144 18" stroke="#d97706" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Eye */}
    <circle cx="124" cy="36" r="3" fill="#1e293b" />
    <circle cx="125" cy="35" r="1" fill="white" />
    {/* Tail */}
    <path d="M36 45 Q22 38 24 50 Q26 58 34 55" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

const WaveBackground = () => (
  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 120 Q100 80 200 120 Q300 160 400 120 L400 200 L0 200 Z" fill="white" fillOpacity="0.06" />
    <path d="M0 150 Q100 110 200 150 Q300 190 400 150 L400 200 L0 200 Z" fill="white" fillOpacity="0.04" />
  </svg>
);

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
    if (!newCollection.farmerId) { alert('Please select a farmer'); return; }
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #eff6ff 100%)' }}>
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl mx-0 mb-8"
        style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #1d4ed8 100%)' }}>
        <WaveBackground />

        {/* Floating decorative circles */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-10" style={{ background: 'white' }} />
        <div className="absolute -top-6 right-24 w-32 h-32 rounded-full opacity-5" style={{ background: 'white' }} />
        <div className="absolute bottom-0 left-1/3 w-16 h-16 rounded-full opacity-10" style={{ background: 'white' }} />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-6 sm:p-8">
          <div className="flex items-center gap-5">
            {/* Cow illustration badge */}
            <div className="w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '8px' }}>
              <div className="w-12 h-8 mt-1">
                <CowIllustration />
              </div>
            </div>
            <div>
              <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-0.5">Dairy Management</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Supervisor Dashboard
              </h1>
              <p className="text-emerald-200 text-sm mt-0.5">Manage milk collection & farmer records</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
            <button
              onClick={() => setActiveTab('milk')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'milk'
                  ? 'bg-white text-emerald-700 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}>
              <Droplet className="w-4 h-4" /> Milk Collection
            </button>
            <button
              onClick={() => setActiveTab('farmers')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'farmers'
                  ? 'bg-white text-emerald-700 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}>
              <Users className="w-4 h-4" /> Farmers
            </button>
          </div>
        </div>
      </div>

      <div className="px-0 pb-10 space-y-6">

        {/* ── MILK COLLECTION TAB ── */}
        {activeTab === 'milk' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form card */}
            <div className="lg:col-span-1 relative overflow-hidden rounded-2xl shadow-md border border-emerald-100"
              style={{ background: 'linear-gradient(160deg, #ffffff 60%, #f0fdf4 100%)' }}>
              {/* Illustration top accent */}
              <div className="relative overflow-hidden h-28"
                style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)' }}>
                <WaveBackground />
                <div className="absolute right-4 bottom-2 w-20 h-20">
                  <MilkDropIllustration />
                </div>
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-200" />
                    <h2 className="text-lg font-extrabold text-white">Record Collection</h2>
                  </div>
                  <p className="text-blue-200 text-xs mt-0.5">Log fresh milk from farmers</p>
                </div>
              </div>

              <form onSubmit={handleAddCollection} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Farmer</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users className="h-4 w-4 text-emerald-400" /></div>
                    <select required className="pl-10 w-full bg-white border border-emerald-200 text-slate-900 p-2.5 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all appearance-none shadow-sm" value={newCollection.farmerId} onChange={e => setNewCollection({...newCollection, farmerId: e.target.value})}>
                      <option value="">Select Farmer</option>
                      {farmers.map(f => <option key={f.id} value={f.id}>{f.name} - {f.village}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantity (Liters)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Droplet className="h-4 w-4 text-blue-400" /></div>
                    <input type="number" step="0.1" placeholder="0.0" required className="pl-10 w-full bg-white border border-blue-200 text-slate-900 p-2.5 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm" value={newCollection.quantity} onChange={e => setNewCollection({...newCollection, quantity: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quality</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Activity className="h-4 w-4 text-amber-400" /></div>
                    <select className="pl-10 w-full bg-white border border-amber-200 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all appearance-none shadow-sm" value={newCollection.quality} onChange={e => setNewCollection({...newCollection, quality: e.target.value})}>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Average</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full text-white py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #2563eb 100%)' }}>
                  <Plus className="w-5 h-5" /> Save Record
                </button>
              </form>
            </div>

            {/* Collections table card */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              {/* Card header */}
              <div className="relative overflow-hidden h-24"
                style={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)' }}>
                <WaveBackground />
                <div className="absolute right-6 bottom-1 opacity-20">
                  <div className="w-40 h-16">
                    <CowIllustration />
                  </div>
                </div>
                <div className="relative z-10 flex items-center gap-3 p-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white">Recent Collections</h2>
                    <p className="text-emerald-200 text-xs">{collections.length} records found</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead style={{ background: 'linear-gradient(90deg, #f0fdf4 0%, #eff6ff 100%)' }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Farmer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity (L)</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Quality</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {collections.map((c: any) => (
                      <tr key={c.id} className="hover:bg-emerald-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
                              style={{ background: 'linear-gradient(135deg, #059669, #2563eb)', color: 'white' }}>
                              {c.farmerName?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{c.farmerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Droplet className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-sm font-bold text-blue-700">{c.quantity} L</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                            c.quality === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            c.quality === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {c.quality === 'Excellent' ? '⭐ ' : c.quality === 'Good' ? '✓ ' : '~ '}{c.quality}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(c.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button onClick={() => handleDeleteCollection(c.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center ml-auto text-red-400 hover:text-white hover:bg-red-500 transition-all shadow-sm border border-red-100 hover:border-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {collections.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#f0fdf4' }}>
                              <Droplet className="w-7 h-7 text-emerald-300" />
                            </div>
                            <p className="text-slate-400 font-medium">No collections recorded yet</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── FARMERS TAB ── */}
        {activeTab === 'farmers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Farmer form card */}
            <div className="lg:col-span-1 relative overflow-hidden rounded-2xl shadow-md border border-emerald-100"
              style={{ background: 'linear-gradient(160deg, #ffffff 60%, #f0fdf4 100%)' }}>
              {/* Illustration accent */}
              <div className="relative overflow-hidden h-28"
                style={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)' }}>
                <WaveBackground />
                <div className="absolute right-4 bottom-1 w-20 h-20">
                  <FarmerIllustration />
                </div>
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-emerald-200" />
                    <h2 className="text-lg font-extrabold text-white">{newFarmer.id ? 'Edit Farmer' : 'Register Farmer'}</h2>
                  </div>
                  <p className="text-emerald-200 text-xs mt-0.5">{newFarmer.id ? 'Update details below' : 'Add a new farmer to the network'}</p>
                </div>
              </div>

              <form onSubmit={handleAddFarmer} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users className="h-4 w-4 text-emerald-400" /></div>
                    <input type="text" placeholder="Farmer Name" required className="pl-10 w-full bg-white border border-emerald-200 text-slate-900 p-2.5 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all shadow-sm" value={newFarmer.name} onChange={e => setNewFarmer({...newFarmer, name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-blue-400" /></div>
                    <input type="text" placeholder="+91 9876543210" required className="pl-10 w-full bg-white border border-blue-200 text-slate-900 p-2.5 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm" value={newFarmer.phone} onChange={e => setNewFarmer({...newFarmer, phone: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Home className="h-4 w-4 text-amber-400" /></div>
                    <input type="text" placeholder="House No, Street" required className="pl-10 w-full bg-white border border-amber-200 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all shadow-sm" value={newFarmer.address} onChange={e => setNewFarmer({...newFarmer, address: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Village</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-4 w-4 text-red-400" /></div>
                    <input type="text" placeholder="Village Name" required className="pl-10 w-full bg-white border border-red-200 text-slate-900 p-2.5 rounded-xl focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm" value={newFarmer.village} onChange={e => setNewFarmer({...newFarmer, village: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 text-white py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)' }}>
                    <UserPlus className="w-5 h-5" /> {newFarmer.id ? 'Update' : 'Register'}
                  </button>
                  {newFarmer.id !== 0 && (
                    <button type="button" onClick={() => setNewFarmer({ id: 0, name: '', phone: '', address: '', village: '' })}
                      className="px-4 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-sm border border-slate-200">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Farmers directory table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              {/* Card header */}
              <div className="relative overflow-hidden h-24"
                style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)' }}>
                <WaveBackground />
                <div className="absolute right-4 bottom-0 w-20 h-20 opacity-25">
                  <FarmerIllustration />
                </div>
                <div className="relative z-10 flex items-center gap-3 p-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white">Farmer Directory</h2>
                    <p className="text-blue-200 text-xs">{farmers.length} farmers registered</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead style={{ background: 'linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%)' }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Village</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {farmers.map((f: any) => (
                      <tr key={f.id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm"
                              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                              {f.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{f.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-red-400" /> {f.village}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-blue-400" /> {f.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditFarmer(f)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:text-white hover:bg-blue-500 transition-all shadow-sm border border-blue-100 hover:border-blue-500">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteFarmer(f.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 transition-all shadow-sm border border-red-100 hover:border-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {farmers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#eff6ff' }}>
                              <Users className="w-7 h-7 text-blue-300" />
                            </div>
                            <p className="text-slate-400 font-medium">No farmers registered yet</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}