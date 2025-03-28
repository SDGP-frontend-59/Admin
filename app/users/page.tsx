'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  license_status: string;
  created_at: string;
  active_date: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Received non-array data:', data);
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Get current date in ISO format
      const currentDate = new Date().toISOString();
      
      // If changing to miner role, include license_status and active_date in the update
      const updateData = newRole === 'miner' 
        ? { role: newRole, license_status: 'active', active_date: currentDate }
        : { role: newRole, license_status: 'not_started' }; // Reset license status for non-miners

      console.log('Sending update data:', updateData); // Debug log

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      console.log('Received response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }

      // Update local state using the returned data from the server
      setUsers(users.map(user => 
        user.id === userId 
          ? { 
              ...user,
              ...data // Use the actual updated data from the server
            } 
          : user
      ));

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: newRole === 'miner' 
          ? 'User role updated to miner with active license' 
          : 'User role updated successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      setLoading(true);
    } catch (error) {
      console.error('Error updating role:', error);
      Swal.fire({
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Failed to update user role',
        icon: 'error'
      });
    }
  };

  const handleActiveChange = async (userId: string, newActive: string) => {
    try {
      // Only set active_date when changing from expired to active
      const user = users.find(u => u.id === userId);
      const updateData: {license_status: string; active_date?: string} = {
        license_status: newActive
      };
      
      // If changing from expired to active, update the active date
      if (user?.license_status === 'expired' && newActive === 'active') {
        updateData.active_date = new Date().toISOString();
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...data } : user
      ));

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: newActive === 'active' && user?.license_status === 'expired'
          ? 'License activated with updated activation date' 
          : 'License status updated successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating license status:', error);
      Swal.fire({
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Failed to update license status',
        icon: 'error'
      });
    }
  };

  const getRoleColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'miner':
        return 'bg-blue-100 text-blue-800';
      case 'public':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-orange-100 text-orange-800';
      case 'not_started':
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--foreground)]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Users</h1>
          <p className="text-lg text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Manage all users in one place.
          </p>
        </div>

        <div className="bg-[var(--background)] rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--foreground)]">
                  <th className="text-left py-4 px-6">First Name</th>
                  <th className="text-left py-4 px-6">Last Name</th>
                  <th className="text-left py-4 px-6">Email</th>
                  <th className="text-left py-4 px-6">Role</th>
                  <th className="text-left py-4 px-6">Actions</th>
                  <th className="text-left py-4 px-6">License Status</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--foreground)] opacity-70">
                    <td className="py-4 px-6">{user.first_name}</td>
                    <td className="py-4 px-6">{user.last_name}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm ${getRoleColor(user.role)}`}>
                        {user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-[var(--input-background)] border border-[var(--border)] rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      >
                        <option value="public">Public</option>
                        <option value="miner">Miner</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(user.license_status)}`}>
                        {user.license_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {user.role == 'miner' ? (
                        <select
                          value={user.license_status}
                          onChange={(e) => handleActiveChange(user.id, e.target.value)}
                        className="bg-[var(--input-background)] border border-[var(--border)] rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      >
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                      </select>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                          {user.license_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}