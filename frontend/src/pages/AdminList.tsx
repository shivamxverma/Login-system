import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'VERIFIER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

const AdminList = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('http://localhost:8000/users/admins', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Admins fetch nahi hua');
        const adminsData = await response.json();
        setAdmins(Array.isArray(adminsData) ? adminsData : adminsData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kuch gadbad ho gaya');
      }
    };

    fetchAdmins();
  }, []);

  const handleDeleteAdmin = async (adminId: string) => {
    const currentUserId = 'current-user-id'; // Replace with actual ID
    if (adminId === currentUserId) {
      setError('Khud ko delete nahi kar sakta');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/users/${adminId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Delete nahi hua');
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== adminId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete mein gadbad');
    }
  };

  return (
    <div className="ml-64 p-6">
      <h2 className="text-2xl mb-4">Saare Admins</h2>
      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2"
        onClick={() => navigate('/dashboard')}
      >
        Wapas Dashboard
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {admins.length > 0 ? (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Naam</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t">
                <td className="p-2 border">{admin.name}</td>
                <td className="p-2 border">{admin.email}</td>
                <td className="p-2 border">
                  <button
                    className="bg-red-500 text-white px-2 py-1"
                    onClick={() => handleDeleteAdmin(admin.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Koi admin nahi mila</p>
      )}
    </div>
  );
};

export default AdminList;