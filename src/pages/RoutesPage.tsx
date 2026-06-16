import { Map, Plus, Search, X, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RoutesPage = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  
  // Form state
  const [routeNumber, setRouteNumber] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`https://bus-pass-backend-production.up.railway.app/api/routes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRoutes(response.data);
    } catch (error) {
      console.error('Failed to fetch routes', error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const openAddModal = () => {
    setEditingRouteId(null);
    setRouteNumber('');
    setStartPoint('');
    setEndPoint('');
    setIsModalOpen(true);
  };

  const openEditModal = (route: any) => {
    setEditingRouteId(route.RouteID);
    setRouteNumber(route.RouteNumber);
    setStartPoint(route.StartPoint);
    setEndPoint(route.EndPoint);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRouteId) {
        await axios.put(`https://bus-pass-backend-production.up.railway.app/api/routes/${editingRouteId}`, {
          routeNumber, startPoint, endPoint
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`https://bus-pass-backend-production.up.railway.app/api/routes`, {
          routeNumber, startPoint, endPoint
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setIsModalOpen(false);
      fetchRoutes();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${editingRouteId ? 'update' : 'add'} route`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await axios.delete(`https://bus-pass-backend-production.up.railway.app/api/routes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchRoutes();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete route');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Manage Routes</h1>
          <p className="text-text-secondary mt-1">Add, edit, or view transport routes</p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Route</span>
        </button>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search routes..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Route No</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Start Point</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">End Point</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No routes found.</td></tr>
              ) : routes.map((route) => (
                <tr key={route.RouteID} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <Map size={16} className="text-primary" />
                    </div>
                    <span>{route.RouteNumber}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{route.StartPoint}</td>
                  <td className="px-6 py-4 text-gray-600">{route.EndPoint}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center space-x-3">
                      <button onClick={() => openEditModal(route)} className="text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(route.RouteID)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingRouteId ? 'Edit Route' : 'Add New Route'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">Route Number</label>
                <input required value={routeNumber} onChange={e=>setRouteNumber(e.target.value)} className="input-field" placeholder="e.g. 101" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">Start Point</label>
                <input required value={startPoint} onChange={e=>setStartPoint(e.target.value)} className="input-field" placeholder="e.g. Central Station" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">End Point</label>
                <input required value={endPoint} onChange={e=>setEndPoint(e.target.value)} className="input-field" placeholder="e.g. University Campus" />
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">{editingRouteId ? 'Save Changes' : 'Save Route'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
