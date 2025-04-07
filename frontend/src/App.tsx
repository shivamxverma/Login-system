import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import NavBar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/AdminList';
import Cookies from 'js-cookie';

const ProtectedRoute: React.FC = () => {
  // Check if user is logged in by looking for the token in localStorage or cookies
  const token = localStorage.getItem('token') || Cookies.get('token');
  const userId = Cookies.get('userId'); // Assuming your backend sets this cookie on login

  // If no token or userId is found, redirect to login
  if (!token && !userId) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes/components
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admins" element={<Admin />} />
          {/* Add more protected routes here as needed */}
          {/* Example: */}
          {/* <Route path="/loanform" element={<LoanForm />} /> */}
        </Route>

        {/* Catch-all route to redirect unauthorized users */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;