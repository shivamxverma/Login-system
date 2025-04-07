import React, { useState } from 'react';
import ApplyPage from './ApplyPage';

const MainContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="p-4">
      <div className="flex justify-center items-center mb-4">
        <div className="text-center">
          <div>Deficit</div>
          <div className="text-2xl font-bold text-green-700">#0.0</div>
        </div>
        <button
          className="ml-4 px-4 py-2 bg-gray-300 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Get A Loan
        </button>
      </div>
      <div className="flex space-x-2 mb-4">
        <button className="flex-1 px-4 py-2 bg-gray-200 rounded">Borrow Cash</button>
        <button className="flex-1 px-4 py-2 bg-gray-200 rounded">Transact</button>
        <button className="flex-1 px-4 py-2 bg-gray-200 rounded">Deposit Cash</button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for loans"
          className="w-full p-2 border rounded"
        />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
            <ApplyPage onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </main>
  );
};

export default MainContent;