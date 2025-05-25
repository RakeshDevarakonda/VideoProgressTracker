
export function secondsToIntervals(secondsSet) {
  if (!secondsSet || secondsSet.size === 0) return [];

  const sorted = Array.from(secondsSet).sort((a, b) => a - b);
  const intervals = [];
  let start = sorted[0];
  let prev = start;

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
    } else {
      intervals.push([start, prev]);
      start = current;
      prev = current;
    }
  }
  intervals.push([start, prev]);
  return intervals;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
