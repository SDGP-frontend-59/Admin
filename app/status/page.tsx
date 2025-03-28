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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--foreground)]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Application Status</h1>
          <p className="text-lg text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Update and track the status of mining license applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[var(--background)] rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Update Status</h2>
            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-2">Application ID</label>
                <input
                  type="text"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[var(--foreground)] bg-transparent"
                  placeholder="Enter application ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[var(--foreground)] bg-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="additional_info">Additional Information Required</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comments</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[var(--foreground)] bg-transparent h-32"
                  placeholder="Enter any additional comments"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--foreground)] text-[var(--background)] py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Update Status
              </button>
            </form>
          </div>

          <div className="bg-[var(--background)] rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Status History</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-[var(--foreground)] pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Status Updated</p>
                    <p className="text-sm opacity-70">Pending Review</p>
                  </div>
                  <span className="text-sm opacity-70">2024-03-20</span>
                </div>
              </div>
              <div className="border-l-4 border-[var(--foreground)] pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Application Submitted</p>
                    <p className="text-sm opacity-70">Initial Submission</p>
                  </div>
                  <span className="text-sm opacity-70">2024-03-19</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
