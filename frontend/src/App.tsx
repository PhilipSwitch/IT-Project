import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import ServiceDetails from './pages/ServiceDetails'
import CreateBooking from './pages/CreateBooking'
import ClientDashboard from './pages/client/Dashboard'
import ClientBookings from './pages/client/Bookings'
import ProviderDashboard from './pages/provider/Dashboard'
import ProviderServices from './pages/provider/Services'
import ProviderBookings from './pages/provider/Bookings'
import Profile from './pages/Profile'

const PROTECTED_PAGES = [
  'client-dashboard',
  'client-bookings',
  'create-booking',
  'provider-dashboard',
  'provider-services',
  'provider-bookings',
  'profile',
]

function Router() {
  const { page, user } = useApp()

  if (!user && PROTECTED_PAGES.includes(page)) {
    return <Login />
  }

  switch (page) {
    case 'landing':
      return <Landing />
    case 'login':
      return <Login />
    case 'register':
      return <Register />
    case 'browse':
      return <Browse />
    case 'service-details':
      return <ServiceDetails />
    case 'create-booking':
      return <CreateBooking />
    case 'client-dashboard':
      return <ClientDashboard />
    case 'client-bookings':
      return <ClientBookings />
    case 'provider-dashboard':
      return <ProviderDashboard />
    case 'provider-services':
      return <ProviderServices />
    case 'provider-bookings':
      return <ProviderBookings />
    case 'profile':
      return <Profile />
    default:
      return <Landing />
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#F7F8FC]">
        <Navbar />
        <main>
          <Router />
        </main>
      </div>
    </AppProvider>
  )
}
