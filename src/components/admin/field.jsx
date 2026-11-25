export function Field({ label, htmlFor, hint, error, required, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="admin-label">
          {label} {required && <span className="text-[#9b4a32]">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1.5 text-[0.72rem] text-[#7d8a82]">{hint}</p>}
      {error && <p className="mt-1.5 text-[0.72rem] text-[#9b4a32]">{error}</p>}
    </div>
  )
}

export function TextInput({ className = '', ...rest }) {
  return <input className={`admin-input ${className}`} {...rest} />
}

export function TextArea({ className = '', rows = 4, ...rest }) {
  return <textarea rows={rows} className={`admin-input ${className}`} {...rest} />
}

export function Select({ children, className = '', ...rest }) {
  return (
    <select className={`admin-input ${className}`} {...rest}>
      {children}
    </select>
  )
}
