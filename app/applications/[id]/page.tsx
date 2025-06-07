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
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              Application Details
            </h1>
          </div>
          <div className="flex items-center gap-4 text-[var(--secondary)]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <span className="font-medium">{application.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">License: {application.exploration_license_no}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Individual Information</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Applicant Name', value: application.applicant_name },
                { label: 'National ID', value: application.national_id },
                { label: 'Address', value: application.address },
                { label: 'Nationality', value: application.nationality },
                { label: 'Employment', value: application.employment },
                { label: 'Place of Business', value: application.place_of_business },
                { label: 'Residence', value: application.residence }
              ].map((item, index) => (
                <div key={index} className="border-b border-[var(--border)] pb-3 last:border-0">
                  <span className="text-sm font-medium text-[var(--secondary)] block mb-1">{item.label}</span>
                  <p className="text-[var(--foreground)] font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Corporate Information</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Company Name', value: application.company_name },
                { label: 'Country of Incorporation', value: application.country_of_incorporation },
                { label: 'Head Office Address', value: application.head_office_address },
                { label: 'Registered Address in Sri Lanka', value: application.registered_address_in_sri_lanka },
                { label: 'Capitalization', value: application.capitalization },
                { label: 'Articles of Association', value: application.articles_of_association, isLink: true },
                { label: 'Annual Reports', value: application.annual_reports, isLink: true }
              ].map((item, index) => (
                <div key={index} className="border-b border-[var(--border)] pb-3 last:border-0">
                  <span className="text-sm font-medium text-[var(--secondary)] block mb-1">{item.label}</span>
                  {item.isLink ? (
                    <a href={item.value} target="_blank" rel="noopener noreferrer" 
                       className="text-[var(--primary)] hover:text-[var(--primary)]/80 font-semibold transition-colors duration-200">
                      View Document
                    </a>
                  ) : (
                    <p className="text-[var(--foreground)] font-semibold">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Technical/Professional Data</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Licensed Boundary Survey', value: application.licensed_boundary_survey, isLink: true },
                { label: 'Project Team Credentials', value: application.project_team_credentials, isLink: true },
                { label: 'Economic Viability Report', value: application.economic_viability_report, isLink: true }
              ].map((item, index) => (
                <div key={index} className="border-b border-[var(--border)] pb-3 last:border-0">
                  <span className="text-sm font-medium text-[var(--secondary)] block mb-1">{item.label}</span>
                  <a href={item.value} target="_blank" rel="noopener noreferrer" 
                     className="text-[var(--primary)] hover:text-[var(--primary)]/80 font-semibold transition-colors duration-200">
                    View Document
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Type of Industry Mining Operation</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Blasting Method', value: application.blasting_method },
                { label: 'Depth of Borehole', value: application.depth_of_borehole },
                { label: 'Production Volume', value: application.production_volume },
                { label: 'Machinery Used', value: application.machinery_used },
                { label: 'Underground Mining Depth', value: application.underground_mining_depth },
                { label: 'Explosives Type', value: application.explosives_type }
              ].map((item, index) => (
                <div key={index} className="border-b border-[var(--border)] pb-3 last:border-0">
                  <span className="text-sm font-medium text-[var(--secondary)] block mb-1">{item.label}</span>
                  <p className="text-[var(--foreground)] font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Details of License Area</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Land Name', value: application.land_name },
                { label: 'Land Owner Name', value: application.land_owner_name },
                { label: 'Village Name', value: application.village_name },
                { label: 'Grama Niladhari Division', value: application.grama_niladhari_division },
                { label: 'Administrative District', value: application.administrative_district }
              ].map((item, index) => (
                <div key={index} className="border-b border-[var(--border)] pb-3 last:border-0">
                  <span className="text-sm font-medium text-[var(--secondary)] block mb-1">{item.label}</span>
                  <p className="text-[var(--foreground)] font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Other Information</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Mine Restoration Plan', value: application.mine_restoration_plan, isLink: true },
                { label: 'Minerals to be Mined', value: application.minerals_to_be_mined },
                { label: 'Nature of Bound', value: application.nature_of_bound },
                { label: 'License Fee Receipt', value: application.license_fee_receipt, isLink: true }
              ].map((item, index) => (
                <div key={index} className="border-b border-[var(--border)] pb-3 last:border-0">
                  <span className="text-sm font-medium text-[var(--secondary)] block mb-1">{item.label}</span>
                  {item.isLink ? (
                    <a href={item.value} target="_blank" rel="noopener noreferrer" 
                       className="text-[var(--primary)] hover:text-[var(--primary)]/80 font-semibold transition-colors duration-200">
                      View Document
                    </a>
                  ) : (
                    <p className="text-[var(--foreground)] font-semibold">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Status Information</h2>
            </div>
            <div className="space-y-4">
              <div className="border-b border-[var(--border)] pb-3">
                <span className="text-sm font-medium text-[var(--secondary)] block mb-2">Current Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
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
              </div>
              <div className="border-b border-[var(--border)] pb-3">
                <span className="text-sm font-medium text-[var(--secondary)] block mb-1">Submission Date</span>
                <p className="text-[var(--foreground)] font-semibold">{new Date(application.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-center pt-2">
                <Link href={`/status/${application.id}`}
                  className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Update Status
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Required Documents</h2>
            </div>
            <div className="space-y-3">
              {application.documents.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center border-b border-[var(--border)] pb-3 last:border-0">
                  <span className="text-[var(--foreground)] font-medium">{doc.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
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

          <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Comments & Updates</h2>
            </div>
            <div className="space-y-4">
              {application.comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-[var(--primary)] pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[var(--foreground)] font-medium mb-1">{comment.text}</p>
                      <p className="text-sm text-[var(--secondary)]">{comment.author}</p>
                    </div>
                    <span className="text-sm text-[var(--secondary)]">
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