'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      });
      if (response.ok) {
        router.push('/');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important: This ensures cookies are sent/received
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: 'Login successful',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      // Wait for the success message before redirecting
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to dashboard
      window.location.href = '/'; // Use window.location for a full page refresh
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Login failed',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-[var(--background)] p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--foreground)]">
              Login
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--foreground)] opacity-80">
              Login to access the admin dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border)] placeholder-[var(--foreground)] opacity-50 rounded-t-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm bg-[var(--input-background)]"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br></br>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border)] placeholder-[var(--foreground)] opacity-50 rounded-b-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm bg-[var(--input-background)]"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--foreground)] hover:bg-[var(--foreground)] opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 