import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { PageName } from '../context/AppContext'
import Button from './ui/Button'

function Initials({ name }: { name: string }) {
  const parts = name.split(' ')
  return (
    <span className="w-7 h-7 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center shrink-0 select-none">
      {parts[0][0]}{parts[1]?.[0] ?? ''}
    </span>
  )
}

function NavLink({
  label,
  target,
  current,
  onClick,
}: {
  label: string
  target: PageName
  current: PageName
  onClick: (p: PageName) => void
}) {
  const active = current === target
  return (
    <button
      onClick={() => onClick(target)}
      className={[
        'text-sm px-3 py-1.5 rounded transition-colors duration-150',
        active ? 'text-brand font-medium' : 'text-gray-500 hover:text-gray-900',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export default function Navbar() {
  const { user, page, navigate, logout } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const clientLinks: { label: string; target: PageName }[] = [
    { label: 'Browse', target: 'browse' },
    { label: 'My Bookings', target: 'client-bookings' },
  ]

  const providerLinks: { label: string; target: PageName }[] = [
    { label: 'Dashboard', target: 'provider-dashboard' },
    { label: 'My Services', target: 'provider-services' },
    { label: 'Bookings', target: 'provider-bookings' },
  ]

  const links = user?.role === 'PROVIDER' ? providerLinks : user?.role === 'CLIENT' ? clientLinks : []

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-13" style={{ height: '52px' }}>

          {/* Logo */}
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2 shrink-0"
          >
            <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-sm font-bold text-gray-900 tracking-tight">
              SkillLink
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {user ? (
              links.map((l) => (
                <NavLink key={l.target} label={l.label} target={l.target} current={page} onClick={navigate} />
              ))
            ) : (
              <NavLink label="Browse" target="browse" current={page} onClick={navigate} />
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 py-1.5 pl-1.5 pr-2.5 rounded hover:bg-gray-100 transition-colors"
                >
                  <Initials name={`${user.firstName} ${user.lastName}`} />
                  <span className="hidden sm:block text-sm text-gray-700">
                    {user.firstName}
                  </span>
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 animate-fadeIn">
                      <div className="px-3 py-2.5 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { navigate('profile'); setProfileOpen(false) }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Profile settings
                      </button>
                      <button
                        onClick={() => { logout(); setProfileOpen(false) }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('login')}>
                  Sign in
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('register')}>
                  Get started
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white py-2 px-4 space-y-0.5 animate-fadeIn">
          {user ? (
            <>
              {links.map((l) => (
                <button
                  key={l.target}
                  onClick={() => { navigate(l.target); setMenuOpen(false) }}
                  className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    page === l.target ? 'text-brand font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => { navigate('profile'); setMenuOpen(false) }}
                className="block w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile
              </button>
              <button
                onClick={() => { logout(); setMenuOpen(false) }}
                className="block w-full text-left px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate('browse'); setMenuOpen(false) }}
                className="block w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                Browse services
              </button>
              <button
                onClick={() => { navigate('login'); setMenuOpen(false) }}
                className="block w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                Sign in
              </button>
              <button
                onClick={() => { navigate('register'); setMenuOpen(false) }}
                className="block w-full text-left px-3 py-2 rounded text-sm text-brand font-medium hover:bg-brand-50"
              >
                Get started
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
