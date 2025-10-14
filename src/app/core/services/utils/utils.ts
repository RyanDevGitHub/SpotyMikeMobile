export function formatDuration(duration: string): string {
  const totalSeconds = parseInt(duration, 10);
  if (isNaN(totalSeconds)) return '0:00';

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
