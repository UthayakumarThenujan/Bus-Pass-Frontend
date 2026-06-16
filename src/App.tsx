import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import RoutesPage from './pages/RoutesPage';
import TicketsPage from './pages/TicketsPage';
import DriversPage from './pages/DriversPage';
import ScanHistoryPage from './pages/ScanHistoryPage';
import Login from './pages/Login';
import DriverDashboard from './pages/DriverDashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Driver App Routes */}
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/driver/*" element={<Navigate to="/driver" />} />
        
        {/* Admin Portal Routes */}
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="history" element={<ScanHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
