export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '****';
  return phone.slice(0, 2) + '****' + phone.slice(-2);
}

export function maskEmail(email: string): string {
  if (!email) return '****';
  const [name, domain] = email.split('@');
  if (!domain) return '****';
  return name.slice(0, 2) + '***@' + domain;
}
