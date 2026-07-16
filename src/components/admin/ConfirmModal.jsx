import { useEffect, useRef } from 'react';

export default function ConfirmModal({
  open,
  title,
  body,
  confirmLabel = 'Tasdiqlash',
  cancelLabel = 'Ortga',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    cancelBtnRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div
        className="admin-modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? 'confirm-modal-title' : undefined}
        aria-describedby="confirm-modal-body"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 id="confirm-modal-title" className="admin-modal-title">
            {title}
          </h2>
        )}
        <p id="confirm-modal-body" className="admin-modal-text">
          {body}
        </p>
        <div className="admin-modal-actions">
          <button
            type="button"
            ref={cancelBtnRef}
            className="admin-modal-btn admin-modal-btn-secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`admin-modal-btn ${destructive ? 'admin-modal-btn-danger' : 'admin-modal-btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
