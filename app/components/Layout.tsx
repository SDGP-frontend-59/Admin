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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-opacity-90 backdrop-blur-md shadow-lg' 
            : 'bg-opacity-100'
        } bg-[var(--background)] text-[var(--foreground)]`}
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-xl font-bold text-orange-500 animate-pulse-slow z-50">
            CeylonMine Admin
          </Link>
          
          {/* Hamburger Menu (Mobile) */}
          <button 
            className="md:hidden z-50 text-[var(--foreground)] focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              // X icon when menu is open
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map(([title, url]) => (
              <Link
                key={url}
                href={url}
                className="relative group"
              >
                <span className={`hover:text-[var(--primary)] transition-colors ${pathname === url ? 'text-blue-800 font-medium' : ''}`}>
                  {title}
                </span>
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[var(--primary)] transition-all ${pathname === url ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          </nav>
          
          {/* Mobile Navigation Overlay */}
          <div className={`md:hidden fixed inset-0 bg-[var(--background)] z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center justify-center h-full space-y-8 text-xl">
              {navItems.map(([title, url]) => (
                <Link
                  key={url}
                  href={url}
                  className={`relative hover:text-[var(--primary)] transition-colors ${pathname === url ? 'text-blue-800 font-medium' : ''}`}
                >
                  {title}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 transition-colors mt-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="animate-slide-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--background)] text-[var(--foreground)] p-6 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-orange-500 font-bold">
              © {currentYear} CeylonMine
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 