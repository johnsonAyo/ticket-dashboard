import { useEffect, useId, useRef, type ReactNode } from 'react';

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/** Accessible modal dialog centered on screen. Closes on backdrop click and Escape. */
export function Modal({ title, onClose, children }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-slate-900/40"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex w-full max-w-2xl flex-col animate-fade-in rounded-xl bg-white shadow-xl outline-none"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6 max-h-[85vh]">{children}</div>
      </div>
    </div>
  );
}
