import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons'

const ACCENTS = ['bg-berry', 'bg-pine', 'bg-terracotta', 'bg-mist', 'bg-gold', 'bg-plum']

/**
 * Selector accesible con panel propio: botón tipo combobox, lista de opciones
 * con teclado (flechas, Inicio/Fin, Enter, Escape) y cierre al hacer clic fuera.
 */
export default function CustomSelect({
  id,
  value,
  onChange,
  options = [],
  labelledBy,
  name,
  placeholder = 'Selecciona una opción',
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)

  const selectedIndex = Math.max(0, options.indexOf(value))

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const openMenu = () => {
    setActive(selectedIndex)
    setOpen(true)
  }

  const choose = (option) => {
    onChange(option)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        openMenu()
        return
      }
      setActive((current) => {
        const next = event.key === 'ArrowDown' ? current + 1 : current - 1
        return (next + options.length) % options.length
      })
      return
    }

    if (event.key === 'Home' && open) {
      event.preventDefault()
      setActive(0)
      return
    }

    if (event.key === 'End' && open) {
      event.preventDefault()
      setActive(options.length - 1)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      if (open) {
        event.preventDefault()
        choose(options[active])
      }
      return
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
      return
    }

    if (event.key === 'Tab') setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      {name && <input type="hidden" name={name} value={value} />}

      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-labelledby={labelledBy}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className={`form-input flex items-center justify-between gap-3 text-left ${
          open ? 'is-open' : ''
        }`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              ACCENTS[selectedIndex % ACCENTS.length]
            }`}
          />
          <span className="truncate">{value || placeholder}</span>
        </span>
        <Icon
          name="chevron-down"
          size={14}
          className={`shrink-0 text-berry transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          aria-labelledby={labelledBy}
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-ink/12 bg-bone py-1 shadow-[0_26px_60px_-24px_rgba(22,32,28,0.55)]"
        >
          {options.map((option, index) => {
            const isSelected = option === value
            const isActive = index === active

            return (
              <li
                key={option}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-ink/[0.055]' : ''
                } ${isSelected ? 'font-medium text-ink' : 'text-ink/70'}`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      ACCENTS[index % ACCENTS.length]
                    }`}
                  />
                  {option}
                </span>
                {isSelected && <Icon name="check" size={14} className="text-berry" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
