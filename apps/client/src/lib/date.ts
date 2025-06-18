export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

export const isWithinLast48Hours = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return Date.now() - date.getTime() < 48 * 60 * 60 * 1000;
};
