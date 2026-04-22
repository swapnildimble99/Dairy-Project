import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, UserCircle } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

export default function ShopLayout({ user, setUser }: { user: any, setUser: (user: any) => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/shop" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-inner text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Mahadev Dairy</span>
            </Link>
            
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  {user.role === 'Customer' && (
                    <>
                      <Link to="/shop/orders" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-colors hidden sm:block">My Orders</Link>
                      <Link to="/shop/profile" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-colors hidden sm:block">My Profile</Link>
                    </>
                  )}
                  {user.role !== 'Customer' && (
                    <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-colors hidden sm:block">Staff Dashboard</Link>
                  )}
                  <div className="flex items-center space-x-3 ml-2 pl-4 border-l border-slate-200 dark:border-slate-800">
                    <Link to={user.role === 'Customer' ? "/shop/profile" : "/dashboard"} className="flex items-center gap-2 group">
                      <UserCircle className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden md:block">Hi, {user.name.split(' ')[0]}</span>
                    </Link>
                    <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Sign Out">
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/shop/login" className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <span className="text-xl font-display font-bold text-slate-900 dark:text-white">Mahadev Dairy</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Dairy Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
