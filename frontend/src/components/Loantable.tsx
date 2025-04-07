
const LoanTable = () => {
  const loans: Loan[] = [
    { officer: 'John Okoh', amount: '$50,000.00', date: 'June 09, 2021', status: 'PENDING' },
    { officer: 'John Okoh', amount: '$50,000.00', date: 'June 07, 2021', status: 'VERIFIED' },
    { officer: 'John Okoh', amount: '$50,000.00', date: 'June 07, 2021', status: 'REJECTED' },
    { officer: 'John Okoh', amount: '$100,000.00', date: 'May 27, 2021', status: 'APPROVED' },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Applied Loans</h2>
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
          {loans.map((loan, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">
                <div>{loan.officer}</div>
                <div className="text-sm text-gray-500">Updated 1 day ago</div>
              </td>
              <td className="p-2">{loan.amount}</td>
              <td className="p-2">{loan.date}</td>
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
        <span>1 of 4</span>
        <span>⟨⟩</span>
      </div>
    </div>
  );
};

interface Loan {
    officer: string;
    amount: string;
    date: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'APPROVED';
}

const getStatusColor = (status: Loan['status']): string => {
    switch (status) {
        case 'PENDING': return 'bg-yellow-200 text-yellow-800';
        case 'VERIFIED': return 'bg-green-200 text-green-800';
        case 'REJECTED': return 'bg-red-200 text-red-800';
        case 'APPROVED': return 'bg-blue-200 text-blue-800';
        default: return '';
    }
};

export default LoanTable;