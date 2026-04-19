import type { Todo } from '../types';

export function isOverdue(todo: Todo, now: number = Date.now()): boolean {
  return !todo.completed && todo.dueAt !== undefined && todo.dueAt < now;
}

export function reminderTime(todo: Todo): number | null {
  if (todo.dueAt === undefined) return null;
  const lead = Math.max(0, todo.reminderLeadMinutes ?? 0);
  return todo.dueAt - lead * 60_000;
}

/** Format a due timestamp for display. Relative when close, absolute when far. */
export function formatDue(dueAt: number, now: number = Date.now()): string {
  const diff = dueAt - now;
  const abs = Math.abs(diff);
  const min = 60_000;
  const hr = 60 * min;
  const day = 24 * hr;

  if (abs < min) return diff < 0 ? 'just now' : 'in <1m';
  if (abs < hr) {
    const m = Math.round(abs / min);
    return diff < 0 ? `${m}m ago` : `in ${m}m`;
  }
  if (abs < day) {
    const h = Math.round(abs / hr);
    return diff < 0 ? `${h}h ago` : `in ${h}h`;
  }
  if (abs < 7 * day) {
    const d = Math.round(abs / day);
    return diff < 0 ? `${d}d ago` : `in ${d}d`;
  }
  const date = new Date(dueAt);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Convert a `Date` to the string value expected by <input type="datetime-local">. */
export function toDatetimeLocalValue(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Parse a <input type="datetime-local"> value (local time) to an ms epoch. */
export function fromDatetimeLocalValue(v: string): number | null {
  if (!v) return null;
  const t = Date.parse(v);
  if (Number.isNaN(t)) return null;
  return t;
}

/** Next occurrence of a daily "HH:MM" time, in ms epoch. */
export function nextDailyAt(timeHHMM: string, now: number = Date.now()): number {
  const [h, m] = timeHHMM.split(':').map((s) => Number(s));
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  if (d.getTime() <= now) d.setDate(d.getDate() + 1);
  return d.getTime();
}
