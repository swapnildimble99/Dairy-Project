import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';

export default function CustomerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    fetchApi('/orders')
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCancelClick = (id: number) => {
    setCancellingOrder(id);
  };

  const performCancel = async (id: number) => {
    try {
      await fetchApi(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Cancelled' })
      });
      setCancellingOrder(null);
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel the order. It might already be processed.');
      setCancellingOrder(null);
    }
  };

  if (loading) return <div className="text-center py-12">Loading orders...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative">
              
              {cancellingOrder === order.id && (
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 z-10 flex flex-col items-center justify-center backdrop-blur-sm px-4">
                  <p className="text-lg font-bold text-slate-900 dark:text-white mb-4 text-center">Are you sure you want to cancel this order?</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setCancellingOrder(null)} 
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                    >
                      No, Keep It
                    </button>
                    <button 
                      onClick={() => performCancel(order.id)} 
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Yes, Cancel Order
                    </button>
                  </div>
                </div>
              )}

              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Order_Id#{order.id}</span>
                  <span className="mx-2 text-slate-300 dark:text-slate-600">|</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400' :
                  order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded flex items-center justify-center mr-4">
                          🥛
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{item.productName}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">₹{order.totalAmount}</p>
                  </div>
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => handleCancelClick(order.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
