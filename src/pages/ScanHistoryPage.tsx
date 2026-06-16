import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const ScanHistoryPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/validation/all-history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.SeasonTicket?.Student?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.Driver?.Username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.Result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Global Scan History</h1>
          <p className="text-text-secondary mt-1">View all scan attempts across all routes</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student, driver, or result..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Date & Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Student Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Route</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Driver</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No scan logs found.</td></tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.ScanID} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(log.ScanDateTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {log.SeasonTicket?.Student?.Name || 'Unknown Student'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {log.SeasonTicket?.Route?.RouteNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold">
                      @{log.Driver?.Username || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {log.Result === 'VALID' ? (
                      <span className="flex items-center space-x-1 text-green-600 text-sm font-semibold">
                        <CheckCircle size={16} /> <span>Valid Pass</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-red-600 text-sm font-semibold">
                        <XCircle size={16} /> <span>{log.Result.replace(/_/g, ' ')}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScanHistoryPage;
