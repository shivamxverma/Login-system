import React from 'react';
import Cookies from 'js-cookie';

const Sidebar = () => {
  return (
    <div className="w-64 bg-green-800 text-white p-4 h-screen fixed">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{Cookies.get('userName') || 'John Doe'}</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Dashboard</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Borrowers</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Loans</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Repayments</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Loan Parameters</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Accounting</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Reports</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Collateral</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Access Configuration</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Savings</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Other Incomes</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Payroll</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Expenses</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">E-signature</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Investor Accounts</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Calendar</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Settings</a></li>
          <li><a href="#" className="block p-2 hover:bg-green-700 rounded">Sign Out</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;