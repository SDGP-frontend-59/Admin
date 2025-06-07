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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <svg className="w-6 h-6 text-yellow-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Resolved':
        return (
          <svg className="w-6 h-6 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Rejected':
        return (
          <svg className="w-6 h-6 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-10 h-10 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Complaint Management</h1>
          </div>
          <p className="text-lg text-[var(--secondary)] max-w-2xl mx-auto">
            Review and manage user complaints efficiently.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            Error: {error}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search complaints..."
                className="input-field pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="w-5 h-5 text-[var(--secondary)] absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowResolved(!showResolved)}
              className={`btn-primary flex items-center gap-2 ${
                showResolved ? 'bg-green-500 hover:bg-green-600' : ''
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {showResolved ? 'Hide Resolved' : 'Show Resolved'}
            </button>
            <button
              onClick={() => setShowRejected(!showRejected)}
              className={`btn-primary flex items-center gap-2 ${
                showRejected ? 'bg-red-500 hover:bg-red-600' : ''
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {showRejected ? 'Hide Rejected' : 'Show Rejected'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Resolved and Rejected Columns - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resolved Column */}
            {showResolved && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-[var(--foreground)] flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Resolved
                    <span className="text-sm font-normal text-[var(--secondary)]">
                      ({filteredComplaints.filter(c => c.status === 'Resolved').length})
                    </span>
                  </h2>
                </div>
                <div className="space-y-4">
                  {filteredComplaints
                    .filter(complaint => complaint.status === 'Resolved')
                    .map((complaint) => (
                      <div
                        key={complaint.id}
                        className="card hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-[var(--secondary)]">
                              {new Date(complaint.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {getStatusIcon(complaint.status)}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="font-medium text-[var(--foreground)]">
                              {complaint.anonymous ? 'Anonymous' : complaint.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-sm text-[var(--secondary)]">Project: {complaint.project}</p>
                          </div>
                          <p className="text-[var(--foreground)]">{complaint.complaint_text}</p>
                        </div>
                        <div className="mt-4">
                          <select
                            className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${getStatusColor(complaint.status)}`}
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
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Rejected Column */}
            {showRejected && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-[var(--foreground)] flex items-center gap-2">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rejected
                    <span className="text-sm font-normal text-[var(--secondary)]">
                      ({filteredComplaints.filter(c => c.status === 'Rejected').length})
                    </span>
                  </h2>
                </div>
                <div className="space-y-4">
                  {filteredComplaints
                    .filter(complaint => complaint.status === 'Rejected')
                    .map((complaint) => (
                      <div
                        key={complaint.id}
                        className="card hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-[var(--secondary)]">
                              {new Date(complaint.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {getStatusIcon(complaint.status)}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="font-medium text-[var(--foreground)]">
                              {complaint.anonymous ? 'Anonymous' : complaint.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-sm text-[var(--secondary)]">Project: {complaint.project}</p>
                          </div>
                          <p className="text-[var(--foreground)]">{complaint.complaint_text}</p>
                        </div>
                        <div className="mt-4">
                          <select
                            className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${getStatusColor(complaint.status)}`}
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
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Pending Column - Full width with 2 columns for complaints */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pending
                <span className="text-sm font-normal text-[var(--secondary)]">
                  ({filteredComplaints.filter(c => c.status === 'Pending').length})
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredComplaints
                .filter(complaint => complaint.status === 'Pending')
                .map((complaint) => (
                  <div
                    key={complaint.id}
                    className="card hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-[var(--secondary)]">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {getStatusIcon(complaint.status)}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="font-medium text-[var(--foreground)]">
                          {complaint.anonymous ? 'Anonymous' : complaint.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-sm text-[var(--secondary)]">Project: {complaint.project}</p>
                      </div>
                      <p className="text-[var(--foreground)]">{complaint.complaint_text}</p>
                    </div>
                    <div className="mt-4">
                      <select
                        className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${getStatusColor(complaint.status)}`}
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
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
