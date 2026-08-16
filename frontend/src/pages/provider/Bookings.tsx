import { useEffect, useState } from 'react'
import { StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { formatNaira, formatDateLong } from '../../lib/utils'
import { api } from '../../lib/api'
import type { Booking, BookingStatus, PricingType } from '../../types'

const TABS: {
  label: string
  value: BookingStatus | 'ALL'
}[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Rejected', value: 'REJECTED' },
]

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

    // Provider is the authenticated user, so we do not receive
    // provider details from the provider-bookings endpoint.
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

export default function ProviderBookings() {
  const [providerBookings, setProviderBookings] = useState<Booking[]>([])

  const [activeTab, setActiveTab] =
    useState<BookingStatus | 'ALL'>('ALL')

  const [acting, setActing] = useState<{
    id: string
    action: 'accept' | 'reject' | 'complete'
  } | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBookings = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get<{
        count: number
        bookings: BackendBooking[]
      }>('/api/bookings/provider')

      setProviderBookings(
        response.bookings.map(mapBooking),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load bookings.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const filtered =
    activeTab === 'ALL'
      ? providerBookings
      : providerBookings.filter(
          (booking) => booking.status === activeTab,
        )

  const act = async (
    id: string,
    action: 'accept' | 'reject' | 'complete',
  ) => {
    setActing({ id, action })
    setError(null)

    try {
      const endpoint =
        action === 'accept'
          ? `/api/bookings/${id}/accept`
          : action === 'reject'
            ? `/api/bookings/${id}/reject`
            : `/api/bookings/${id}/complete`

      await api.patch(endpoint)

      const nextStatus: BookingStatus =
        action === 'accept'
          ? 'ACCEPTED'
          : action === 'reject'
            ? 'REJECTED'
            : 'COMPLETED'

      setProviderBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status: nextStatus,
              }
            : booking,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update this booking.',
      )
    } finally {
      setActing(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Bookings
        </h1>

        <p className="text-xs text-gray-500 mt-0.5">
          {providerBookings.length} total requests
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 overflow-x-auto mb-5 border-b border-gray-200">
        {TABS.map((tab) => {
          const count =
            tab.value === 'ALL'
              ? providerBookings.length
              : providerBookings.filter(
                  (booking) => booking.status === tab.value,
                ).length

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={[
                'flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors',
                activeTab === tab.value
                  ? 'border-brand text-brand font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-800',
              ].join(' ')}
            >
              {tab.label}

              {count > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No bookings here"
          description={
            activeTab === 'ALL'
              ? "You haven't received any booking requests yet."
              : `No ${activeTab.toLowerCase()} bookings.`
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-200 rounded-lg p-5 animate-fadeIn"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center text-brand text-xs font-semibold shrink-0">
                  {booking.clientName
                    .split(' ')
                    .map((name) => name[0])
                    .join('')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {booking.clientName}
                      </h3>

                      <StatusBadge status={booking.status} />
                    </div>

                    <span className="text-sm font-bold text-gray-900 shrink-0">
                      {formatNaira(booking.price)}

                      <span className="text-xs font-normal text-gray-400 ml-0.5">
                        {booking.pricingType === 'HOURLY'
                          ? '/hr'
                          : ''}
                      </span>
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">
                    {booking.clientEmail}
                  </p>

                  <div className="bg-gray-50 rounded px-3 py-2 mb-3">
                    <p className="text-xs text-gray-400 mb-0.5">
                      Service requested
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {booking.serviceName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 mb-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        Date
                      </p>

                      <p className="text-sm text-gray-800">
                        {formatDateLong(booking.date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        Time
                      </p>

                      <p className="text-sm text-gray-800">
                        {booking.time}
                      </p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="border border-blue-100 bg-blue-50 rounded px-3 py-2 mb-3">
                      <p className="text-xs text-gray-400 mb-0.5">
                        Client notes
                      </p>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  {booking.status === 'PENDING' && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Button
                        variant="primary"
                        size="sm"
                        loading={
                          acting?.id === booking.id &&
                          acting.action === 'accept'
                        }
                        onClick={() =>
                          act(booking.id, 'accept')
                        }
                      >
                        Accept
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        loading={
                          acting?.id === booking.id &&
                          acting.action === 'reject'
                        }
                        onClick={() =>
                          act(booking.id, 'reject')
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                  {booking.status === 'ACCEPTED' && (
                    <div className="pt-3 border-t border-gray-100">
                      <Button
                        size="sm"
                        className="bg-green-700 text-white hover:bg-green-800"
                        loading={
                          acting?.id === booking.id &&
                          acting.action === 'complete'
                        }
                        onClick={() =>
                          act(booking.id, 'complete')
                        }
                      >
                        Mark as completed
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}