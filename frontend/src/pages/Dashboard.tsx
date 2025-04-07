import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashboard';
import VerifierDashboard from '../components/VerifyDashboard';

const Dashboard: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const userRoleFromState = location.state?.role;

    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;
    const userRoleFromCookie = user?.role?.toLowerCase();

    const finalRole = userRoleFromState || userRoleFromCookie || 'user';
    console.log('User role:', finalRole);

    setRole(finalRole);
  }, [location.state]);

  if (role === null) {
    return <div>Loading...</div>;
  }

  const renderContent = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'verifier':
        return <VerifierDashboard />;
      case 'user':
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <Header />
      <div className="flex">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;