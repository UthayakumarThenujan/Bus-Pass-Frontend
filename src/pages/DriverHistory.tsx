import { useState, useEffect } from 'react';
import { History, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const DriverHistory = () => {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`https://bus-pass-backend-production.up.railway.app/api/validation/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('driverToken')}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="flex-1 flex flex-col p-4 font-sans bg-gray-50 h-full overflow-y-auto pb-24">
      <div className="flex items-center space-x-2 mb-6">
        <History className="text-primary" />
        <h2 className="text-2xl font-bold text-gray-800">Scan History</h2>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No scans recorded yet.</div>
        ) : logs.map(log => (
          <div key={log.ScanID} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-900">{log.SeasonTicket?.Student?.Name || 'Unknown Student'}</p>
              <p className="text-xs text-gray-500 font-medium">{new Date(log.ScanDateTime).toLocaleString()}</p>
            </div>
            <div>
              {log.Result === 'VALID' ? (
                <span className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                  <CheckCircle size={14} /> <span>Valid</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">
                  <XCircle size={14} /> <span>Rejected</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverHistory;
