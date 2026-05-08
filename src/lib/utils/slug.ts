export function generateSlug(firstName: string, lastName: string, city?: string): string {
  const parts = [firstName, lastName, city].filter(Boolean);
  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}
