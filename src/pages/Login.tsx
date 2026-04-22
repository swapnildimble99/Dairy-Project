import React, { useState } from 'react';
import { fetchApi } from '../lib/api';
import { Milk, ArrowRight } from 'lucide-react';

export default function Login({ setUser }: { setUser: (user: any) => void }) {
  const [email, setEmail] = useState('admin@dairy.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white dark:border-slate-800 z-10 mx-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white mb-2">
            <Milk className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-center text-slate-900 dark:text-white tracking-tight">DairyFlow</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-center text-sm">Sign in to manage your operations</p>
        </div>

        {error && <div className="p-4 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 rounded-xl">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 dark:text-white"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-md shadow-blue-600/10 focus:ring-4 focus:ring-blue-600/20 mt-4"
          >
            Sign In system portal <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
