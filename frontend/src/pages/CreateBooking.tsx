import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Input, { Textarea } from '../components/ui/Input'
import { formatNaira } from '../lib/utils'
import { api } from '../lib/api'
import type { Service } from '../types'

type BackendService = {
  id: number
  providerId: number
  title: string
  description: string
  price: string | number
  pricingType: string
  availability?: string | null
  createdAt: string
  provider: {
    id: number
    firstName: string
    lastName: string
    location?: string | null
  }
}

const getFallbackImage = (title: string) => {
  const normalizedTitle = title.toLowerCase()

  if (
    normalizedTitle.includes('web') ||
    normalizedTitle.includes('software') ||
    normalizedTitle.includes('developer') ||
    normalizedTitle.includes('mobile') ||
    normalizedTitle.includes('app')
  ) {
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&auto=format'
  }

  if (
    normalizedTitle.includes('design') ||
    normalizedTitle.includes('logo') ||
    normalizedTitle.includes('brand')
  ) {
    return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop&auto=format'
  }

  if (
    normalizedTitle.includes('seo') ||
    normalizedTitle.includes('marketing') ||
    normalizedTitle.includes('social media')
  ) {
    return 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=500&fit=crop&auto=format'
  }

  if (
    normalizedTitle.includes('photo') ||
    normalizedTitle.includes('video')
  ) {
    return 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&h=500&fit=crop&auto=format'
  }

  return 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop&auto=format'
}

const mapService = (service: BackendService): Service => ({
  id: String(service.id),
  providerId: String(service.providerId),
  providerName: `${service.provider.firstName} ${service.provider.lastName}`,
  title: service.title,
  description: service.description,
  category: 'Consulting',
  price: Number(service.price),
  pricingType:
    service.pricingType === 'HOURLY' ? 'HOURLY' : 'FIXED',
  location: service.provider.location ?? '',
  availability: service.availability ?? '',
  tags: [],
  imageUrl: getFallbackImage(service.title),
  createdAt: service.createdAt,
})

export default function CreateBooking() {
  const { pageParams, navigate } = useApp()

  const [service, setService] = useState<Service | null>(null)
  const [loadingService, setLoadingService] = useState(true)

  const [form, setForm] = useState({
    date: '',
    time: '',
    notes: '',
  })

  const [errors, setErrors] = useState<{
    date?: string
    time?: string
  }>({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const loadService = async () => {
      if (!pageParams.serviceId) {
        setLoadingService(false)
        return
      }

      try {
        const response = await api.get<{
          service: BackendService
        }>(`/api/services/${pageParams.serviceId}`)

        setService(mapService(response.service))
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load this service.',
        )
      } finally {
        setLoadingService(false)
      }
    }

    loadService()
  }, [pageParams.serviceId])

  const validate = () => {
    const nextErrors: typeof errors = {}

    if (!form.date) {
      nextErrors.date = 'Please select a date'
    } else if (
      new Date(form.date) < new Date(new Date().toDateString())
    ) {
      nextErrors.date = 'Date must be today or in the future'
    }

    if (!form.time) {
      nextErrors.time = 'Please select a time'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !service) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await api.post('/api/bookings', {
        serviceId: Number(service.id),
        bookingDate: form.date,
        scheduledTime: `${form.date}T${form.time}:00.000Z`,
        notes: form.notes || undefined,
      })

      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create booking. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (loadingService) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-20 bg-gray-200 rounded-lg animate-pulse mb-5" />
        <div className="h-72 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-gray-500 mb-4">
          {error || 'Service not found.'}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('browse')}
        >
          Browse services
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-base font-bold text-gray-900 mb-1">
            Booking request sent
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Your booking for <strong>{service.title}</strong> has been
            submitted. The provider will review and respond shortly.
          </p>

          <div className="flex items-center justify-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('client-bookings')}
            >
              View my bookings
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('browse')}
            >
              Browse more
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-7">
      <button
        onClick={() =>
          navigate('service-details', {
            serviceId: service.id,
          })
        }
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>

        Back to service
      </button>

      <h1 className="text-lg font-bold text-gray-900 mb-1">
        Book this service
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Submit a request — the provider will confirm your booking.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5 flex items-start gap-3">
        {service.imageUrl && (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-14 h-14 rounded object-cover shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {service.title}
          </p>

          <p className="text-xs text-gray-500 mt-0.5">
            {service.providerName}
            {service.location ? ` · ${service.location}` : ''}
          </p>

          <p className="text-sm font-bold text-gray-900 mt-1.5">
            {formatNaira(service.price)}

            <span className="text-xs font-normal text-gray-500 ml-1">
              {service.pricingType === 'HOURLY' ? '/hr' : 'fixed'}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              min={today}
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
              error={errors.date}
              disabled={loading}
            />

            <Input
              label="Time"
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  time: e.target.value,
                }))
              }
              error={errors.time}
              disabled={loading}
            />
          </div>

          <Textarea
            label="Notes for the provider (optional)"
            placeholder="Describe your project or any specific requirements…"
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            rows={4}
            disabled={loading}
          />

          <div className="pt-1">
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
            >
              {loading
                ? 'Submitting…'
                : 'Submit booking request'}
            </Button>

            <p className="text-xs text-gray-400 text-center mt-2">
              No payment required at this stage.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}