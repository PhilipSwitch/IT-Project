import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

const baseField = [
  'w-full px-3 py-2 text-sm text-gray-900 bg-white border rounded-md',
  'placeholder:text-gray-400',
  'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-0 focus:border-transparent',
  'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
  'transition-colors duration-150',
].join(' ')

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export default function Input({ label, error, helperText, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={[
          baseField,
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
          className,
        ].filter(Boolean).join(' ')}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({ label, error, helperText, className = '', id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        {...props}
        className={[
          baseField,
          'resize-y min-h-[80px]',
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
          className,
        ].filter(Boolean).join(' ')}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: ReactNode
}

export function Select({ label, error, children, className = '', id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={inputId}
        {...props}
        className={[
          baseField,
          'appearance-none',
          error ? 'border-red-400' : 'border-gray-300',
          className,
        ].filter(Boolean).join(' ')}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
