'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../components/Layout';
import Swal from 'sweetalert2';

interface Application {
  id: string;
  applicant_name: string;
  status: string;
}

export default function StatusPage() {
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/applications/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch application');
        const data = await response.json();
        setApplication(data);
        setNewStatus(data.status);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch application details',
          icon: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchApplication();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: params.id,
          newStatus,
          comments
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      await Swal.fire({
        title: 'Success!',
        text: 'Status updated successfully',
        icon: 'success',
      });

      // Redirect back to application details
      window.location.href = `/applications/${params.id}`;
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update status',
        icon: 'error'
      });
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

  if (!application) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Application not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Update Application Status</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Application Details</h2>
            <p>Application ID: #{application.id}</p>
            <p>Applicant: {application.applicant_name}</p>
          </div>
          <div>
            <p>Current Status</p>
            <p className="font-medium">
                <span className={`px-3 py-1 rounded-full text-sm ${
                    application.status === 'submitted'
                      ? 'bg-yellow-100 text-yellow-800'
                      : application.status === 'reviewing'
                      ? 'bg-blue-100 text-blue-800'
                      : application.status === 'verifying'
                      ? 'bg-green-100 text-green-800'
                      : application.status === 'consulting'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
            </p>
          </div>
          <br></br>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 border rounded bg-[var(--background)]"
                required
              >
                <option value="submitted">Submitted</option>
                <option value="reviewing">Reviewing</option>
                <option value="verifying">Verifying</option>
                <option value="consulting">Consulting</option>
                <option value="approved">Approved</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Comments</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border rounded bg-[var(--background)]"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--foreground)] text-white py-2 px-4 rounded hover:opacity-90 transition-opacity"
            >
              Update Status
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}