import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  rememberKey?: string;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

const REMEMBER_PREFIX = 'ticket-dashboard:skip-confirm:';

function isRemembered(key?: string): boolean {
  if (!key) return false;
  try {
    return localStorage.getItem(REMEMBER_PREFIX + key) === 'true';
  } catch {
    return false;
  }
}

function remember(key: string): void {
  try {
    localStorage.setItem(REMEMBER_PREFIX + key, 'true');
  } catch {}
}

type PendingConfirm = {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    if (isRemembered(options.rememberKey)) {
      return Promise.resolve(true);
    }
    return new Promise<boolean>((resolve) => {
      setPending({ options, resolve });
    });
  }, []);

  const resolvePending = useCallback((confirmed: boolean, dontAskAgain: boolean) => {
    setPending((current) => {
      if (!current) return null;
      if (confirmed && dontAskAgain && current.options.rememberKey) {
        remember(current.options.rememberKey);
      }
      current.resolve(confirmed);
      return null;
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending ? <ConfirmDialog options={pending.options} onResolve={resolvePending} /> : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error('useConfirm must be used within a ConfirmProvider.');
  }
  return confirm;
}

type ConfirmDialogProps = {
  options: ConfirmOptions;
  onResolve: (confirmed: boolean, dontAskAgain: boolean) => void;
};

function ConfirmDialog({ options, onResolve }: ConfirmDialogProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const isDanger = options.tone !== 'default';

  const cancel = useCallback(() => onResolve(false, false), [onResolve]);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') cancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [cancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-slate-900/40"
        aria-hidden="true"
        onClick={cancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="relative w-full max-w-sm animate-fade-in rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="confirm-dialog-title" className="text-base font-semibold text-slate-900">
          {options.title}
        </h2>
        <p id="confirm-dialog-message" className="mt-2 text-sm text-slate-600">
          {options.message}
        </p>

        {options.rememberKey ? (
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={dontAskAgain}
              onChange={(event) => setDontAskAgain(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            Don&apos;t ask me again
          </label>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={cancel}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            {options.cancelLabel ?? 'Cancel'}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => onResolve(true, dontAskAgain)}
            className={
              isDanger
                ? 'rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700'
                : 'rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700'
            }
          >
            {options.confirmLabel ?? 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
