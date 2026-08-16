export const formatNaira = (amount: number): string =>
  `₦${amount.toLocaleString('en-NG')}`

export const formatDate = (d: string): string =>
  new Date(d).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const formatDateLong = (d: string): string =>
  new Date(d).toLocaleDateString('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
