export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
