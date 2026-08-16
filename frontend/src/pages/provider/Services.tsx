import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input, { Textarea, Select } from '../../components/ui/Input'
import { CategoryBadge } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { SERVICE_CATEGORIES } from '../../types'
import type {
  Service,
  ServiceCategory,
  PricingType,
} from '../../types'
import { formatNaira } from '../../lib/utils'

interface FormState {
  title: string
  description: string
  category: string
  price: string
  pricingType: string
  location: string
  availability: string
  tags: string
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  category: 'Development',
  price: '',
  pricingType: 'HOURLY',
  location: '',
  availability: '',
  tags: '',
}

type BackendService = {
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
}

const getFallbackImage = (title: string) => {
  const normalizedTitle = title.toLowerCase()

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

const deriveCategory = (title: string): ServiceCategory => {
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

const mapService = (service: BackendService): Service => ({
  id: String(service.id),
  providerId: String(service.providerId),
  providerName: `${service.provider.firstName} ${service.provider.lastName}`,
  title: service.title,
  description: service.description,
  category: deriveCategory(service.title),
  price: Number(service.price),
  pricingType:
    service.pricingType === 'HOURLY'
      ? 'HOURLY'
      : 'FIXED',
  location: service.provider.location ?? '',
  availability: service.availability ?? '',
  tags: [],
  imageUrl: getFallbackImage(service.title),
  createdAt: service.createdAt,
})

export default function ProviderServices() {
  const [providerServices, setProviderServices] = useState<Service[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({})

  const [saving, setSaving] = useState(false)

  const [confirmDelete, setConfirmDelete] =
    useState<Service | null>(null)

  const [deleting, setDeleting] = useState(false)

  const loadProviderServices = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get<{
        count: number
        services: BackendService[]
      }>('/api/services')

      const mappedServices = response.services
        .map(mapService)

      setProviderServices(mappedServices)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your services.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProviderServices()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (service: Service) => {
    setEditing(service)

    setForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: String(service.price),
      pricingType: service.pricingType,
      location: service.location,
      availability: service.availability,
      tags: service.tags.join(', '),
    })

    setErrors({})
    setError(null)
    setModalOpen(true)
  }

  const validate = () => {
    const nextErrors: typeof errors = {}

    if (!form.title.trim()) {
      nextErrors.title = 'Title is required'
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Description is required'
    }

    if (
      !form.price ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) <= 0
    ) {
      nextErrors.price = 'Enter a valid price'
    }

    if (!form.availability.trim()) {
      nextErrors.availability =
        'Availability is required'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        pricingType: form.pricingType as PricingType,
        availability: form.availability.trim(),
      }

      if (editing) {
        await api.patch(
          `/api/services/${editing.id}`,
          payload,
        )
      } else {
        await api.post('/api/services', payload)
      }

      await loadProviderServices()

      setSaving(false)
      setModalOpen(false)
      setEditing(null)
    } catch (err) {
      setSaving(false)

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save this service.',
      )
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      return
    }

    setDeleting(true)
    setError(null)

    try {
      await api.delete(
        `/api/services/${confirmDelete.id}`,
      )

      setProviderServices((prev) =>
        prev.filter(
          (service) =>
            service.id !== confirmDelete.id,
        ),
      )

      setDeleting(false)
      setConfirmDelete(null)
    } catch (err) {
      setDeleting(false)

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete this service.',
      )
    }
  }

  const set =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement |
          HTMLTextAreaElement |
          HTMLSelectElement
      >,
    ) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }))

      setErrors((previous) => ({
        ...previous,
        [field]: undefined,
      }))
    }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            My Services
          </h1>

          <p className="text-xs text-gray-500 mt-0.5">
            {providerServices.length} listing
            {providerServices.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={openCreate}
        >
          + New service
        </Button>
      </div>

      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {providerServices.length === 0 ? (
        <EmptyState
          title="No services listed yet"
          description="Create your first service listing to start receiving bookings."
          action={{
            label: 'Create your first service',
            onClick: openCreate,
          }}
        />
      ) : (
        <div className="space-y-3">
          {providerServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                {service.imageUrl && (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-14 h-14 rounded object-cover shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-1.5">
                        <CategoryBadge
                          category={service.category}
                        />
                      </div>

                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {service.title}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-base font-bold text-gray-900">
                        {formatNaira(service.price)}
                      </p>

                      <p className="text-xs text-gray-400">
                        {service.pricingType ===
                        'HOURLY'
                          ? '/hr'
                          : 'fixed'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-500">
                    {service.location && (
                      <>
                        <span>{service.location}</span>
                        <span className="text-gray-300">
                          ·
                        </span>
                      </>
                    )}

                    <span>
                      {service.availability}
                    </span>
                  </div>

                  {service.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mt-2.5">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(service)}
                >
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() =>
                    setConfirmDelete(service)
                  }
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editing
            ? 'Edit service'
            : 'Create service listing'
        }
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Service title"
            placeholder="e.g. Full-Stack Web Application Development"
            value={form.title}
            onChange={set('title')}
            error={errors.title}
          />

          <Textarea
            label="Description"
            placeholder="Describe what you offer, your process, and what clients can expect…"
            value={form.description}
            onChange={set('description')}
            error={errors.description}
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.category}
              onChange={set('category')}
            >
              {SERVICE_CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </Select>

            <Select
              label="Pricing type"
              value={form.pricingType}
              onChange={set('pricingType')}
            >
              <option value="HOURLY">
                Hourly rate
              </option>

              <option value="FIXED">
                Fixed price
              </option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={
                form.pricingType === 'HOURLY'
                  ? 'Rate (₦ per hour)'
                  : 'Fixed price (₦)'
              }
              type="number"
              min="1"
              placeholder="e.g. 35000"
              value={form.price}
              onChange={set('price')}
              error={errors.price}
            />

            <Input
              label="Location"
              placeholder="e.g. Lagos, Remote"
              value={form.location}
              onChange={set('location')}
              disabled
              helperText="Uses the provider account location."
            />
          </div>

          <Input
            label="Availability"
            placeholder="e.g. Mon–Fri, 9am–6pm WAT"
            value={form.availability}
            onChange={set('availability')}
            error={errors.availability}
          />

          <Input
            label="Skills / tags"
            placeholder="React, Node.js, TypeScript"
            value={form.tags}
            onChange={set('tags')}
            disabled
            helperText="Tags are not stored by the current backend yet."
          />

          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              size="md"
              loading={saving}
              onClick={handleSave}
            >
              {saving
                ? 'Saving…'
                : editing
                  ? 'Save changes'
                  : 'Create listing'}
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete service"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete{' '}
          <strong>{confirmDelete?.title}</strong>? This
          cannot be undone.
        </p>

        <div className="flex gap-2">
          <Button
            variant="danger"
            size="md"
            loading={deleting}
            onClick={handleDelete}
          >
            Delete
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => setConfirmDelete(null)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}