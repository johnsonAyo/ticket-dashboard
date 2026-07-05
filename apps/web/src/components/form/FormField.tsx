import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  isFilled?: boolean;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, isFilled, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
      >
        {label}
        <span
          className={`h-1 w-1 shrink-0 rounded-full ${isFilled ? 'bg-green-500' : 'bg-red-500'}`}
          aria-hidden="true"
        />
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const FORM_CONTROL_CLASSES =
  'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500';
