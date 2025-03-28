'use client';

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

interface Application {
  id: string;
  created_at: string;
  applicant_name: string;
  village_name: string;
  status: string;
  category: string;
  production_volume: string;
  period_of_validity: string;
  submission_date: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--foreground)]"></div>
        </div>
      </Layout>
    );
  }

  // Update the status color logic to handle all possible statuses
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'consulting':
        return 'bg-red-100 text-red-800';
      case 'verifying':
        return 'bg-blue-100 text-blue-800';
      case 'reviewing':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Mining Applications</h1>
          <p className="text-lg text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Review and manage all mining license applications in one place.
          </p>
        </div>

        <div className="bg-[var(--background)] rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--foreground)]">
                  <th className="text-left py-4 px-6">Application ID</th>
                  <th className="text-left py-4 px-6">Applicant Name</th>
                  <th className="text-left py-4 px-6">Location</th>
                  <th className="text-left py-4 px-6">Category</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-[var(--foreground)] opacity-70">
                    <td className="py-4 px-6">#{app.id.slice(0, 8)}</td>
                    <td className="py-4 px-6">{app.applicant_name}</td>
                    <td className="py-4 px-6">{app.village_name}</td>
                    <td className="py-4 px-6">{app.category}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(app.status)}`}>
                        {app.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link 
                        href={`/applications/${app.id}`}
                        className= "bg-[var(--foreground)] hover:opacity-80 transition-opacity text-sm text-white px-2 py-2 rounded-md"
                      >
                        View Details
                      </Link>
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
