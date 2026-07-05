import { useEffect, useId, useRef, type ReactNode } from 'react';

type DrawerProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/** Accessible right-side slide-over. Closes on backdrop click and Escape. */
export function Drawer({ title, onClose, children }: DrawerProps) {
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
    <div className="fixed inset-0 z-40">
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
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col animate-slide-in-right bg-white shadow-xl outline-none"
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
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
