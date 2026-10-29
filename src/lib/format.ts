export function timeAgo(input: Date | string | number): string {
  const date = input instanceof Date ? input : new Date(input);
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(days / 365)}y`;
}

export function compactNumber(value: number): string {
  if (value < 1000) return `${value}`;
  if (value < 1_000_000) {
    const short = value / 1000;
    return `${short >= 10 ? Math.round(short) : short.toFixed(1).replace(/\.0$/, "")}k`;
  }
  const short = value / 1_000_000;
  return `${short >= 10 ? Math.round(short) : short.toFixed(1).replace(/\.0$/, "")}m`;
}

export function joinedDate(input: Date | string): string {
  const date = input instanceof Date ? input : new Date(input);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function withCount(noun: string, value: number): string {
  return `${value} ${noun}${value === 1 ? "" : "s"}`;
}
