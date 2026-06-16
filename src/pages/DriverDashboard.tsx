import { useState } from 'react';
import { Camera, History, LogOut, BusFront } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DriverScanner from './DriverScanner';
import DriverHistory from './DriverHistory';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'history'>('scanner');
  const navigate = useNavigate();
  const driverUsername = localStorage.getItem('driverUsername');

  const handleLogout = () => {
    localStorage.removeItem('driverToken');
    localStorage.removeItem('driverRouteId');
    localStorage.removeItem('driverUsername');
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-2 rounded-lg">
            <BusFront size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 leading-tight">Driver Portal</h1>
            <p className="text-xs text-gray-500 font-medium">@{driverUsername}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'scanner' ? <DriverScanner /> : <DriverHistory />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 pb-safe shrink-0">
        <div className="flex justify-around items-center p-3">
          <button 
            onClick={() => setActiveTab('scanner')} 
            className={`flex flex-col items-center space-y-1 w-full py-2 rounded-xl transition-all ${activeTab === 'scanner' ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
          >
            <Camera size={24} />
            <span className="text-xs font-bold">Scanner</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`flex flex-col items-center space-y-1 w-full py-2 rounded-xl transition-all ${activeTab === 'history' ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
          >
            <History size={24} />
            <span className="text-xs font-bold">History</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DriverDashboard;
