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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showResolved, setShowResolved] = useState(false);
  const [showRejected, setShowRejected] = useState(false);

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

  const filteredComplaints = complaints.filter(complaint => {
    const searchLower = searchQuery.toLowerCase();
    return (
      complaint.email.toLowerCase().includes(searchLower) ||
      complaint.project.toLowerCase().includes(searchLower) ||
      complaint.complaint_text.toLowerCase().includes(searchLower)
    );
  }).sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const statusColumns = ['Pending', 'Resolved', 'Rejected'];

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
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
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

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search complaints..."
              className="px-4 py-2 rounded-lg border border-[var(--foreground)] bg-transparent flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 rounded-lg border border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
            >
              Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowResolved(!showResolved)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                showResolved 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]'
              }`}
            >
              {showResolved ? 'Hide Resolved' : 'Show Resolved'}
            </button>
            <button
              onClick={() => setShowRejected(!showRejected)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                showRejected 
                  ? 'bg-red-500 text-white border-red-500' 
                  : 'border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]'
              }`}
            >
              {showRejected ? 'Hide Rejected' : 'Show Rejected'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Resolved and Rejected Columns - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resolved Column */}
            {showResolved && (
              <div className="bg-[var(--background)] rounded-xl shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
                  Resolved
                  <span className="ml-2 text-sm opacity-70">
                    ({filteredComplaints.filter(c => c.status === 'Resolved').length})
                  </span>
                </h2>
                <div className="space-y-4">
                  {filteredComplaints
                    .filter(complaint => complaint.status === 'Resolved')
                    .map((complaint) => (
                      <div
                        key={complaint.id}
                        className="bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 shadow-sm"
                      >
                        <div className="mb-2">
                          <span className="text-sm opacity-70">
                            {new Date(complaint.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-medium mb-2">
                          {complaint.anonymous ? 'Anonymous' : complaint.email}
                        </p>
                        <p className="text-sm mb-2">Project: {complaint.project}</p>
                        <p className="text-sm mb-3">{complaint.complaint_text}</p>
                        <select
                          className="w-full px-3 py-1 rounded border border-[var(--foreground)] bg-transparent text-sm"
                          value={complaint.status}
                          onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                        >
                          {statusColumns.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Rejected Column */}
            {showRejected && (
              <div className="bg-[var(--background)] rounded-xl shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
                  Rejected
                  <span className="ml-2 text-sm opacity-70">
                    ({filteredComplaints.filter(c => c.status === 'Rejected').length})
                  </span>
                </h2>
                <div className="space-y-4">
                  {filteredComplaints
                    .filter(complaint => complaint.status === 'Rejected')
                    .map((complaint) => (
                      <div
                        key={complaint.id}
                        className="bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 shadow-sm"
                      >
                        <div className="mb-2">
                          <span className="text-sm opacity-70">
                            {new Date(complaint.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-medium mb-2">
                          {complaint.anonymous ? 'Anonymous' : complaint.email}
                        </p>
                        <p className="text-sm mb-2">Project: {complaint.project}</p>
                        <p className="text-sm mb-3">{complaint.complaint_text}</p>
                        <select
                          className="w-full px-3 py-1 rounded border border-[var(--foreground)] bg-transparent text-sm"
                          value={complaint.status}
                          onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                        >
                          {statusColumns.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Pending Column - Full width with 2 columns for complaints */}
          <div className="bg-[var(--background)] rounded-xl shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
              Pending
              <span className="ml-2 text-sm opacity-70">
                ({filteredComplaints.filter(c => c.status === 'Pending').length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredComplaints
                .filter(complaint => complaint.status === 'Pending')
                .map((complaint) => (
                  <div
                    key={complaint.id}
                    className="bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 shadow-sm"
                  >
                    <div className="mb-2">
                      <span className="text-sm opacity-70">
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium mb-2">
                      {complaint.anonymous ? 'Anonymous' : complaint.email}
                    </p>
                    <p className="text-sm mb-2">Project: {complaint.project}</p>
                    <p className="text-sm mb-3">{complaint.complaint_text}</p>
                    <select
                      className="w-full px-3 py-1 rounded border border-[var(--foreground)] bg-transparent text-sm"
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                    >
                      {statusColumns.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
