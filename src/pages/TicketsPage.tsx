import { Plus, Search, QrCode, X, Download, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const TicketsPage = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  
  // QR View state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQrUrl, setSelectedQrUrl] = useState('');
  const [selectedTicketSerial, setSelectedTicketSerial] = useState('');

  // Form state
  const [studentId, setStudentId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const fetchData = async () => {
    try {
      const [ticketsRes, studentsRes, routesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tickets`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/routes`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      setTickets(ticketsRes.data);
      setStudents(studentsRes.data);
      setRoutes(routesRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openGenerateModal = () => {
    setEditingTicketId(null);
    setStudentId('');
    setRouteId('');
    setValidFrom('');
    setValidTo('');
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const openEditModal = (ticket: any) => {
    setEditingTicketId(ticket.TicketID);
    setStudentId(ticket.StudentID);
    setRouteId(ticket.RouteID);
    setValidFrom(new Date(ticket.ValidFrom).toISOString().split('T')[0]);
    setValidTo(new Date(ticket.ValidTo).toISOString().split('T')[0]);
    setStatus(ticket.Status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTicketId) {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tickets/${editingTicketId}`, {
          validFrom, validTo, status
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tickets`, {
          studentId, routeId, validFrom, validTo
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${editingTicketId ? 'update' : 'generate'} ticket`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete ticket');
    }
  };

  const handleViewQr = async (ticket: any) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tickets/${ticket.TicketID}/qr`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSelectedQrUrl(response.data.qrCode);
      setSelectedTicketSerial(ticket.QRSerialNo);
      setQrModalOpen(true);
    } catch (error) {
      alert('Failed to load QR Code');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Season Tickets</h1>
          <p className="text-text-secondary mt-1">Manage and generate QR season tickets</p>
        </div>
        <button onClick={openGenerateModal} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Generate Ticket</span>
        </button>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search tickets by serial no..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">QR Serial No</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Student</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Valid From</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Valid To</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No tickets generated yet.</td></tr>
              ) : tickets.map((ticket) => (
                <tr key={ticket.TicketID} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">
                    {ticket.QRSerialNo}
                  </td>
                  <td className="px-6 py-4 font-medium">{ticket.Student?.Name}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(ticket.ValidFrom).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(ticket.ValidTo).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.Status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {ticket.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end items-center space-x-3">
                    <button onClick={() => handleViewQr(ticket)} className="text-secondary hover:text-pink-700 flex items-center space-x-1 font-medium text-sm transition-colors" title="View QR">
                      <QrCode size={16} />
                    </button>
                    <button onClick={() => openEditModal(ticket)} className="text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(ticket.TicketID)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
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
              <h3 className="text-lg font-bold">{editingTicketId ? 'Edit Season Ticket' : 'Generate Season Ticket'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">Student</label>
                <select disabled={!!editingTicketId} required value={studentId} onChange={e=>setStudentId(e.target.value)} className="input-field bg-white disabled:bg-gray-100 disabled:text-gray-500">
                  <option value="">Select a student</option>
                  {students.map(s => <option key={s.StudentID} value={s.StudentID}>{s.Name} ({s.School})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">Route</label>
                <select disabled={!!editingTicketId} required value={routeId} onChange={e=>setRouteId(e.target.value)} className="input-field bg-white disabled:bg-gray-100 disabled:text-gray-500">
                  <option value="">Select a route</option>
                  {routes.map(r => <option key={r.RouteID} value={r.RouteID}>{r.RouteNumber}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary block mb-1">Valid From</label>
                  <input type="date" required value={validFrom} onChange={e=>setValidFrom(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary block mb-1">Valid To</label>
                  <input type="date" required value={validTo} onChange={e=>setValidTo(e.target.value)} className="input-field" />
                </div>
              </div>
              {editingTicketId && (
                <div>
                  <label className="text-sm font-medium text-text-secondary block mb-1">Status</label>
                  <select required value={status} onChange={e=>setStatus(e.target.value)} className="input-field bg-white">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              )}
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">{editingTicketId ? 'Save Changes' : 'Generate QR'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qrModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-3xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col items-center p-8 space-y-6">
            <div className="w-full flex justify-between items-start">
              <h3 className="text-lg font-bold">Ticket QR Code</h3>
              <button onClick={() => setQrModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-100">
              <img src={selectedQrUrl} alt="Season Ticket QR" className="w-48 h-48" />
            </div>
            
            <p className="text-sm text-center text-text-secondary font-mono bg-gray-50 px-3 py-1 rounded-lg">
              {selectedTicketSerial}
            </p>

            <a 
              href={selectedQrUrl} 
              download={`ticket_qr_${selectedTicketSerial}.png`}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <Download size={18} />
              <span>Download Image</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
