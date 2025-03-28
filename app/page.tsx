'use client';

import Link from 'next/link';
import Layout from './components/Layout';
import UserGreeting from "./components/UserGreeting";

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-float">
          <h1 className="text-5xl font-bold text-orange-500 mb-4">
            Welcome
          </h1>
          <p className="text-lg text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Manage mining license applications efficiently with our comprehensive dashboard tools.
          </p>
        </div>
        <UserGreeting />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'View Applications',
              description: 'Check and review all applications',
              href: '/applications',
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
            },
            {
              title: 'Calculate Royalty',
              description: 'Compute royalty fees based on mining data',
              href: '/royalty',
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              title: 'Complaints',
              description: 'Manage and resolve user complaints',
              href: '/complaints',
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              ),
            },
            {
              title: 'Users',
              description: 'Manage user accounts',
              href: '/users',
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              title: 'Contact Responses',
              description: 'View all contact responses',
              href: '/contact',
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              title: 'Map',
              description: 'Add new mining areas',
              href: '/mapLocations',
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ),
            },
          ].map((card, index) => (
            <Link key={card.href} href={card.href} className="group">
              <div 
                className="card-hover bg-gradient-to-br from-[var(--card-bg)] to-[var(--background)] p-8 rounded-xl"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-4 group-hover:animate-bounce">
                  {card.icon}
                </div>
                <h2 className="text-2xl font-bold text-center mb-3 group-hover:gradient-text">
                  {card.title}
                </h2>
                <p className="text-center opacity-90">
                  {card.description}
                </p>
        </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
