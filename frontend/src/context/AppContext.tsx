import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  User,
  Service,
  ServiceCategory,
} from '../types'

import { api } from '../lib/api'

export type PageName =
  | 'landing'
  | 'login'
  | 'register'
  | 'browse'
  | 'service-details'
  | 'create-booking'
  | 'client-dashboard'
  | 'client-bookings'
  | 'provider-dashboard'
  | 'provider-services'
  | 'provider-bookings'
  | 'profile'

interface AppContextType {
  user: User | null

  page: PageName
  pageParams: Record<string, string>

  navigate: (
    page: PageName,
    params?: Record<string, string>,
  ) => void

  services: Service[]
  providerServices: Service[]

  authError: string | null
  authLoading: boolean

  setAuthError: (error: string | null) => void

  login: (
    email: string,
    password: string,
  ) => Promise<void>

  logout: () => void

  register: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: 'CLIENT' | 'PROVIDER'
  }) => Promise<void>
}

const AppContext =
  createContext<AppContextType | null>(null)

const USER_STORAGE_KEY = 'skilllink_user'
const TOKEN_STORAGE_KEY = 'skilllink_token'
const PAGE_STORAGE_KEY = 'skilllink_page'
const PAGE_PARAMS_STORAGE_KEY =
  'skilllink_page_params'

const VALID_PAGES: PageName[] = [
  'landing',
  'login',
  'register',
  'browse',
  'service-details',
  'create-booking',
  'client-dashboard',
  'client-bookings',
  'provider-dashboard',
  'provider-services',
  'provider-bookings',
  'profile',
]

