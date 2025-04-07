import React, { useState } from 'react';

interface ApplyPageProps {
  onClose: () => void;
}

export default function ApplyPage({ onClose }: ApplyPageProps) {
  const [fullName, setFullName] = useState('');
  const [amount, setAmount] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [reason, setReason] = useState('');
  const [employmentAddress, setEmploymentAddress] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert('You must accept the terms and conditions');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = '7349d4e8-786c-46a2-9d04-ce2f39c6380e';
      const response = await fetch('https://login-system-wqit.onrender.com/api/loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName,
          amount,
          loanTenure,
          reason,
          employmentStatus,
          employmentAddress,
          userId,
        }),
      });

      const data = await response.json();

      console.log('Response:', data);

      if (response.ok) {
        alert('Your loan application has been submitted successfully.');
        onClose();
      } else {
        throw new Error('Failed to submit loan application');
      }
    } catch (error) {
      console.error('Error submitting loan application', error);
      alert('Failed to submit loan application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        ✕
      </button>
      <h1 className="text-2xl font-bold text-center mb-6">Apply for a Loan</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Full name as it appears on bank account:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">How much do you need?</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Loan tenure (months):</label>
          <input
            type="number"
            value={loanTenure}
            onChange={(e) => setLoanTenure(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Employment status:</label>
          <select
            value={employmentStatus}
            onChange={(e) => setEmploymentStatus(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select employment status</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block mb-1">Reason for loan:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded h-20"
            required
          />
        </div>
        <div className="col-span-2">
          <label className="block mb-1">Employment address:</label>
          <textarea
            value={employmentAddress}
            onChange={(e) => setEmploymentAddress(e.target.value)}
            className="w-full p-2 border rounded h-20"
            required
          />
        </div>
        <div className="col-span-2 mt-6 text-center">
          <h2 className="text-lg font-semibold">Chart</h2>
          <div className="border p-4 mb-4">
            <p>Chart placeholder (e.g., loan trends or interest rates)</p>
          </div>
          <div className="flex items-center justify-center mb-4">
            <label className="mr-2">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              I have read the important information and accept that by completing the application I will be bound by the terms
            </label>
          </div>
          <div>
            <label className="mr-2">
              <input type="checkbox" />
              Any personal and credit information obtained may be disclosed from time to time to credit agencies, creditors, or other interested parties.
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 px-6 py-2 bg-green-700 text-white rounded disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}