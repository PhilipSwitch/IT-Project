import type { BookingStatus, ServiceCategory } from '../../types'

const statusConfig: Record<BookingStatus, { label: string; classes: string }> = {
  PENDING: { label: 'Pending', classes: 'text-amber-700 bg-amber-50 border border-amber-200' },
  ACCEPTED: { label: 'Accepted', classes: 'text-blue-700 bg-blue-50 border border-blue-200' },
  COMPLETED: { label: 'Completed', classes: 'text-green-700 bg-green-50 border border-green-200' },
  REJECTED: { label: 'Rejected', classes: 'text-red-700 bg-red-50 border border-red-200' },
  CANCELLED: { label: 'Cancelled', classes: 'text-gray-500 bg-gray-100 border border-gray-200' },
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, classes } = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}

// Neutral style — category is metadata, not a state indicator.
export function CategoryBadge({ category }: { category: ServiceCategory }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-600 bg-gray-100">
      {category}
    </span>
  )
}
