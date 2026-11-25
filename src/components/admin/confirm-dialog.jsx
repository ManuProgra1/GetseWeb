import Modal from './modal'
import { AdminButton } from './admin-page'

export default function ConfirmDialog({
  open,
  title = '¿Eliminar este elemento?',
  description = 'Esta acción no se puede deshacer.',
  confirmLabel = 'Sí, eliminar',
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <AdminButton variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </AdminButton>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-[#9b4a32] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-[#833c28] disabled:opacity-50"
          >
            {loading ? 'Eliminando…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-[#44544d]">
        {description} Si el contenido está publicado, dejará de verse en el sitio inmediatamente.
      </p>
    </Modal>
  )
}
