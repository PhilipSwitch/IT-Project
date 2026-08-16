import type { Service } from '../types'
import { useApp } from '../context/AppContext'
import { formatNaira } from '../lib/utils'

const categoryBg: Record<string, string> = {
  Development: 'bg-slate-100',
  Design: 'bg-zinc-100',
  Marketing: 'bg-stone-100',
  Writing: 'bg-gray-100',
  'Photography & Video': 'bg-neutral-100',
  Consulting: 'bg-slate-50',
}

export default function ServiceCard({ service }: { service: Service }) {
  const { navigate } = useApp()

  return (
    <article
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors duration-200 cursor-pointer group"
      onClick={() => navigate('service-details', { serviceId: service.id })}
      tabIndex={0}
      role="link"
      aria-label={`${service.title} by ${service.providerName}`}
      onKeyDown={(e) => e.key === 'Enter' && navigate('service-details', { serviceId: service.id })}
    >
      {/* Thumbnail */}
      <div className={`h-36 overflow-hidden ${categoryBg[service.category] ?? 'bg-gray-100'}`}>
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category — plain text, not a coloured badge */}
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">
          {service.category}
        </p>

        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-brand transition-colors">
          {service.title}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
          {service.description}
        </p>

        <p className="text-xs text-gray-500 mb-3 truncate">
          {service.providerName}
          <span className="text-gray-300 mx-1">·</span>
          {service.location}
        </p>

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            {formatNaira(service.price)}
            <span className="text-xs font-normal text-gray-400 ml-1">
              {service.pricingType === 'HOURLY' ? '/hr' : 'fixed'}
            </span>
          </span>
          <span className="text-xs text-brand group-hover:underline">View →</span>
        </div>
      </div>
    </article>
  )
}
