import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Input, { Textarea } from '../components/ui/Input'

export default function Profile() {
  const { user, logout, navigate } = useApp()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    location: user?.location ?? '',
    bio: user?.bio ?? '',
  })

  if (!user) {
    navigate('login')
    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }))
      setSaved(false)
    }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account information.</p>
      </div>

      {/* Profile header */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white text-base font-bold shrink-0 select-none">
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <span
            className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded border ${
              user.role === 'PROVIDER'
                ? 'bg-violet-50 text-violet-700 border-violet-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {user.role === 'PROVIDER' ? 'Service Provider' : 'Client'}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Personal information</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name" value={form.firstName} onChange={set('firstName')} disabled={loading} />
            <Input label="Last name" value={form.lastName} onChange={set('lastName')} disabled={loading} />
          </div>
          <Input label="Email address" type="email" value={form.email} onChange={set('email')} disabled={loading} />
          <Input
            label="Location"
            placeholder="e.g. Lagos, Lagos State"
            value={form.location}
            onChange={set('location')}
            disabled={loading}
          />
          <Textarea
            label="Bio"
            placeholder="Tell clients or providers a bit about yourself…"
            value={form.bio}
            onChange={set('bio')}
            rows={3}
            disabled={loading}
          />
          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" variant="primary" size="sm" loading={loading}>
              Save changes
            </Button>
            {saved && (
              <span className="text-sm text-green-600 animate-fadeIn">Saved</span>
            )}
          </div>
        </form>
      </div>

      {/* Account info */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Account details</h2>
        <div className="space-y-0 divide-y divide-gray-100">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-sm text-gray-500">Member since</span>
            <span className="text-sm text-gray-900">
              {new Date(user.joinedAt).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-sm text-gray-500">Account type</span>
            <span className="text-sm text-gray-900">{user.role === 'CLIENT' ? 'Client' : 'Provider'}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-sm text-gray-500">Account ID</span>
            <span className="text-xs text-gray-400 font-mono">{user.id}</span>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Sign out</h2>
        <p className="text-sm text-gray-500 mb-4">Sign out of your SkillLink account on this device.</p>
        <Button variant="danger" size="sm" onClick={logout}>Sign out</Button>
      </div>
    </div>
  )
}
