import React from 'react';
import Cookies from 'js-cookie';

const Header = () => {
  return (
    <header className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="text-lg font-bold">CREDIT APP</div>
      <nav className="space-x-4">
        <a href="#" className="text-green-700">Home</a>
        <a href="#" className="text-green-700">Payments</a>
        <a href="#" className="text-green-700">Budget</a>
        <a href="#" className="text-green-700">Card</a>
        <span className="text-green-700">
          {Cookies.get('role') === 'admin' ? 'Admin' : Cookies.get('role') === 'verifier' ? 'Verifier' : 'User'}
        </span>
      </nav>
    </header>
  );
};

export default Header;