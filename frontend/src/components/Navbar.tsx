import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Loan {
  id: string;
  customerName: string;
  amount: number;
  reason: string;
  status: string;
}

const VerifiedLoans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get('http://localhost:3000/loan/verified');
      setLoans(response.data);
    } catch (error) {
      console.log('Error fetching loans:', error);
    }
  };

  const handleApprove = async (loanId: string) => {
    try {
      await axios.put(`http://localhost:3000/loan/approve/${loanId}`, {
        adminId: '1',
      });
      fetchLoans(); // Refresh list after approval
    } catch (error) {
      console.log('Error approving:', error);
    }
  };

  const handleReject = async (loanId: string) => {
    try {
      await axios.put(`http://localhost:3000/loan/admin/reject/${loanId}`, {
        adminId: '1',
        reason: 'Rejected', // Simple default reason
      });
      fetchLoans(); // Refresh list after rejection
    } catch (error) {
      console.log('Error rejecting:', error);
    }
  };

  return (
    <div>
      <h2>Verified Loans</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Amount</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Reason</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{loan.customerName}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>${loan.amount}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{loan.reason}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button
                  onClick={() => handleApprove(loan.id)}
                  style={{ marginRight: '5px', background: 'green', color: 'white' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(loan.id)}
                  style={{ background: 'red', color: 'white' }}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerifiedLoans;