'use client';

import Link from 'next/link';
import Layout from './components/Layout';
import UserGreeting from "./components/UserGreeting";

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Welcome to Admin Portal
          </h1>
          <p className="text-lg text-[var(--secondary)] max-w-2xl mx-auto">
            Manage mining license applications efficiently.
          </p>
        </div>

        <UserGreeting />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: 'View Applications',
              description: 'Check and review all applications',
              href: '/applications',
              icon: (
                <svg className="w-12 h-12 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
            },
            {
              title: 'Calculate Royalty',
              description: 'Compute royalty fees based on mining data',
              href: '/royalty',
              icon: (
                <svg className="w-12 h-12 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              title: 'Manage Complaints',
              description: 'Handle and track user complaints',
              href: '/complaints',
              icon: (
                <svg className="w-12 h-12 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              ),
            },
            {
              title: 'User Management',
              description: 'Manage user accounts and permissions',
              href: '/users',
              icon: (
                <svg className="w-12 h-12 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
            },
            {
              title: 'Map Locations',
              description: 'View and manage mining locations',
              href: '/mapLocations',
              icon: (
                <svg className="w-12 h-12 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
            },
            {
              title: 'Contact Responses',
              description: 'Manage user inquiries and responses',
              href: '/contact',
              icon: (
                <svg className="w-12 h-12 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card group hover:border-[var(--primary)] transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center p-6">
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--secondary)]">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
