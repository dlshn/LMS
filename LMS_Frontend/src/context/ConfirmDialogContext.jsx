import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ConfirmDialogContext = createContext(null);

const DEFAULTS = {
  title: 'Are you sure?',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  danger: false,
};

// Drop-in replacement for window.confirm() that matches the app's own
// design instead of the browser's unstyled, origin-labelled native dialog.
// `confirm(options)` returns a Promise<boolean>, same call shape as the
// native one, so call sites just add `await`.
export function ConfirmDialogProvider({ children }) {
  const [state, setState] = useState(null);
  const resolveRef = useRef(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({ ...DEFAULTS, ...(typeof options === 'string' ? { message: options } : options) });
    });
  }, []);

  function settle(result) {
    setState(null);
    resolveRef.current?.(result);
    resolveRef.current = null;
  }

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="confirm-overlay" role="presentation" onClick={() => settle(false)}>
          <div
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="confirm-dialog-title">{state.title}</h3>
            {state.message && <p className="muted text-sm">{state.message}</p>}
            <div className="confirm-dialog-actions">
              <button type="button" className="btn btn-ghost" onClick={() => settle(false)}>
                {state.cancelLabel}
              </button>
              <button
                type="button"
                className={`btn ${state.danger ? 'btn-danger-solid' : 'btn-primary'}`}
                onClick={() => settle(true)}
                autoFocus
              >
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirm() {
  const confirm = useContext(ConfirmDialogContext);
  if (!confirm) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider');
  }
  return confirm;
}
