import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import type { UserRole } from '../types'

export default function Register() {
  const { register, navigate, authError, authLoading, setAuthError } = useApp()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'CLIENT' as UserRole,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    if (!validate()) return
    await register(form)
  }

  return (
    <div className="min-h-[calc(100vh-52px)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="mb-7">
          <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Already have an account?{' '}
            <button onClick={() => navigate('login')} className="text-brand font-medium hover:underline">
              Sign in
            </button>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                type="text"
                autoComplete="given-name"
                placeholder="Adaeze"
                value={form.firstName}
                onChange={set('firstName')}
                error={errors.firstName}
                disabled={authLoading}
              />
              <Input
                label="Last name"
                type="text"
                autoComplete="family-name"
                placeholder="Okonkwo"
                value={form.lastName}
                onChange={set('lastName')}
                error={errors.lastName}
                disabled={authLoading}
              />
            </div>

            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              disabled={authLoading}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              disabled={authLoading}
            />

            {/* Role selection */}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">I want to</p>
              <div className="grid grid-cols-2 gap-2">
                {(['CLIENT', 'PROVIDER'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, role }))}
                    className={[
                      'flex flex-col items-start p-3 rounded border text-left transition-colors',
                      form.role === role
                        ? 'border-brand bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300',
                    ].join(' ')}
                  >
                    <span className={`text-sm font-medium mb-0.5 ${form.role === role ? 'text-brand' : 'text-gray-800'}`}>
                      {role === 'CLIENT' ? 'Hire talent' : 'Offer services'}
                    </span>
                    <span className="text-xs text-gray-500 leading-snug">
                      {role === 'CLIENT'
                        ? 'Find and book freelancers'
                        : 'List your services and get clients'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-xs text-red-700">{authError}</p>
              </div>
            )}

            <Button type="submit" variant="primary" size="md" fullWidth loading={authLoading}>
              {authLoading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
