'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Swal from 'sweetalert2';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [currentYear, setCurrentYear] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: 'Logged out successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      // Clear any client-side state
      localStorage.removeItem('adminToken');
      
      // Wait for the success message before redirecting
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Use window.location for a full page refresh and redirect
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to logout',
        icon: 'error'
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  // Don't show navigation on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const navItems = [
    ['Applications', '/applications'],
    ['Royalty', '/royalty'],
    ['Complaints', '/complaints'],
    ['Users', '/users'],
    ['Map', '/mapLocations'],
    ['Responses', '/contact']
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm' 
            : 'bg-white'
        } border-b border-[var(--border)]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-[var(--primary)]">
              CeylonMine Admin
            </Link>
            
            {/* Hamburger Menu (Mobile) */}
            <button 
              className="md:hidden text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50 rounded-lg p-2" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map(([title, url]) => (
                <Link
                  key={url}
                  href={url}
                  className="relative group"
                >
                  <span className={`text-[var(--foreground)] hover:text-[var(--primary)] transition-colors ${
                    pathname === url ? 'text-[var(--primary)] font-medium' : ''
                  }`}>
                    {title}
                  </span>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-[var(--primary)] transition-all ${
                    pathname === url ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-[var(--error)] hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-lg px-3 py-1"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
        
        {/* Mobile Navigation Overlay */}
        <div className={`md:hidden fixed inset-0 bg-white z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8 text-xl">
            {navItems.map(([title, url]) => (
              <Link
                key={url}
                href={url}
                className={`text-[var(--foreground)] hover:text-[var(--primary)] transition-colors ${
                  pathname === url ? 'text-[var(--primary)] font-medium' : ''
                }`}
              >
                {title}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="text-[var(--error)] hover:text-red-700 transition-colors mt-4"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-slide-in">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[var(--border)] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-[var(--primary)] font-medium">
              © {currentYear} CeylonMine
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 