import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Login from './pages/Login'; // Assuming you created this earlier
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="p-4 bg-white shadow-md flex justify-between">
          <h1 className="text-xl font-bold">SubTracker</h1>
          {isAuthenticated && <button onClick={() => setIsAuthenticated(false)}>Logout</button>}
        </nav>

        <Routes>
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Route: Redirects to login if not authenticated */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
