type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700"
    >
      <p className="font-medium">{title}</p>
      <p>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-md border border-rose-300 bg-white px-3 py-1 font-medium text-rose-700 hover:bg-rose-100"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
