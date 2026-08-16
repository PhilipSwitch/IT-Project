import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { formatNaira, formatDate } from '../../lib/utils'
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
  service: {
    id: number
    title: string
    price: string | number
    pricingType: string
    provider: {
      id: number
      firstName: string
      lastName: string
    }
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
    clientName: '',
    clientEmail: '',

    providerId: String(booking.service.provider.id),
    providerName: `${booking.service.provider.firstName} ${booking.service.provider.lastName}`,

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

export default function ClientDashboard() {
  const { user, navigate } = useApp()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await api.get<{
          count: number
          bookings: BackendBooking[]
        }>('/api/bookings/client')

        setBookings(response.bookings.map(mapBooking))
      } catch (error) {
        console.error(
          'Failed to load client dashboard bookings:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Welcome, {user?.firstName}
        </h1>

        <p className="text-sm text-gray-500 mt-0.5">
          Here is a summary of your activity on SkillLink.
        </p>
      </div>

      {/* Compact stats strip */}
      <div className="bg-white border border-gray-200 rounded-md px-5 py-4 mb-6">
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {loading ? '—' : bookings.length}
            </span>

            <span className="text-sm text-gray-500 ml-1.5">
              total bookings
            </span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-gray-200" />

          <div>
            <span className="text-sm font-semibold text-amber-700">
              {loading ? '—' : pending}
            </span>

            <span className="text-sm text-gray-500 ml-1">
              pending
            </span>
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
          onClick={() => navigate('browse')}
        >
          Browse services
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('client-bookings')}
        >
          View all bookings
        </Button>
      </div>

      {/* Recent bookings */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            Recent bookings
          </h2>

          <button
            onClick={() => navigate('client-bookings')}
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
                className="px-5 py-4 flex items-center gap-4 animate-pulse"
              >
                <div className="flex-1">
                  <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-64 bg-gray-100 rounded" />
                </div>

                <div className="h-5 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-500 mb-3">
              No bookings yet.
            </p>

            <Button
              size="sm"
              onClick={() => navigate('browse')}
            >
              Find a service
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map((booking) => (
              <div
                key={booking.id}
                className="px-5 py-3.5 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {booking.serviceName}
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {booking.providerName} ·{' '}
                    {formatDate(booking.date)} at {booking.time}
                  </p>
                </div>

                <StatusBadge status={booking.status} />

                <div className="shrink-0 text-sm font-semibold text-gray-700 hidden sm:block">
                  {formatNaira(booking.price)}

                  <span className="text-xs font-normal text-gray-400 ml-0.5">
                    {booking.pricingType === 'HOURLY'
                      ? '/hr'
                      : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}