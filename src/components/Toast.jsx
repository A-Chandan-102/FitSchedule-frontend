import React, { useEffect } from 'react';

export default function Toast({ toasts, onDismiss }) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let toastClass = 'toast-info';
        if (toast.type === 'success') toastClass = 'toast-success';
        if (toast.type === 'error') toastClass = 'toast-error';

        return (
          <div key={toast.id} className={`toast ${toastClass}`}>
            <span style={{ flex: 1, fontWeight: 500 }}>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
}
