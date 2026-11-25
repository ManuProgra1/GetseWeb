import { Link } from 'react-router-dom'
import { missingConfigKeys } from '../../lib/firebase'
import { Icon } from '../../components/common/icons'

export default function SetupNotice({ compact = false }) {
  return (
    <div className={compact ? '' : 'grid min-h-screen place-items-center bg-[#f4efdf] p-6 text-[#25342e]'}>
      <div className="w-full max-w-2xl border border-[#25342e]/10 bg-white p-7 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#25342e]/5 text-[#547972]">
            <Icon name="lock" size={20} />
          </span>
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#5f6d66]">
              Panel administrativo
            </p>
            <h1 className="font-display text-2xl text-[#25342e]">Firebase aún no está configurado</h1>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-[#44544d]">
          La conexión con Firebase está completamente implementada, pero falta vincular el
          proyecto de la iglesia. Crea un archivo <code className="rounded bg-[#25342e]/5 px-1.5 py-0.5">.env</code>{' '}
          en la raíz del sitio con estas variables:
        </p>

        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {[
            'VITE_FIREBASE_API_KEY',
            'VITE_FIREBASE_AUTH_DOMAIN',
            'VITE_FIREBASE_PROJECT_ID',
            'VITE_FIREBASE_STORAGE_BUCKET',
            'VITE_FIREBASE_MESSAGING_SENDER_ID',
            'VITE_FIREBASE_APP_ID',
          ].map((key) => {
            const missing = missingConfigKeys.includes(key)
            return (
              <li
                key={key}
                className={`flex items-center justify-between gap-2 rounded border px-3 py-2 font-mono text-[0.65rem] ${
                  missing ? 'border-[#9b4a32]/30 text-[#9b4a32]' : 'border-[#25342e]/10 text-[#5f6d66]'
                }`}
              >
                {key}
                <span className="text-[0.55rem] uppercase tracking-wider">
                  {missing ? 'Falta' : 'Lista'}
                </span>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 space-y-3 text-sm leading-relaxed text-[#44544d]">
          <p>
            <strong className="text-[#25342e]">1.</strong> Copia los valores desde Firebase →
            Configuración del proyecto → Tus apps.
          </p>
          <p>
            <strong className="text-[#25342e]">2.</strong> Habilita Authentication (correo y
            contraseña), Firestore y Storage.
          </p>
          <p>
            <strong className="text-[#25342e]">3.</strong> Publica las reglas de{' '}
            <code className="rounded bg-[#25342e]/5 px-1.5 py-0.5">firebase/</code> y crea el
            documento <code className="rounded bg-[#25342e]/5 px-1.5 py-0.5">users/&#123;uid&#125;</code>{' '}
            del primer administrador con <code className="rounded bg-[#25342e]/5 px-1.5 py-0.5">rol: &quot;administrador&quot;</code>.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-[#25342e]/10 pt-6">
          <Link
            to="/"
            className="rounded-full bg-[#25342e] px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[#f4efdf]"
          >
            Volver al sitio
          </Link>
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-[#25342e]/20 px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[#25342e]"
          >
            Consola de Firebase <Icon name="external" size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}
