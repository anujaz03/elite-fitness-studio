export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getProgramImage(title: string): string {
  const normalizedTitle = title.toLowerCase().trim();
  if (normalizedTitle.includes('hiit')) {
    return '/images/programs/hiit.jpg';
  }
  if (normalizedTitle.includes('yoga') || normalizedTitle.includes('vinyasa')) {
    return '/images/programs/yoga.jpg';
  }
  if (normalizedTitle.includes('pilates')) {
    return '/images/programs/pilates.jpg';
  }
  if (normalizedTitle.includes('strength') || normalizedTitle.includes('power')) {
    return '/images/programs/strength.jpg';
  }
  return '/images/dashboard/dashboard-lifestyle.jpg';
}

