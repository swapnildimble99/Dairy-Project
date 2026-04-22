import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Users, Droplet, Package, ShoppingCart, Edit, Trash2, UserPlus, Shield, Mail, User } from 'lucide-react';

export default function AdminDashboard({ user }: { user?: any }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('today');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', roleName: 'Supervisor' });
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    fetchApi(`/stats?range=${timeRange}`).then(setStats).catch(console.error);
  }, [timeRange]);

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchApi('/users').then(setUsers).catch(console.error);
    }
  }, [user]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await fetchApi(`/users/${editingUser.id}`, { method: 'PUT', body: JSON.stringify(newUser) });
        alert('User updated successfully');
      } else {
        await fetchApi('/users', { method: 'POST', body: JSON.stringify(newUser) });
        alert('User added successfully');
      }
      fetchApi('/users').then(setUsers);
      setNewUser({ name: '', email: '', password: '', roleName: 'Supervisor' });
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetchApi(`/users/${id}`, { method: 'DELETE' });
      fetchApi('/users').then(setUsers);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (u: any) => {
    setEditingUser(u);
    setNewUser({ name: u.name, email: u.email, password: '', roleName: u.role });
  };

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          {activeTab === 'overview' && (
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
            >
              <option value="today">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
              <option value="all">All Time</option>
            </select>
          )}
          {user?.role === 'Admin' && (
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button onClick={() => setActiveTab('overview')} className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>Overview</button>
              <button onClick={() => setActiveTab('users')} className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'users' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>Manage Users</button>
            </div>
          )}
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Milk Collected" value={`${stats.totalMilkCollected} L`} icon={<Droplet className="w-6 h-6 text-blue-500" />} />
            <StatCard title="Total Production" value={`${stats.totalProduction} Units`} icon={<Package className="w-6 h-6 text-green-500" />} />
            <StatCard title="Total Sales" value={`₹${stats.totalSales}`} icon={<ShoppingCart className="w-6 h-6 text-purple-500" />} />
            {user?.role === 'Admin' && <StatCard title="Active Users" value={users.length.toString()} icon={<Users className="w-6 h-6 text-orange-500" />} />}
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Current Inventory</h2>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantity Available</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                  {stats.inventory.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">{item.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-300">
                        <span className={`px-3 py-1 rounded-full text-xs ${item.quantity < 50 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                          {item.quantity} units
                        </span>
                      </td>
                    </tr>
                  ))}
                  {stats.inventory.length === 0 && (
                    <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No inventory found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && user?.role === 'Admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            </div>
            <form onSubmit={handleAddUser} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-4 w-4 text-slate-400" /></div>
                  <input type="text" placeholder="John Doe" required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-slate-400" /></div>
                  <input type="email" placeholder="john@example.com" required className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                </div>
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                  <input type="password" placeholder="••••••••" required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Shield className="h-4 w-4 text-slate-400" /></div>
                  <select className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2.5 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors appearance-none" value={newUser.roleName} onChange={e => setNewUser({...newUser, roleName: e.target.value})}>
                    <option>Supervisor</option>
                    <option>Counter Staff</option>
                    <option>Dairy Production Worker</option>
                    <option>Delivery Worker</option>
                    <option>Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">{editingUser ? 'Update User' : 'Add User'}</button>
                {editingUser && (
                  <button type="button" onClick={() => { setEditingUser(null); setNewUser({ name: '', email: '', password: '', roleName: 'Supervisor' }); }} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                )}
              </div>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">User Directory</h2>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                  {users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold mr-3">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.role === 'Admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                          u.role === 'Supervisor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => startEdit(u)} className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors inline-flex"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors inline-flex"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No users found</td></tr>
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

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center space-x-4 hover:shadow-md transition-shadow">
      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