function getStoredUser(): User | null {
  try {
    const storedUser =
      localStorage.getItem(USER_STORAGE_KEY)

    if (!storedUser) {
      return null
    }

    return JSON.parse(storedUser) as User
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

function getStoredPage(): PageName {
  const storedPage =
    localStorage.getItem(PAGE_STORAGE_KEY)

  if (
    storedPage &&
    VALID_PAGES.includes(storedPage as PageName)
  ) {
    return storedPage as PageName
  }

  return 'landing'
}

function getStoredPageParams(): Record<
  string,
  string
> {
  try {
    const storedParams =
      localStorage.getItem(
        PAGE_PARAMS_STORAGE_KEY,
      )

    if (!storedParams) {
      return {}
    }

    return JSON.parse(storedParams) as Record<
      string,
      string
    >
  } catch {
    localStorage.removeItem(
      PAGE_PARAMS_STORAGE_KEY,
    )

    return {}
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')

    if (parts.length !== 3) {
      return true
    }

    const payload = JSON.parse(
      atob(
        parts[1]
          .replace(/-/g, '+')
          .replace(/_/g, '/'),
      ),
    )

    if (!payload.exp) {
      return false
    }

    return (
      Date.now() >= payload.exp * 1000
    )
  } catch {
    return true
  }
}

function clearStoredSession() {
  localStorage.removeItem(USER_STORAGE_KEY)
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(PAGE_STORAGE_KEY)
  localStorage.removeItem(
    PAGE_PARAMS_STORAGE_KEY,
  )
}

function deriveCategory(
  title: string,
): ServiceCategory {
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

function getFallbackImage(title: string) {
  const normalizedTitle =
    title.toLowerCase()

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

export function AppProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] =
    useState<User | null>(() => {
      const token =
        localStorage.getItem(
          TOKEN_STORAGE_KEY,
        )

      const storedUser =
        getStoredUser()

      if (!token || !storedUser) {
        return null
      }

      if (isTokenExpired(token)) {
        clearStoredSession()
        return null
      }

      return storedUser
    })

  const [page, setPage] =
    useState<PageName>(
      getStoredPage(),
    )

  const [pageParams, setPageParams] =
    useState<Record<string, string>>(
      getStoredPageParams(),
    )

  const [services, setServices] =
    useState<Service[]>([])

  const [authError, setAuthError] =
    useState<string | null>(null)

  const [authLoading, setAuthLoading] =
    useState(false)

  const providerServices =
    services.filter(
      (service) =>
        service.providerId === user?.id,
    )

  const navigate = (
    newPage: PageName,
    params: Record<string, string> = {},
  ) => {
    setPage(newPage)
    setPageParams(params)

    localStorage.setItem(
      PAGE_STORAGE_KEY,
      newPage,
    )

    localStorage.setItem(
      PAGE_PARAMS_STORAGE_KEY,
      JSON.stringify(params),
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // =========================
  // RESTORE INVALID SESSION
  // =========================

  useEffect(() => {
    const handleUnauthorized = () => {
      clearStoredSession()

      setUser(null)
      setPage('login')
      setPageParams({})
      setAuthError(
        'Your session has expired. Please log in again.',
      )
    }

    window.addEventListener(
      'skilllink:unauthorized',
      handleUnauthorized,
    )

    return () => {
      window.removeEventListener(
        'skilllink:unauthorized',
        handleUnauthorized,
      )
    }
  }, [])

  // =========================
  // LOAD REAL SERVICES
  // =========================

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await api.get<{
          count: number
          services: Array<{
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
          }>
        }>('/api/services')

        const mappedServices: Service[] =
          response.services.map(
            (service) => ({
              id: String(service.id),
              providerId: String(
                service.providerId,
              ),
              providerName: `${service.provider.firstName} ${service.provider.lastName}`,
              title: service.title,
              description:
                service.description,
              category:
                deriveCategory(
                  service.title,
                ),
              price: Number(
                service.price,
              ),
              pricingType:
                service.pricingType ===
                'HOURLY'
                  ? 'HOURLY'
                  : 'FIXED',
              location:
                service.provider
                  .location ?? '',
              availability:
                service.availability ??
                '',
              tags: [],
              imageUrl:
                getFallbackImage(
                  service.title,
                ),
              createdAt:
                service.createdAt,
            }),
          )

        setServices(mappedServices)
      } catch (error) {
        console.error(
          'Failed to load services:',
          error,
        )
      }
    }

    loadServices()
  }, [])

  // =========================
  // LOGIN
  // =========================

  const login = async (
    email: string,
    password: string,
  ) => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const response =
        await api.post<{
          message: string
          token: string
          user: {
            id: number
            firstName: string
            lastName: string
            email: string
            role:
              | 'CLIENT'
              | 'PROVIDER'
              | 'ADMIN'
            phoneNumber?: string
            bio?: string
            location?: string
          }
        }>('/api/auth/login', {
          email,
          password,
        })

      if (
        response.user.role ===
        'ADMIN'
      ) {
        throw new Error(
          'Admin accounts are not supported in the current frontend.',
        )
      }

      const loggedInUser: User = {
        id: String(
          response.user.id,
        ),
        firstName:
          response.user.firstName,
        lastName:
          response.user.lastName,
        email: response.user.email,
        role: response.user.role,
        location:
          response.user.location,
        bio: response.user.bio,
        joinedAt:
          new Date().toISOString(),
      }

      localStorage.setItem(
        TOKEN_STORAGE_KEY,
        response.token,
      )

      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(
          loggedInUser,
        ),
      )

      setUser(loggedInUser)

      navigate(
        loggedInUser.role ===
          'CLIENT'
          ? 'client-dashboard'
          : 'provider-dashboard',
      )
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : 'Unable to login. Please try again.',
      )
    } finally {
      setAuthLoading(false)
    }
  }

  // =========================
  // REGISTER
  // =========================

  const register = async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: 'CLIENT' | 'PROVIDER'
  }) => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const response =
        await api.post<{
          message: string
          token: string
          user: {
            id: number
            firstName: string
            lastName: string
            email: string
            role:
              | 'CLIENT'
              | 'PROVIDER'
              | 'ADMIN'
            phoneNumber?: string
            bio?: string
            location?: string
          }
        }>('/api/auth/register', data)

      if (
        response.user.role ===
        'ADMIN'
      ) {
        throw new Error(
          'Admin accounts are not supported in the current frontend.',
        )
      }

      const newUser: User = {
        id: String(
          response.user.id,
        ),
        firstName:
          response.user.firstName,
        lastName:
          response.user.lastName,
        email: response.user.email,
        role: response.user.role,
        location:
          response.user.location,
        bio: response.user.bio,
        joinedAt:
          new Date().toISOString(),
      }

      localStorage.setItem(
        TOKEN_STORAGE_KEY,
        response.token,
      )

      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(newUser),
      )

      setUser(newUser)

      navigate(
        newUser.role === 'CLIENT'
          ? 'client-dashboard'
          : 'provider-dashboard',
      )
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : 'Unable to register. Please try again.',
      )
    } finally {
      setAuthLoading(false)
    }
  }

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    clearStoredSession()

    setUser(null)
    setPage('landing')
    setPageParams({})
    setAuthError(null)
  }

  return (
    <AppContext.Provider
      value={{
        user,
        page,
        pageParams,
        navigate,

        services,
        providerServices,

        authError,
        authLoading,
        setAuthError,

        login,
        logout,
        register,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)

  if (!ctx) {
    throw new Error(
      'useApp must be used within AppProvider',
    )
  }

  return ctx
}