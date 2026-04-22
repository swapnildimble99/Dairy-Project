import React, { useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';
import { User, Mail, Phone, MapPin, Lock, CheckCircle2 } from 'lucide-react';

export default function Profile({ user, setUser }: { user: any, setUser: (u: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApi('/auth/me')
      .then(data => {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          password: ''
        });
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) payload.password = formData.password;
      if (user.role === 'Customer') {
        payload.phone = formData.phone;
        payload.address = formData.address;
      }

      const res = await fetchApi('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      setUser(res.user);
      setSuccess(true);
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and security.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-sm">Profile updated successfully!</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 dark:bg-red-900/30 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 font-medium text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            {user?.role === 'Customer' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Delivery Address</label>
                  <div className="relative flex">
                    <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="pl-10 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                    ></textarea>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5 sm:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-6 mt-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Change Password <span className="text-slate-400 font-normal">(Leave blank to keep current)</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent rounded-xl shadow-sm shadow-blue-600/10 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
