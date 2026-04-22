import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, Milk, LayoutDashboard, Users, Factory, MapPin, Truck, ChevronRight, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function DashboardLayout({ user, setUser }: { user: any, setUser: (user: any) => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const navLinkClass = (path: string) => `group flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${location.pathname === path ? 'text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'}`;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-800 dark:text-slate-200">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm hidden md:flex flex-col relative z-10 my-4 ml-4 rounded-2xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-inner text-white">
              <Milk className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Mahadev Dairy</h2>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5">{user.role}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {user.role === 'Admin' && (
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-5 h-5 ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>Overview</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${location.pathname === '/dashboard' ? 'text-blue-600 opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
            </Link>
          )}
          {['Admin', 'Supervisor'].includes(user.role) && (
            <Link to={user.role === 'Admin' ? '/dashboard/supervisor' : '/dashboard'} className={navLinkClass(user.role === 'Admin' ? '/dashboard/supervisor' : '/dashboard')}>
              <div className="flex items-center gap-3">
                <Users className={`w-5 h-5 ${location.pathname === (user.role === 'Admin' ? '/dashboard/supervisor' : '/dashboard') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>Supervision</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${location.pathname === (user.role === 'Admin' ? '/dashboard/supervisor' : '/dashboard') ? 'text-blue-600 opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
            </Link>
          )}
          {['Admin', 'Dairy Production Worker'].includes(user.role) && (
            <Link to={user.role === 'Admin' ? '/dashboard/production' : '/dashboard'} className={navLinkClass(user.role === 'Admin' ? '/dashboard/production' : '/dashboard')}>
              <div className="flex items-center gap-3">
                <Factory className={`w-5 h-5 ${location.pathname === (user.role === 'Admin' ? '/dashboard/production' : '/dashboard') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>Production Line</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${location.pathname === (user.role === 'Admin' ? '/dashboard/production' : '/dashboard') ? 'text-blue-600 opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
            </Link>
          )}
          {['Admin', 'Counter Staff'].includes(user.role) && (
            <Link to={user.role === 'Admin' ? '/dashboard/counter' : '/dashboard'} className={navLinkClass(user.role === 'Admin' ? '/dashboard/counter' : '/dashboard')}>
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 ${location.pathname === (user.role === 'Admin' ? '/dashboard/counter' : '/dashboard') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>Counter POS</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${location.pathname === (user.role === 'Admin' ? '/dashboard/counter' : '/dashboard') ? 'text-blue-600 opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
            </Link>
          )}
          {['Admin', 'Delivery Worker'].includes(user.role) && (
            <Link to={user.role === 'Admin' ? '/dashboard/delivery' : '/dashboard'} className={navLinkClass(user.role === 'Admin' ? '/dashboard/delivery' : '/dashboard')}>
              <div className="flex items-center gap-3">
                <Truck className={`w-5 h-5 ${location.pathname === (user.role === 'Admin' ? '/dashboard/delivery' : '/dashboard') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span>Deliveries</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${location.pathname === (user.role === 'Admin' ? '/dashboard/delivery' : '/dashboard') ? 'text-blue-600 dark:text-blue-400 opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
            </Link>
          )}

          <Link to="/dashboard/profile" className={navLinkClass('/dashboard/profile')}>
            <div className="flex items-center gap-3">
              <User className={`w-5 h-5 ${location.pathname === '/dashboard/profile' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
              <span>My Profile</span>
            </div>
            <ChevronRight className={`w-4 h-4 ${location.pathname === '/dashboard/profile' ? 'text-blue-600 dark:text-blue-400 opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 m-2 mt-0">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 shadow-sm md:hidden m-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Milk className="w-5 h-5" /></div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Mahadev Dairy</h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
