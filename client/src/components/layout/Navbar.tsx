'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-white/90 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-colors">
              J
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">JobPortal</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/jobs"
              className={`text-sm font-medium transition-colors ${isActive('/jobs') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className={`text-sm font-medium transition-colors ${isActive('/companies') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Companies
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-sm font-medium text-red-600 hover:text-red-800">
                    Admin Panel
                  </Link>
                )}
                <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
