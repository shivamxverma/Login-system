import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('userId'); 
    Cookies.remove('userRole'); 

    localStorage.removeItem('token');

    navigate('/login');
  };

  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const role = user?.role ? user.role.toLowerCase() : 'user'; 

  return (
    <header className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="text-lg font-bold">CREDIT APP</div>
      <nav className="space-x-4 flex items-center">
        <a href="#" className="text-green-700">Home</a>
        <a href="#" className="text-green-700">Payments</a>
        <a href="#" className="text-green-700">Budget</a>
        <a href="#" className="text-green-700">Card</a>
        <span className="text-green-700">
          {role === 'admin' ? 'Admin' : role === 'verifier' ? 'Verifier' : 'User'}
        </span>
        <button
          onClick={handleLogout}
          className="text-green-700 hover:text-red-700 transition-colors"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;