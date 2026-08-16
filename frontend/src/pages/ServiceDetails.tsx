import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { CategoryBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { formatNaira } from '../lib/utils'
import { api } from '../lib/api'
import type { Service, ServiceCategory } from '../types'

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

const deriveCategory = (title: string): ServiceCategory => {
  const normalizedTitle = title.toLowerCase()

  if (
    normalizedTitle.includes('web') ||
    normalizedTitle.includes('software') ||
    normalizedTitle.includes('developer') ||
    normalizedTitle.includes('mobile') ||
    normalizedTitle.includes('app')
  ) {
    return 'Development'
  }

  if (
    normalizedTitle.includes('design') ||
    normalizedTitle.includes('logo') ||
    normalizedTitle.includes('brand')
  ) {
    return 'Design'
  }

  if (
    normalizedTitle.includes('seo') ||
    normalizedTitle.includes('marketing') ||
    normalizedTitle.includes('social media')
  ) {
    return 'Marketing'
  }

  if (
    normalizedTitle.includes('writing') ||
    normalizedTitle.includes('documentation')
  ) {
    return 'Writing'
  }

  if (
    normalizedTitle.includes('photo') ||
    normalizedTitle.includes('video')
  ) {
    return 'Photography & Video'
  }

  return 'Consulting'
}

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

const mapService = (service: BackendService): Service => ({
  id: String(service.id),
  providerId: String(service.providerId),
  providerName: `${service.provider.firstName} ${service.provider.lastName}`,
  title: service.title,
  description: service.description,
  category: deriveCategory(service.title),
  price: Number(service.price),
  pricingType:
    service.pricingType === 'HOURLY' ? 'HOURLY' : 'FIXED',
  location: service.provider.location ?? '',
  availability: service.availability ?? '',
  tags: [],
  imageUrl: getFallbackImage(service.title),
  createdAt: service.createdAt,
})

export default function ServiceDetails() {
  const { pageParams, navigate, user } = useApp()

  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadService = async () => {
      if (!pageParams.serviceId) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

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
        setLoading(false)
      }
    }

    loadService()
  }, [pageParams.serviceId])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-60 sm:h-72 bg-gray-200 rounded-lg animate-pulse mb-6" />
            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="h-56 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-sm text-gray-500 mb-4">
          {error || 'Service not found.'}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('browse')}
        >
          Back to Browse
        </Button>
      </div>
    )
  }

  const handleBook = () => {
    if (!user) {
      navigate('login')
      return
    }

    if (user.role !== 'CLIENT') {
      return
    }

    navigate('create-booking', {
      serviceId: service.id,
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Back */}
      <button
        onClick={() => navigate('browse')}
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

        Back to browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="h-60 sm:h-72 rounded-lg overflow-hidden bg-gray-100 mb-6">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mb-4">
            <CategoryBadge category={service.category} />

            <h1
              className="text-2xl font-bold text-gray-900 mt-2 mb-1"
              style={{ letterSpacing: '-0.01em' }}
            >
              {service.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              {service.location && (
                <>
                  <span>{service.location}</span>
                  <span className="text-gray-300">·</span>
                </>
              )}

              <span>{service.availability || 'Availability not specified'}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              About this service
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          {service.tags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Skills and tools
              </h2>

              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Pricing card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="mb-4">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatNaira(service.price)}
                  </span>

                  <span className="text-sm text-gray-500">
                    {service.pricingType === 'HOURLY'
                      ? '/ hour'
                      : ' fixed price'}
                  </span>
                </div>

                <span className="text-xs text-green-700 font-medium">
                  Available
                </span>
              </div>

              {user?.role === 'PROVIDER' ? (
                <p className="text-sm text-gray-500">
                  Switch to a client account to book this service.
                </p>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleBook}
                >
                  {user ? 'Book this service' : 'Sign in to book'}
                </Button>
              )}
            </div>

            {/* Provider card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Provider
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand text-sm font-semibold shrink-0">
                  {service.providerName
                    .split(' ')
                    .map((name) => name[0])
                    .join('')}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {service.providerName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {service.location || 'Location not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}