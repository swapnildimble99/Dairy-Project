import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Truck, MapPin, Phone, CheckCircle, Clock } from 'lucide-react';

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/deliveries').then(setDeliveries).catch(console.error);
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetchApi(`/deliveries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      fetchApi('/deliveries').then(setDeliveries);
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Delivery Dashboard</h1>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Assigned Deliveries</h2>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
              {deliveries.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">#{d.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{d.customerName}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {d.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-start gap-1">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{d.address}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit ${d.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {d.status === 'Delivered' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {d.status !== 'Delivered' && (
                      <button onClick={() => updateStatus(d.id, 'Delivered')} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {deliveries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-3">
                      <Truck className="w-12 h-12 opacity-20" />
                      <p className="text-lg font-medium">No deliveries assigned</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
