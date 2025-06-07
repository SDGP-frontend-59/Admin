'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';

export default function StatusPage() {
  const router = useRouter();
  const [applicationId, setApplicationId] = useState('');
  const [newStatus, setNewStatus] = useState('pending');
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after component mounts
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId, newStatus, comments }),
      });

      const data = await response.json();
      console.log('Response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Success
      setMessage('Status updated successfully!');
      setApplicationId('');
      setComments('');
      setNewStatus('pending');

      // Redirect to applications page after 1.5 seconds
      setTimeout(() => {
        router.push('/applications');
      }, 1500);

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };


  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Application Status</h1>
          <p className="text-lg text-[var(--secondary)] max-w-2xl mx-auto">
            Update and track the status of mining license applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Update Status</h2>
            {message && (
              <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="applicationId" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Application ID
                </label>
                <input
                  type="text"
                  id="applicationId"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  New Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Comments
                </label>
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="input-field min-h-[100px]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Update Status
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Status History</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-[var(--primary)] pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Status Updated</p>
                    <p className="text-sm text-[var(--secondary)]">Pending Review</p>
                  </div>
                  <span className="text-sm text-[var(--secondary)]">2024-03-20</span>
                </div>
              </div>
              <div className="border-l-4 border-[var(--primary)] pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Application Submitted</p>
                    <p className="text-sm text-[var(--secondary)]">Initial Submission</p>
                  </div>
                  <span className="text-sm text-[var(--secondary)]">2024-03-19</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
