import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { formatDate } from '../../lib/utils'
import { api } from '../../lib/api'
import type { Booking, BookingStatus, PricingType } from '../../types'

type BackendBooking = {
  id: number
  clientId: number
  serviceId: number
  bookingDate: string
  scheduledTime: string
  notes?: string | null
  status: BookingStatus
  createdAt: string
  client: {
    id: number
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string | null
  }
  service: {
    id: number
    title: string
    price: string | number
    pricingType: string
  }
}

const mapBooking = (booking: BackendBooking): Booking => {
  const scheduledDate = new Date(booking.scheduledTime)

  const pricingType: PricingType =
    booking.service.pricingType === 'HOURLY'
      ? 'HOURLY'
      : 'FIXED'

  return {
    id: String(booking.id),
    serviceId: String(booking.serviceId),
    serviceName: booking.service.title,

    clientId: String(booking.clientId),
    clientName: `${booking.client.firstName} ${booking.client.lastName}`,
    clientEmail: booking.client.email,

    providerId: '',
    providerName: '',

    date: booking.bookingDate
      ? booking.bookingDate.split('T')[0]
      : scheduledDate.toISOString().split('T')[0],

    time: scheduledDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),

    notes: booking.notes ?? undefined,
    status: booking.status,

    price: Number(booking.service.price),
    pricingType,

    createdAt: booking.createdAt,
  }
}

export default function ProviderDashboard() {
  const { user, providerServices, navigate } = useApp()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await api.get<{
          count: number
          bookings: BackendBooking[]
        }>('/api/bookings/provider')

        setBookings(response.bookings.map(mapBooking))
      } catch (error) {
        console.error(
          'Failed to load provider dashboard bookings:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  const totalServices = providerServices.length

  const pending = bookings.filter(
    (booking) => booking.status === 'PENDING',
  ).length

  const accepted = bookings.filter(
    (booking) => booking.status === 'ACCEPTED',
  ).length

  const completed = bookings.filter(
    (booking) => booking.status === 'COMPLETED',
  ).length

  const recent = bookings.slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-0.5">
          Welcome back, {user?.firstName}.
        </p>
      </div>

      {/* Compact stats strip */}
      <div className="bg-white border border-gray-200 rounded-md px-5 py-4 mb-6">
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {totalServices}
            </span>

            <span className="text-sm text-gray-500 ml-1.5">
              {totalServices === 1 ? 'service' : 'services'}
            </span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-gray-200" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-amber-700">
              {loading ? '—' : pending}
            </span>

            <span className="text-sm text-gray-500">
              pending
            </span>

            {!loading && pending > 0 && (
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Action needed
              </span>
            )}
          </div>

          <div className="hidden sm:block w-px h-5 bg-gray-200" />

          <div>
            <span className="text-sm font-semibold text-blue-700">
              {loading ? '—' : accepted}
            </span>

            <span className="text-sm text-gray-500 ml-1">
              accepted
            </span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-gray-200" />

          <div>
            <span className="text-sm font-semibold text-green-700">
              {loading ? '—' : completed}
            </span>

            <span className="text-sm text-gray-500 ml-1">
              completed
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('provider-services')}
        >
          Manage services
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('provider-bookings')}
        >
          View bookings
        </Button>
      </div>

      {/* Recent bookings */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            Recent booking requests
          </h2>

          <button
            onClick={() => navigate('provider-bookings')}
            className="text-xs text-brand hover:underline"
          >
            View all
          </button>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="px-5 py-4 flex items-center gap-3 animate-pulse"
              >
                <div className="w-7 h-7 rounded-full bg-gray-200" />

                <div className="flex-1">
                  <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-56 bg-gray-100 rounded" />
                </div>

                <div className="h-5 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-500 mb-3">
              No bookings received yet.
            </p>

            <Button
              size="sm"
              onClick={() => navigate('provider-services')}
            >
              Add a service
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map((booking) => (
              <div
                key={booking.id}
                className="px-5 py-3.5 flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-semibold shrink-0">
                  {booking.clientName
                    .split(' ')
                    .map((name) => name[0])
                    .join('')}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {booking.clientName}
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {booking.serviceName} ·{' '}
                    {formatDate(booking.date)}
                  </p>
                </div>

                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}