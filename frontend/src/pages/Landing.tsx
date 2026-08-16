import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ServiceCard from '../components/ServiceCard'
import Button from '../components/ui/Button'
import type { ServiceCategory } from '../types'

const CATEGORIES: (ServiceCategory | 'All')[] = [
  'All',
  'Development',
  'Design',
  'Marketing',
  'Writing',
  'Photography & Video',
  'Consulting',
]

export default function Landing() {
  const { navigate, services } = useApp()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All')

  const featured = services
    .filter((s) => {
      const matchesSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory
      return matchesSearch && matchesCategory
    })
    .slice(0, 8)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('browse')
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-2xl">
            <h1
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Connect with skilled professionals across Nigeria
            </h1>
            <p className="text-base text-gray-500 mb-8 leading-relaxed">
              SkillLink helps businesses and individuals find and hire verified freelancers — from software development and design to content, photography, and more.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 max-w-lg mb-6"
            >
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full pl-9 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-gray-400"
                />
              </div>
              <Button type="submit" size="md" variant="primary">
                Search
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('browse')}
                className="text-sm text-brand font-medium hover:underline"
              >
                Browse all services
              </button>
              <span className="text-gray-300">·</span>
              <button
                onClick={() => navigate('register')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Offer your skills
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="bg-white border-b border-gray-100 sticky top-[52px] z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={[
                  'px-3.5 py-1.5 text-sm font-medium whitespace-nowrap rounded transition-colors',
                  activeCategory === cat
                    ? 'bg-brand text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {activeCategory === 'All' ? 'Available services' : activeCategory}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{featured.length} listings</p>
          </div>
          <button
            onClick={() => navigate('browse')}
            className="text-sm text-brand hover:underline"
          >
            View all
          </button>
        </div>

        {featured.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">
              No services match your search.{' '}
              <button className="text-brand hover:underline" onClick={() => setSearch('')}>
                Clear search
              </button>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featured.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">How it works</h2>
            <p className="text-sm text-gray-500">Three steps to get your project done.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                n: '1',
                title: 'Find a provider',
                desc: 'Browse verified professionals across development, design, marketing, and more. Filter by category, price, or location.',
              },
              {
                n: '2',
                title: 'Submit a booking',
                desc: 'Choose a date and time, add your project notes, and send your booking request. No payment required upfront.',
              },
              {
                n: '3',
                title: 'Get it done',
                desc: 'Your provider reviews and accepts the request. Once complete, the booking is marked as finished.',
              },
            ].map((item) => (
              <div key={item.n}>
                <span className="text-sm font-bold text-brand mb-3 block">{item.n}</span>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Ready to get started?</h2>
              <p className="text-sm text-gray-500">
                Join thousands of clients and professionals using SkillLink across Nigeria.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="primary" size="md" onClick={() => navigate('register')}>
                Create an account
              </Button>
              <Button variant="outline" size="md" onClick={() => navigate('browse')}>
                Browse services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">SkillLink</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 SkillLink Technologies Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
