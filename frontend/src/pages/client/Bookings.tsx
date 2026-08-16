import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { formatNaira, formatDate } from '../../lib/utils'
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
  { label: 'Cancelled', value: 'CANCELLED' },
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

export default function ClientBookings() {
  const { navigate } = useApp()

  const [clientBookings, setClientBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] =
    useState<BookingStatus | 'ALL'>('ALL')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [cancelling, setCancelling] = useState<string | null>(null)

  const loadBookings = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get<{
        count: number
        bookings: BackendBooking[]
      }>('/api/bookings/client')

      setClientBookings(
        response.bookings.map(mapBooking),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your bookings.',
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
      ? clientBookings
      : clientBookings.filter(
          (booking) => booking.status === activeTab,
        )

  const handleCancel = async (id: string) => {
    setCancelling(id)
    setError(null)

    try {
      await api.patch(`/api/bookings/${id}/cancel`)

      setClientBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status: 'CANCELLED',
              }
            : booking,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to cancel this booking.',
      )
    } finally {
      setCancelling(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            My Bookings
          </h1>

          <p className="text-xs text-gray-500 mt-0.5">
            {clientBookings.length} total
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('browse')}
        >
          Browse services
        </Button>
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
              ? clientBookings.length
              : clientBookings.filter(
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
          title={
            activeTab === 'ALL'
              ? 'No bookings yet'
              : `No ${activeTab.toLowerCase()} bookings`
          }
          description="When you book a service, it will appear here."
          action={{
            label: 'Browse services',
            onClick: () => navigate('browse'),
          }}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">
                    Service
                  </th>

                  <th className="text-left px-3 py-3 text-xs font-medium text-gray-500">
                    Provider
                  </th>

                  <th className="text-left px-3 py-3 text-xs font-medium text-gray-500">
                    Date &amp; Time
                  </th>

                  <th className="text-left px-3 py-3 text-xs font-medium text-gray-500">
                    Price
                  </th>

                  <th className="text-left px-3 py-3 text-xs font-medium text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3" />
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filtered.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-gray-900 line-clamp-1 max-w-[200px] block">
                        {booking.serviceName}
                      </span>

                      {booking.notes && (
                        <span className="text-xs text-gray-400 line-clamp-1 mt-0.5 block max-w-[200px]">
                          {booking.notes}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3.5 text-gray-600 whitespace-nowrap">
                      {booking.providerName}
                    </td>

                    <td className="px-3 py-3.5 text-gray-600 whitespace-nowrap">
                      {formatDate(booking.date)}

                      <span className="text-gray-300 mx-1">
                        ·
                      </span>

                      {booking.time}
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">
                        {formatNaira(booking.price)}
                      </span>

                      <span className="text-xs text-gray-400 ml-0.5">
                        {booking.pricingType === 'HOURLY'
                          ? '/hr'
                          : ''}
                      </span>
                    </td>

                    <td className="px-3 py-3.5">
                      <StatusBadge status={booking.status} />
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {booking.status === 'PENDING' && (
                        <button
                          onClick={() =>
                            handleCancel(booking.id)
                          }
                          disabled={
                            cancelling === booking.id
                          }
                          className="text-xs text-red-600 hover:underline disabled:opacity-50"
                        >
                          {cancelling === booking.id
                            ? 'Cancelling…'
                            : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-md p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-medium text-gray-900 leading-snug">
                    {booking.serviceName}
                  </h3>

                  <StatusBadge status={booking.status} />
                </div>

                <p className="text-xs text-gray-500 mb-2">
                  {booking.providerName}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {formatDate(booking.date)} ·{' '}
                    {booking.time}
                  </span>

                  <span className="font-semibold text-gray-900 text-sm">
                    {formatNaira(booking.price)}

                    <span className="text-xs font-normal text-gray-400 ml-0.5">
                      {booking.pricingType === 'HOURLY'
                        ? '/hr'
                        : ''}
                    </span>
                  </span>
                </div>

                {booking.notes && (
                  <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                    {booking.notes}
                  </p>
                )}

                {booking.status === 'PENDING' && (
                  <button
                    onClick={() =>
                      handleCancel(booking.id)
                    }
                    disabled={cancelling === booking.id}
                    className="mt-3 text-xs text-red-600 hover:underline disabled:opacity-50"
                  >
                    {cancelling === booking.id
                      ? 'Cancelling…'
                      : 'Cancel booking'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}