import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email?: string;
  };
}

const AdminDashboard = () => {
  const [stats] = useState<Stat[]>([
    { title: 'Active Users', value: '200', icon: '👥' },
    { title: 'Borrowers', value: '100', icon: '👤' },
    { title: 'Cash Disbursed', value: '$550,000', icon: '💸' },
    { title: 'Savings', value: '$450,000', icon: '🏦' },
    { title: 'Repaid Loans', value: '30', icon: '✅' },
    { title: 'Cash Received', value: '$1,000,000', icon: '💵' },
    { title: 'Other Accounts', value: '10', icon: '🏢' },
    { title: 'Loans', value: '50', icon: '💰' },
  ]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://login-system-wqit.onrender.com/api/loan', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Loans fetch nahi hua');
        const loansData = await response.json();
        setLoans(Array.isArray(loansData) ? loansData : loansData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kuch gadbad ho gaya');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleApprove = async (loanId: string) => {
    const adminId = 'cdb750db-0add-4b54-80ca-73349fe27b2c'; // Replace with actual admin ID
    try {
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === loanId ? { ...loan, status: 'APPROVED' } : loan
        )
      );
      setSelectedLoanId(null);

      const response = await fetch(`https://login-system-wqit.onrender.com/api/loan/approve/${loanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ adminId }),
      });

      if (!response.ok) throw new Error('Approve nahi hua');
      const updatedLoan = await response.json();
      console.log('Loan approved:', updatedLoan);
    } catch (err) {
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === loanId ? { ...loan, status: 'VERIFIED' } : loan
        )
      );
      setError(err instanceof Error ? err.message : 'Approve mein gadbad');
    }
  };

  const handleReject = async (loanId: string) => {
    try {
      setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== loanId));
      setSelectedLoanId(null);

      const response = await fetch(`https://login-system-wqit.onrender.com/api/loan/reject/${loanId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Reject nahi hua');
      console.log('Loan rejected and deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reject mein gadbad');
    }
  };

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-200 text-yellow-800';
      case 'VERIFIED': return 'bg-blue-200 text-blue-800';
      case 'APPROVED': return 'bg-green-200 text-green-800';
      case 'REJECTED': return 'bg-red-200 text-red-800';
      default: return '';
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

  return (
    <div className="ml-64 p-6">
      <h2 className="text-2xl mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 border flex items-center">
            <span className="text-2xl mr-4">{stat.icon}</span>
            <div>
              <div className="text-xl">{stat.value}</div>
              <div>{stat.title}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 border">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg">Recent Loans</h3>
          <div>
            <button className="mr-2 bg-gray-200 px-2 py-1">Sort</button>
            <button className="bg-gray-200 px-2 py-1">Filter</button>
          </div>
        </div>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">User Details</th>
              <th className="p-2 border">Customer Name</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? (
              loans.map((loan) => (
                <tr key={loan.id} className="border-t">
                  <td className="p-2 border">
                    {/* <div>{loan.user.email || 'Email nahi hai'}</div> */}
                    <div className="text-sm">Updated: {new Date(loan.updatedAt).toLocaleString()}</div>
                  </td>
                  <td className="p-2 border">{loan.customerName}</td>
                  <td className="p-2 border">{new Date(loan.createdAt).toLocaleString()}</td>
                  <td className="p-2 border relative">
                    {loan.status === 'VERIFIED' ? (
                      <>
                        <button
                          className="bg-blue-500 text-white px-2 py-1"
                          onClick={() => setSelectedLoanId(loan.id)}
                        >
                          Action
                        </button>
                        {selectedLoanId === loan.id && (
                          <div className="absolute bg-white border p-2 mt-1 right-0">
                            <button
                              className="block w-full text-left py-1"
                              onClick={() => handleApprove(loan.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="block w-full text-left py-1"
                              onClick={() => handleReject(loan.id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className={`px-2 py-1 ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-2 text-center">Koi loan nahi mila</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4 text-sm">
          <span>Rows per page: {loans.length}</span>
          <span>1 of 1240</span>
          <span>⟨⟩</span>
        </div>
      </div>

      {/* Show All Admins Button */}
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2"
        onClick={() => navigate('/admins')}
      >
        Show All Admins
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AdminDashboard;