'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../components/Layout';
import Link from 'next/link';

interface Document {
  id: string;
  name: string;
  status: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  created_at: string;
}

interface Application {
  id: string;
  exploration_license_no: string;
  applicant_name: string;
  national_id: string;
  address: string;
  nationality: string;
  employment: string;
  place_of_business: string;
  residence: string;
  company_name: string;
  country_of_incorporation: string;
  head_office_address: string;
  registered_address_in_sri_lanka: string;
  capitalization: string;
  articles_of_association: string;
  annual_reports: string;
  licensed_boundary_survey: string;
  project_team_credentials: string;
  economic_viability_report: string;
  blasting_method: string;
  depth_of_borehole: string;
  production_volume: string;
  machinery_used: string;
  underground_mining_depth: string;
  explosives_type: string;
  land_name: string;
  land_owner_name: string;
  village_name: string;
  grama_niladhari_division: string;
  administrative_district: string;
  mine_restoration_plan: string;
  nature_of_bound: string;
  minerals_to_be_mined: string;
  license_fee_receipt: string;
  industrial_mining_license_no: string;
  royalty_payable: number;
  status: string;
  category: string;
  period_of_validity: string;
  created_at: string;
  documents: Document[];
  comments: Comment[];
}

export default function ApplicationDetails() {
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplication() {
      try {
        console.log('Fetching application with ID:', params.id);
        const response = await fetch(`/api/applications/${params.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch application');
        }
        const data = await response.json();
        console.log('Received application data:', data);
        setApplication(data);
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchApplication();
    }
  }, [params.id]);

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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Application Details
          </h1>
          <p className="text-[var(--foreground)] opacity-80">
            Application ID: #{application.id}
          </p>
          <p className="text-[var(--foreground)] opacity-80">
            Exploration License No: {application.exploration_license_no}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Individual Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm opacity-70">Applicant Name</span>
                <p className="font-medium">{application.applicant_name}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">National ID</span>
                <p className="font-medium">{application.national_id}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Address</span>
                <p className="font-medium">{application.address}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Nationality</span>
                <p className="font-medium">{application.nationality}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Employment</span>
                <p className="font-medium">{application.employment}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Place of Business</span>
                <p className="font-medium">{application.place_of_business}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Residence</span>
                <p className="font-medium">{application.residence}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Corporate Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm opacity-70">Company Name</span>
                <p className="font-medium">{application.company_name}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Country of Incorporation</span>
                <p className="font-medium">{application.country_of_incorporation}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Head Office Address</span>
                <p className="font-medium">{application.head_office_address}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Registered Address in Sri Lanka</span>
                <p className="font-medium">{application.registered_address_in_sri_lanka}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Capitalization</span>
                <p className="font-medium">{application.capitalization}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Articles of Association</span>
                <p className="font-medium hover:text-blue-500"><a href={application.articles_of_association} target="_blank" rel="noopener noreferrer">View</a></p>
              </div>
              <div>
                <span className="text-sm opacity-70">Annual Reports</span>
                <p className="font-medium hover:text-blue-500"><a href={application.annual_reports} target="_blank" rel="noopener noreferrer">View</a></p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Technical/Professional Data</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm opacity-70">Licensed Boundary Survey</span>
                <p className="font-medium hover:text-blue-500"><a href={application.licensed_boundary_survey} target="_blank" rel="noopener noreferrer">View</a></p>
              </div>
              <div>
                <span className="text-sm opacity-70">Project Team Credentials</span>
                <p className="font-medium hover:text-blue-500"><a href={application.project_team_credentials} target="_blank" rel="noopener noreferrer">View</a></p>
              </div>
              <div>
                <span className="text-sm opacity-70">Economic Viability Report</span>
                <p className="font-medium hover:text-blue-500"><a href={application.economic_viability_report} target="_blank" rel="noopener noreferrer">View</a></p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Type of Industry Mining Operation</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm opacity-70">Blasting Method</span>
                <p className="font-medium">{application.blasting_method}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Depth of Borehole</span>
                <p className="font-medium">{application.depth_of_borehole}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Production Volume</span>
                <p className="font-medium">{application.production_volume}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Machinery Used</span>
                <p className="font-medium">{application.machinery_used}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Underground Mining Depth</span>
                <p className="font-medium">{application.underground_mining_depth}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Explosives Type</span>
                <p className="font-medium">{application.explosives_type}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Details of License Area</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm opacity-70">Land Name</span>
                <p className="font-medium">{application.land_name}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Land Owner Name</span>
                <p className="font-medium">{application.land_owner_name}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Village Name</span>
                <p className="font-medium">{application.village_name}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Grama Niladhari Division</span>
                <p className="font-medium">{application.grama_niladhari_division}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Administrative District</span>
                <p className="font-medium">{application.administrative_district}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Other Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm opacity-70">Mine Restoration Plan</span>
                <p className="font-medium hover:text-blue-500"><a href={application.mine_restoration_plan} target="_blank" rel="noopener noreferrer">View</a></p>
              </div>
              <div>
                <span className="text-sm opacity-70">Minerals to be Mined</span>
                <p className="font-medium">{application.minerals_to_be_mined}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">Nature of Bound</span>
                <p className="font-medium">{application.nature_of_bound}</p>
              </div>
              <div>
                <span className="text-sm opacity-70">License Fee Receipt</span>
                <p className="font-medium hover:text-blue-500"><a href={application.license_fee_receipt} target="_blank" rel="noopener noreferrer">View</a></p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Status Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm opacity-70">Current Status</span>
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
              <div>
                <span className="text-sm opacity-70">Submission Date</span>
                <p className="font-medium">{new Date(application.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-center">
                <Link href={`/status/${application.id}`}
                className="bg-[var(--foreground)] hover:opacity-80 transition-opacity text-sm text-white px-4 py-2 rounded-md"
                >
                  Update
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
            <div className="space-y-3">
              {application.documents.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center">
                  <span>{doc.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    doc.status === 'submitted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Comments & Updates</h2>
            <div className="space-y-4">
              {application.comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-[var(--foreground)] pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{comment.text}</p>
                      <p className="text-sm opacity-70">{comment.author}</p>
                    </div>
                    <span className="text-sm opacity-70">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
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