import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchApi } from './lib/api';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import CounterDashboard from './pages/CounterDashboard';
import ProductionDashboard from './pages/ProductionDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';

// Shop Pages
import ShopLayout from './pages/Shop/ShopLayout';
import ShopHome from './pages/Shop/ShopHome';
import ShopLogin from './pages/Shop/ShopLogin';
import CustomerOrders from './pages/Shop/CustomerOrders';
import Profile from './pages/Profile';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Theme initialization
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetchApi('/auth/me')
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Customer Ordering Website */}
        <Route path="/shop" element={<ShopLayout user={user} setUser={setUser} />}>
          <Route index element={<ShopHome />} />
          <Route path="login" element={!user ? <ShopLogin setUser={setUser} /> : <Navigate to="/shop" />} />
          <Route path="orders" element={user && user.role === 'Customer' ? <CustomerOrders /> : <Navigate to="/shop/login" />} />
          <Route path="profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/shop/login" />} />
        </Route>

        {/* Internal Dairy Management System */}
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={user && user.role !== 'Customer' ? <DashboardLayout user={user} setUser={setUser} /> : <Navigate to="/login" />}>
          <Route index element={
            user?.role === 'Admin' ? <AdminDashboard user={user} /> :
            user?.role === 'Supervisor' ? <SupervisorDashboard /> :
            user?.role === 'Counter Staff' ? <CounterDashboard /> :
            user?.role === 'Dairy Production Worker' ? <ProductionDashboard /> :
            user?.role === 'Delivery Worker' ? <DeliveryDashboard /> :
            <div className="p-6">Welcome, {user?.name}</div>
          } />
          <Route path="supervisor" element={<SupervisorDashboard />} />
          <Route path="production" element={<ProductionDashboard />} />
          <Route path="counter" element={<CounterDashboard />} />
          <Route path="delivery" element={<DeliveryDashboard />} />
          <Route path="profile" element={<Profile user={user} setUser={setUser} />} />
        </Route>
      </Routes>
    </Router>
  );
}
