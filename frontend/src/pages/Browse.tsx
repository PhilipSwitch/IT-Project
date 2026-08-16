import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import ServiceCard from '../components/ServiceCard'
import EmptyState from '../components/ui/EmptyState'
import type { ServiceCategory, Service } from '../types'
import { SERVICE_CATEGORIES } from '../types'
import { api } from '../lib/api'

const PRICING_FILTERS = [
  { label: 'Any price', min: 0, max: Infinity, fixed: false },
  { label: 'Under ₦20,000/hr', min: 0, max: 20000, fixed: false },
  { label: '₦20,000–₦50,000/hr', min: 20000, max: 50000, fixed: false },
  { label: 'Over ₦50,000/hr', min: 50000, max: Infinity, fixed: false },
  { label: 'Fixed price only', min: 0, max: Infinity, fixed: true },
]

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

export default function Browse() {
  const { services: initialServices } = useApp()

  const [services, setServices] = useState<Service[]>(initialServices)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ServiceCategory | 'All'>('All')
  const [pricingIdx, setPricingIdx] = useState(0)
  const [location, setLocation] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pricingFilter = PRICING_FILTERS[pricingIdx]

  useEffect(() => {
    let cancelled = false

    const loadServices = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (search.trim()) {
          params.set('search', search.trim())
        }

        if (pricingFilter.fixed) {
          params.set('pricingType', 'FIXED')
        }

        if (location.trim()) {
          params.set('location', location.trim())
        }

        const query = params.toString()
        const endpoint = query
          ? `/api/services?${query}`
          : '/api/services'

        const response = await api.get<{
          count: number
          services: BackendService[]
        }>(endpoint)

        if (!cancelled) {
          setServices(response.services.map(mapService))
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load services.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    const timeout = window.setTimeout(loadServices, 300)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [search, pricingFilter.fixed, location])

  const filtered = services.filter((service) => {
    if (category === 'All') {
      return true
    }

    return service.category === category
  })

  const hasFilters =
    category !== 'All' ||
    pricingIdx !== 0 ||
    Boolean(search) ||
    Boolean(location)

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setPricingIdx(0)
    setLocation('')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
      {/* Header + search */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          Browse services
        </h1>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by service, skill, or provider name…"
            className="w-full pl-9 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-gray-400"
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="bg-white border border-gray-200 rounded-md p-4 sticky top-24">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">
                Category
              </p>

              <div className="space-y-0.5">
                {(['All', ...SERVICE_CATEGORIES] as const).map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={[
                        'w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors',
                        category === cat
                          ? 'bg-brand-50 text-brand font-medium'
                          : 'text-gray-600 hover:bg-gray-50',
                      ].join(' ')}
                    >
                      {cat}
                    </button>
                  ),
                )}
              </div>
            </div>

            <hr className="border-gray-100 my-4" />

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">
                Pricing
              </p>

              <div className="space-y-0.5">
                {PRICING_FILTERS.map((filter, idx) => (
                  <button
                    key={filter.label}
                    onClick={() => setPricingIdx(idx)}
                    className={[
                      'w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors',
                      pricingIdx === idx
                        ? 'bg-brand-50 text-brand font-medium'
                        : 'text-gray-600 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 my-4" />

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">
                Location
              </p>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lagos, Abuja"
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 w-full text-xs text-gray-400 hover:text-gray-700 text-left"
              >
                Clear filters
              </button>
            )}
          </div>
        </aside>

        {/* Mobile filter chips */}
        <div className="lg:hidden w-full mb-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(['All', ...SERVICE_CATEGORIES] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={[
                    'px-3 py-1.5 rounded-md text-sm font-medium border whitespace-nowrap transition-colors',
                    category === cat
                      ? 'border-brand bg-brand text-white'
                      : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50',
                  ].join(' ')}
                >
                  {cat}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {loading
                ? 'Loading services…'
                : `${filtered.length} ${
                    filtered.length === 1 ? 'service' : 'services'
                  } found`}
            </p>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-gray-400 hover:text-gray-700 lg:hidden"
              >
                Clear filters
              </button>
            )}
          </div>

          {error ? (
            <EmptyState
              title="Unable to load services"
              description={error}
              action={{
                label: 'Try again',
                onClick: clearFilters,
              }}
            />
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-72 bg-white border border-gray-200 rounded-md animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No services found"
              description="Try adjusting your search or filters."
              action={{
                label: 'Clear all filters',
                onClick: clearFilters,
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}