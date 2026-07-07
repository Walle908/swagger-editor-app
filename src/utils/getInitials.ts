export default function getInitials(name: string | null): string {
  if (!name) return 'U';

  const trimmed = name.trim();
  if (!trimmed) return 'U';

  const parts = trimmed.split(/\s+/);

  if (parts.length >= 2) {
    const firstLetter = parts[0]?.[0];
    const secondLetter = parts[1]?.[0];

    if (firstLetter && secondLetter) {
      return `${firstLetter}${secondLetter}`.toUpperCase();
    }
  }
  return trimmed.slice(0, 2).toUpperCase();
}
