import React, { useState } from 'react';
import { fetchApi } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function ShopLogin({ setUser }: { setUser: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register-customer';
      const body = isLogin 
        ? { email, password } 
        : { name, email, password, phone, address };

      const data = await fetchApi(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/shop');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden py-12 px-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[60%] w-[30%] h-[40%] rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl" />
        <div className="absolute bottom-[10%] right-[60%] w-[30%] h-[40%] rounded-full bg-orange-100/40 dark:bg-orange-900/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white dark:border-slate-800 z-10 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white mb-2">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-center text-slate-900 dark:text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-center text-sm">
            {isLogin ? 'Sign in to order fresh dairy products' : 'Join us to order farm-fresh dairy'}
          </p>
        </div>
        
        {error && <div className="p-4 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 rounded-xl">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Delivery Address</label>
                <textarea required value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 dark:text-white" rows={2}></textarea>
              </div>
            </>
          )}
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 dark:text-white" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 dark:text-white" />
          </div>
          
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-md shadow-blue-600/10 focus:ring-4 focus:ring-blue-600/20 mt-4">
            {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            {isLogin ? 'Register here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
}
