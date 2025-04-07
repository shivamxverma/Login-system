import React, { useState, useEffect } from 'react';

interface Stat {
  title: string;
  value: string;
  icon: string;
}

interface Loan {
  id: string;
  customerName: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'VERIFIED';
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  user: {
    id: string;
    email?: string;
  };
}

interface VerifierDashboardProps {}

const VerifierDashboard: React.FC<VerifierDashboardProps> = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/loan', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }

        const loansData = await response.json();
        console.log('Response:', loansData);
        setLoans(Array.isArray(loansData) ? loansData : loansData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleVerify = async (loanId: string) => {
    const verifierId = '0f15c658-229e-4b05-9428-fc4a4796eb98'; // Replace with actual verifier ID (e.g., from auth context)
    try {
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === loanId ? { ...loan, status: 'VERIFIED' } : loan
        )
      );
      setSelectedLoanId(null);

      const response = await fetch(`http://localhost:8000/api/loan/verify/${loanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ verifierId }),
      });

      const res = await response.json();

      console.log('Response:', res);

      if (!response.ok) {
        throw new Error('Failed to verify loan');
      }

      const updatedLoan = await response.json();
      console.log('Loan verified:', updatedLoan);
    } catch (err) {
      // Revert on error
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === loanId ? { ...loan, status: 'PENDING' } : loan
        )
      );
      setError(err instanceof Error ? err.message : 'Failed to verify loan');
    }
  };

  const handleReject = async (loanId: string) => {
    try {
      // Optimistic update
      setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== loanId));
      setSelectedLoanId(null);

      const response = await fetch(`http://localhost:8000/api/loan/reject/${loanId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to reject loan');
      }

      console.log('Loan rejected and deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject loan');
    }
  };

  const getStatusColor = (status: Loan['status']): string => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-200 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-200 text-green-800';
      case 'REJECTED':
        return 'bg-red-200 text-red-800';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="ml-64 p-6">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-64 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button className="ml-4 underline" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 p-6">
      <h2 className="text-xl font-semibold mb-6">Dashboard {'>'} Loans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded shadow flex items-center">
            <span className="text-2xl mr-4">{stat.icon}</span>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-600">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Applied Loans</h3>
          <div>
            <button className="mr-2">Sort</button>
            <button>Filter</button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th>User Recent Activity</th>
              <th>Customer Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? (
              loans.map((loan) => (
                <tr key={loan.id} className="border-t">
                  <td className="p-2">
                    <div>{loan.reason}</div>
                    <div className="text-sm text-gray-500">
                      Updated: {new Date(loan.updatedAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-2">{loan.customerName}</td>
                  <td className="p-2">${loan.amount.toLocaleString()}</td>
                  <td className="p-2">{new Date(loan.createdAt).toLocaleString()}</td>
                  <td className="p-2 relative">
                    {loan.status === 'PENDING' ? (
                      <>
                        <button
                          className="px-2 py-1 bg-yellow-500 text-white rounded"
                          onClick={() => setSelectedLoanId(loan.id)}
                        >
                          Action
                        </button>
                        {selectedLoanId === loan.id && (
                          <div className="absolute z-10 bg-white border rounded shadow-md p-2 mt-1">
                            <button
                              className="block w-full text-left px-2 py-1 hover:bg-green-100"
                              onClick={() => handleVerify(loan.id)}
                            >
                              Verify
                            </button>
                            <button
                              className="block w-full text-left px-2 py-1 hover:bg-red-100"
                              onClick={() => handleReject(loan.id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className={`px-2 py-1 rounded ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-center">
                  No loans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <span>Rows per page: {loans.length}</span>
          <span>1 of 1240</span>
          <span>⟨⟩</span>
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;