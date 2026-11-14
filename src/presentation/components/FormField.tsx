import { memo, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../lib/cn'

const fieldClasses = cn(
  'w-full rounded-xl border bg-white/[0.03] px-3.5 text-[0.9375rem] text-white placeholder:text-slate-500',
  'transition-[border-color,background-color,box-shadow] duration-200',
  'hover:border-white/20 focus:bg-white/[0.05] focus:outline-none focus:ring-4',
  // Durante o envio os campos ficam readOnly (mantêm o foco, ao contrário de disabled).
  'read-only:opacity-70 disabled:cursor-not-allowed disabled:opacity-60',
)

interface BaseProps {
  label: string
  name: string
  error?: string
  /** Texto auxiliar exibido por baixo do campo quando não há erro. */
  hint?: string
}

type InputFieldProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false }
type TextareaFieldProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true }

/** Campo de formulário acessível com etiqueta e mensagem de erro ligadas via ARIA. */
export const FormField = memo(function FormField(props: InputFieldProps | TextareaFieldProps) {
  const { label, name, error, hint, className, multiline, ...rest } = props
  const id = `field-${name}`
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const classes = cn(
    fieldClasses,
    error
      ? 'border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/10'
      : 'border-white/10 focus:border-cyan-400/60 focus:ring-cyan-400/10',
    className,
  )
  const describedBy = error ? errorId : hint ? hintId : undefined
  const aria = { 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          className={cn(classes, 'resize-none py-3 leading-relaxed')}
          {...aria}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input id={id} name={name} className={cn(classes, 'h-11')} {...aria} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-[0.8125rem] text-rose-300">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-[0.8125rem] text-slate-400">
            {hint}
          </p>
        )
      )}
    </div>
  )
})
