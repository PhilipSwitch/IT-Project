export type UserRole = 'CLIENT' | 'PROVIDER'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  location?: string
  bio?: string
  joinedAt: string
}

export type PricingType = 'HOURLY' | 'FIXED'

export type ServiceCategory =
  | 'Development'
  | 'Design'
  | 'Marketing'
  | 'Writing'
  | 'Photography & Video'
  | 'Consulting'

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Development',
  'Design',
  'Marketing',
  'Writing',
  'Photography & Video',
  'Consulting',
]

export interface Service {
  id: string
  providerId: string
  providerName: string
  title: string
  description: string
  category: ServiceCategory
  price: number
  pricingType: PricingType
  location: string
  availability: string
  tags: string[]
  imageUrl?: string
  createdAt: string
}

export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'

export interface Booking {
  id: string
  serviceId: string
  serviceName: string
  clientId: string
  clientName: string
  clientEmail: string
  providerId: string
  providerName: string
  date: string
  time: string
  notes?: string
  status: BookingStatus
  price: number
  pricingType: PricingType
  createdAt: string
}

export interface NewBookingData {
  serviceId: string
  date: string
  time: string
  notes?: string
}

export interface NewServiceData {
  title: string
  description: string
  category: ServiceCategory
  price: number
  pricingType: PricingType
  location: string
  availability: string
  tags: string[]
}
