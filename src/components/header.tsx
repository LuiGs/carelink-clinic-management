'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  return (
    <header className="bg-white border-b-2 border-cyan-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/" className="text-lg sm:text-xl font-bold text-cyan-700">
            Dermacor
          </Link>
          {session && (
            <Link
              href="/obras-sociales"
              className="hidden sm:block text-cyan-600 hover:text-cyan-800 font-medium transition-colors text-sm sm:text-base"
            >
              Obras Sociales
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
        >
          <span className={`h-0.5 w-6 bg-cyan-700 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-cyan-700 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-cyan-700 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-4">
          {session ? (
            <>
              <span className="text-xs sm:text-sm text-cyan-700 font-medium truncate max-w-xs">
                {session.user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 transition-colors shadow-sm whitespace-nowrap"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium text-cyan-700 hover:bg-cyan-50 transition-colors whitespace-nowrap"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 transition-colors shadow-sm whitespace-nowrap"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t-2 border-cyan-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            {session && (
              <>
                <Link
                  href="/obras-sociales"
                  className="block text-cyan-600 hover:text-cyan-800 font-medium py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Obras Sociales
                </Link>
              </>
            )}
            {session ? (
              <>
                <div className="text-xs text-cyan-700 font-medium py-2 truncate">
                  {session.user?.email}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 transition-colors shadow-sm"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block text-center px-4 py-2 rounded-md text-sm font-medium text-cyan-700 hover:bg-cyan-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="block text-center px-4 py-2 rounded-md text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 transition-colors shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
