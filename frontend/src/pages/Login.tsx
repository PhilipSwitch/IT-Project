import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const { login, navigate, authError, authLoading, setAuthError } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const e: typeof errors = {}
    if (!email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    if (!validate()) return
    await login(email, password)
  }

  return (
    <div className="min-h-[calc(100vh-52px)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="mb-7">
          <h1 className="text-xl font-bold text-gray-900">Sign in to SkillLink</h1>
          <p className="text-sm text-gray-500 mt-1">
            Don&apos;t have an account?{' '}
            <button onClick={() => navigate('register')} className="text-brand font-medium hover:underline">
              Create one
            </button>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Demo hint */}
          <div className="mb-5 p-3 rounded bg-gray-50 border border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-1">Demo accounts</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Client: client@example.com<br />
              Provider: provider@example.com<br />
              Password: password123
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={authLoading}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              disabled={authLoading}
            />

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-xs text-red-700">{authError}</p>
              </div>
            )}

            <Button type="submit" variant="primary" size="md" fullWidth loading={authLoading}>
              {authLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
