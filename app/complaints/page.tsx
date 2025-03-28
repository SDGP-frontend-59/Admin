'use client';

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

interface Complaint {
  id: string;
  email: string;
  project: string;
  complaint_text: string;
  status: string;
  anonymous: boolean;
  created_at: string;
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching complaints...');

      const response = await fetch('/api/complaints');
      const data = await response.json();

      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      }

      if (!Array.isArray(data)) {
        console.error('Unexpected data format:', data);
        throw new Error('Received invalid data format from server');
      }

      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch complaints');
      Swal.fire('Error', 'Failed to fetch complaints.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/complaints', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        await Swal.fire('Updated!', 'Complaint status updated successfully.', 'success');
        fetchComplaints();
      } else {
        const data = await response.json();
        await Swal.fire('Error', data.error || 'Failed to update complaint status.', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      await Swal.fire('Error', 'Failed to update complaint status.', 'error');
    }
  };

  const handleDeleteComplaint = async (id: string, status: string) => {
    if (status !== 'Resolved') {
      await Swal.fire('Error', 'Only resolved complaints can be deleted.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This complaint will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch('/api/complaints', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          await Swal.fire('Deleted!', 'Complaint has been deleted.', 'success');
          fetchComplaints();
        } else {
          const data = await response.json();
          await Swal.fire('Error', data.error || 'Failed to delete complaint.', 'error');
        }
      } catch (error) {
        console.error('Error deleting complaint:', error);
        await Swal.fire('Error', 'Failed to delete complaint.', 'error');
      }
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
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Complaint Management</h1>
          <p className="text-lg text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Review and manage user complaints efficiently.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}

        <div className="bg-[var(--background)] rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            {complaints.length === 0 && !loading ? (
              <p className="text-center py-4">No complaints found.</p>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--foreground)]">
                  <th className="text-left py-4 px-6">Date</th>
                  <th className="text-left py-4 px-6">Email</th>
                  <th className="text-left py-4 px-6">Project</th>
                  <th className="text-left py-4 px-6">Complaint</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b border-[var(--foreground)] opacity-70">
                    <td className="py-4 px-6">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {complaint.anonymous ? 'Anonymous' : complaint.email}
                    </td>
                    <td className="py-4 px-6">{complaint.project}</td>
                    <td className="py-4 px-6">{complaint.complaint_text}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          complaint.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : complaint.status === 'Resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <select
                          className="px-3 py-1 rounded border border-[var(--foreground)] bg-transparent"
                          value={complaint.status}
                          onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          onClick={() => handleDeleteComplaint(complaint.id, complaint.status)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
