import { Users, Map, Ticket, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
      {trend && (
        <p className={`text-xs mt-2 font-medium flex items-center space-x-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{trend.value}</span>
        </p>
      )}
    </div>
    <div className="p-3 bg-gray-50 rounded-xl text-primary">
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeRoutes: 0,
    activeTickets: 0,
    dailyScans: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome back, Admin</h1>
        <p className="text-text-secondary">Here's what's happening with the season tickets today.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents} 
            icon={Users} 
          />
          <StatCard 
            title="Active Routes" 
            value={stats.activeRoutes} 
            icon={Map} 
          />
          <StatCard 
            title="Season Tickets" 
            value={stats.activeTickets} 
            icon={Ticket} 
          />
          <StatCard 
            title="Daily Scans" 
            value={stats.dailyScans} 
            icon={Activity} 
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/students')} className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-gray-50 transition-colors flex items-center justify-between group">
              <div>
                <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">Register New Student</p>
                <p className="text-sm text-text-secondary">Add a student and assign a route</p>
              </div>
              <Users className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
            </button>
            <button onClick={() => navigate('/tickets')} className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-gray-50 transition-colors flex items-center justify-between group">
              <div>
                <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">Generate QR Ticket</p>
                <p className="text-sm text-text-secondary">Create a season pass for an active student</p>
              </div>
              <Ticket className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
            </button>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="font-medium text-green-900">Database Connection</p>
              </div>
              <span className="text-sm text-green-700 font-semibold">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="font-medium text-green-900">API Services</p>
              </div>
              <span className="text-sm text-green-700 font-semibold">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
