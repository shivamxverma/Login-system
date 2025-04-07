import  { useState, useEffect } from 'react';
import ApplyPage from './ApplyPage';

const UserDashboard = () => {
  interface Loan {
    id: string;
    amount: number;
    createdAt: string;
    status: string;
    verifiedBy?: {
      name: string;
    };
  }
  
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        // const userId = Cookies.get('userId'); 
        // if (!userId) {
        //   throw new Error('User ID not found in cookie');
        // }
        const response = await fetch("http://localhost:8000/api/loan", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // For session-based auth
        });

        const res : any = await response.json();

        console.log("Response:", res.data);
        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }
        setLoans(res.data);
      } catch (err : any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const getStatusColor = (status : any) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-200 text-yellow-800';
      case 'VERIFIED': return 'bg-green-200 text-green-800';
      case 'REJECTED': return 'bg-red-200 text-red-800';
      case 'APPROVED': return 'bg-blue-200 text-blue-800';
      default: return '';
    }
  };

  if (loading) return <div className="ml-64 p-6">Loading...</div>;
  if (error) return <div className="ml-64 p-6 text-red-500">{error}</div>;

  return (
    <div className="ml-64 p-6">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow flex items-center">
          <div className="text-center w-full">
            <div>Account Balance</div>
            <div className="text-2xl font-bold text-green-700">#0.0</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center">
          <button
            className="ml-auto px-4 py-2 bg-gray-300 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Get A Loan
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">My Loan Applications</h3>
          <div>
            <button className="mr-2">Sort</button>
            <button>Filter</button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th>Loan Officer</th>
              <th>Amount</th>
              <th>Date Applied</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="border-t">
                <td className="p-2">{loan.verifiedBy?.name || 'N/A'}</td> {/* Assuming User model has a name field */}
                <td className="p-2">${loan.amount.toFixed(2)}</td>
                <td className="p-2">{new Date(loan.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${getStatusColor(loan.status)}`}>
                    {loan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <span>Rows per page: 7</span>
          <span>1 of {Math.ceil(loans.length / 7)}</span>
          <span>⟨⟩</span>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
            <ApplyPage onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;