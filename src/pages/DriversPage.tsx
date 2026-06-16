import { Truck, Plus, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const DriversPage = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [routeId, setRouteId] = useState('');

  const fetchData = async () => {
    try {
      const [driversRes, routesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/drivers`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/routes`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      setDrivers(driversRes.data);
      setRoutes(routesRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/drivers`, {
        username, password, routeId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsModalOpen(false);
      setUsername('');
      setPassword('');
      setRouteId('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to register driver');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Drivers</h1>
          <p className="text-text-secondary mt-1">Manage driver accounts and route assignments</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Register Driver</span>
        </button>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search drivers..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Username</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Route Assigned</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-gray-500">No drivers found.</td></tr>
              ) : drivers.map((driver) => (
                <tr key={driver.UserID} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                      {driver.Username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{driver.Username}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{driver.Route?.RouteNumber || 'Unassigned'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${driver.Status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {driver.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">Register Driver</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">Username</label>
                <input required value={username} onChange={e=>setUsername(e.target.value)} className="input-field" placeholder="e.g. driver_john" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">Password</label>
                <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input-field" placeholder="Enter secure password" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">Assign Route</label>
                <select required value={routeId} onChange={e=>setRouteId(e.target.value)} className="input-field bg-white">
                  <option value="">Select a route</option>
                  {routes.map(r => <option key={r.RouteID} value={r.RouteID}>{r.RouteNumber} - {r.StartPoint} to {r.EndPoint}</option>)}
                </select>
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversPage;
