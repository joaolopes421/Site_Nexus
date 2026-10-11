import { memo, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

const fieldClasses =
  'w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-white placeholder:text-nexus-muted/60 transition-colors focus:bg-white/[0.05] focus:outline-none'

interface BaseProps {
  label: string
  name: string
  error?: string
}

type InputFieldProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false }
type TextareaFieldProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true }

/** Campo de formulário acessível com etiqueta e mensagem de erro ligadas via ARIA. */
export const FormField = memo(function FormField(props: InputFieldProps | TextareaFieldProps) {
  const { label, name, error, className, multiline, ...rest } = props
  const id = `field-${name}`
  const errorId = `${id}-error`
  const classes = cn(
    fieldClasses,
    error ? 'border-red-400/70 focus:border-red-400' : 'border-white/10 focus:border-nexus-cyan/70',
    className,
  )
  const aria = { 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? errorId : undefined }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-white/90">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          className={cn(classes, 'resize-none')}
          {...aria}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input id={id} name={name} className={classes} {...aria} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error && (
        <p id={errorId} className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
})
