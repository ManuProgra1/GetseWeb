import { useState } from 'react'
import { isFirebaseConfigured } from '../../lib/firebase'
import { sendContactMessage } from '../../services/content'
import { useToast } from '../../context/toast-context'
import { isEmail } from '../../utils/misc'
import { Icon } from '../common/icons'
import CustomSelect from '../common/custom-select'

const SUBJECTS = [
  'Información general',
  'Visitar la iglesia',
  'Quiero servir en un ministerio',
  'Petición de oración',
  'Eventos y actividades',
  'Otro',
]

const INITIAL = {
  nombre: '',
  email: '',
  telefono: '',
  asunto: SUBJECTS[0],
  mensaje: '',
}

const MAX_MESSAGE = 600

function Field({ id, label, required, error, hint, children }) {
  return (
    <div className="min-w-0">
      <label id={`${id}-label`} htmlFor={id} className="form-label">
        {label}
        {required ? (
          <span className="text-terracotta" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="ml-2 font-sans text-[0.62rem] font-normal normal-case tracking-normal text-ink/35">
            {' '}Opcional
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="form-error">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[0.7rem] leading-relaxed text-ink/40">{hint}</p>
      )}
    </div>
  )
}

export default function ContactForm() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const { notify } = useToast()
  const configured = isFirebaseConfigured

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (values.nombre.trim().length < 2) next.nombre = 'Escribe tu nombre.'
    if (!isEmail(values.email)) next.email = 'Ingresa un correo válido.'
    if (values.mensaje.trim().length < 10) {
      next.mensaje = 'Cuéntanos un poco más (mínimo 10 caracteres).'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return
    if (!validate()) return

    if (!configured) {
      notify(
        'El envío de mensajes aún no está conectado. Un administrador debe configurar Firebase.',
        'error',
      )
      return
    }

    setStatus('sending')
    try {
      await sendContactMessage(values)
      setValues(INITIAL)
      setErrors({})
      setStatus('sent')
      notify('Mensaje enviado. Gracias por escribirnos; te responderemos pronto.')
    } catch (error) {
      console.error('[contacto]', error)
      setStatus('error')
      notify(
        'No pudimos enviar tu mensaje en este momento. Intenta de nuevo o escríbenos por nuestras redes.',
        'error',
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative overflow-hidden border border-ink/12 bg-[#fdfaf0] shadow-[0_40px_80px_-60px_rgba(22,32,28,0.55)]"
    >
      <div className="p-6 sm:p-9">
        <header className="flex flex-col gap-4 border-b border-ink/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-berry">Formulario de contacto</p>
            <h2 className="display mt-3 text-[clamp(1.8rem,3vw,2.4rem)] text-ink">
              Cuéntanos cómo podemos servirte
            </h2>
          </div>
          <p className="max-w-[22ch] text-[0.72rem] leading-relaxed text-ink/45 sm:text-right">
            Respondemos personalmente cada mensaje que llega a la iglesia.
          </p>
        </header>

        {!configured && (
          <p className="mt-6 flex gap-3 border-l-2 border-mist bg-mist/15 px-4 py-3 text-xs leading-relaxed text-ink/65">
            <Icon name="lock" size={15} className="mt-0.5 shrink-0 text-[#4c7480]" />
            El formulario está listo. El envío se habilitará cuando la iglesia conecte su
            proyecto de Firebase.
          </p>
        )}

        {status === 'sent' && (
          <p
            role="status"
            className="mt-6 flex items-center gap-3 border-l-2 border-pine bg-pine/10 px-4 py-3 text-sm text-ink/75"
          >
            <Icon name="check" size={16} className="shrink-0 text-pine" />
            Gracias. Tu mensaje fue recibido por la iglesia.
          </p>
        )}

        <div className="mt-7 grid gap-x-5 gap-y-6 sm:grid-cols-2">
          <Field
            id="nombre"
            label="Nombre"
            required
            error={errors.nombre}
          >
            <input
              id="nombre"
              name="nombre"
              className="form-input"
              placeholder="Tu nombre completo"
              value={values.nombre}
              onChange={update('nombre')}
              autoComplete="name"
              aria-invalid={Boolean(errors.nombre)}
              aria-describedby={errors.nombre ? 'nombre-error' : undefined}
            />
          </Field>

          <Field
            id="email"
            label="Correo electrónico"
            required
            error={errors.email}
          >
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="tu@correo.com"
              value={values.email}
              onChange={update('email')}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </Field>

          <Field
            id="telefono"
            label="Teléfono"
            hint="Si prefieres que te llamemos."
          >
            <input
              id="telefono"
              name="telefono"
              type="tel"
              className="form-input"
              placeholder="+502 0000 0000"
              value={values.telefono}
              onChange={update('telefono')}
              autoComplete="tel"
            />
          </Field>

          <Field id="asunto" label="Asunto" hint="Así dirigimos tu mensaje al área correcta.">
            <CustomSelect
              id="asunto"
              name="asunto"
              labelledBy="asunto-label"
              value={values.asunto}
              options={SUBJECTS}
              onChange={(subject) =>
                setValues((current) => ({ ...current, asunto: subject }))
              }
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field
            id="mensaje"
            label="Mensaje"
            required
            error={errors.mensaje}
          >
            <textarea
              id="mensaje"
              name="mensaje"
              className="form-input min-h-36 resize-y"
              placeholder="Cuéntanos cómo podemos acompañarte…"
              value={values.mensaje}
              onChange={update('mensaje')}
              rows={5}
              maxLength={MAX_MESSAGE}
              aria-invalid={Boolean(errors.mensaje)}
              aria-describedby={errors.mensaje ? 'mensaje-error' : undefined}
            />
          </Field>
          <p className="mt-1.5 text-right font-mono text-[0.58rem] tracking-[0.14em] text-ink/35">
            {values.mensaje.length}/{MAX_MESSAGE}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex max-w-xs items-start gap-2 text-[0.7rem] leading-relaxed text-ink/45">
            <Icon name="lock" size={13} className="mt-0.5 shrink-0" />
            Tus datos se usan únicamente para responder tu mensaje.
          </p>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-berry px-7 py-3.5 text-[0.68rem] font-medium tracking-[0.18em] text-bone uppercase transition hover:bg-plum disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
            <Icon
              name="arrow-right"
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </form>
  )
}
