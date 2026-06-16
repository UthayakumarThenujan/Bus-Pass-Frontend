import { Plus, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const StudentsPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // View Profile state
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Form state
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [routeId, setRouteId] = useState('');

  const fetchData = async () => {
    try {
      const [studentsRes, routesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/routes`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      setStudents(studentsRes.data);
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
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students`, {
        name, school, contactNo, routeId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsModalOpen(false);
      setName('');
      setSchool('');
      setContactNo('');
      setRouteId('');
      fetchData();
    } catch (error) {
      alert('Failed to register student');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Students</h1>
          <p className="text-text-secondary mt-1">Manage student profiles and route assignments</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Register Student</span>
        </button>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search students..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Student Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">School</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Route Assigned</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No students found.</td></tr>
              ) : students.map((student) => (
                <tr key={student.StudentID} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                      {student.Name.charAt(0)}
                    </div>
                    <span className="font-medium">{student.Name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.School}</td>
                  <td className="px-6 py-4 text-gray-600">{student.Route?.RouteNumber}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.Status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {student.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedStudent(student)} className="text-primary font-medium text-sm hover:underline">View Profile</button>
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
              <h3 className="text-lg font-bold">Register Student</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">Full Name</label>
                <input required value={name} onChange={e=>setName(e.target.value)} className="input-field" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">School/University</label>
                <input required value={school} onChange={e=>setSchool(e.target.value)} className="input-field" placeholder="e.g. City High School" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1">Contact Number</label>
                <input required value={contactNo} onChange={e=>setContactNo(e.target.value)} className="input-field" placeholder="e.g. +1234567890" />
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

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-3xl shadow-xl w-full max-w-sm overflow-hidden p-6 space-y-6">
            <div className="w-full flex justify-between items-start">
              <h3 className="text-xl font-bold">Student Profile</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl mb-4">
                {selectedStudent.Name.charAt(0)}
              </div>
              <h4 className="text-lg font-bold text-text-primary">{selectedStudent.Name}</h4>
              <p className="text-sm text-text-secondary">{selectedStudent.School}</p>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Contact Number</span>
                <span className="font-medium">{selectedStudent.ContactNo}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Route Assigned</span>
                <span className="font-medium">{selectedStudent.Route?.RouteNumber}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedStudent.Status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedStudent.Status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
