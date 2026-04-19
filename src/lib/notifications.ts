import type { Todo } from '../types';
import type { AppSettings } from './settings';
import { nextDailyAt, reminderTime } from './due';

// Where an experimental API isn't widely typed yet.
interface TriggerCapableNotificationOptions extends NotificationOptions {
  showTrigger?: unknown;
}
declare const TimestampTrigger: { new (timestamp: number): unknown } | undefined;

const TODO_TAG_PREFIX = 'priorit-ease:todo:';
const DIGEST_TAG = 'priorit-ease:daily-digest';

/** In-session fallback timers, keyed by notification tag. */
const fallbackTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

export function permission(): NotificationPermission {
  if (!isSupported()) return 'denied';
  return Notification.permission;
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!isSupported()) return 'denied';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  return Notification.requestPermission();
}

function supportsTriggers(): boolean {
  try {
    return (
      typeof TimestampTrigger !== 'undefined' &&
      typeof Notification !== 'undefined' &&
      'showTrigger' in Notification.prototype
    );
  } catch {
    return false;
  }
}

async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    return (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.ready);
  } catch {
    return null;
  }
}

async function scheduleAt(
  fireAt: number,
  tag: string,
  title: string,
  body: string,
): Promise<void> {
  const now = Date.now();
  if (fireAt <= now) return;

  const reg = await getRegistration();

  if (reg && supportsTriggers()) {
    try {
      const options: TriggerCapableNotificationOptions = {
        tag,
        body,
        icon: './icon-192.png',
        badge: './icon-192.png',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        showTrigger: new (TimestampTrigger as any)(fireAt),
      };
      await reg.showNotification(title, options);
      return;
    } catch {
      // fall through to setTimeout fallback
    }
  }

  cancelFallback(tag);
  const delay = fireAt - now;
  const timer = setTimeout(() => {
    fallbackTimers.delete(tag);
    void showNow(tag, title, body);
  }, delay);
  fallbackTimers.set(tag, timer);
}

async function showNow(tag: string, title: string, body: string): Promise<void> {
  const reg = await getRegistration();
  const options: NotificationOptions = {
    tag,
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
  };
  if (reg) {
    try {
      await reg.showNotification(title, options);
      return;
    } catch {
      // fall through
    }
  }
  try {
    new Notification(title, options);
  } catch {
    // permission revoked or feature unsupported — nothing we can do
  }
}

function cancelFallback(tag: string) {
  const t = fallbackTimers.get(tag);
  if (t !== undefined) {
    clearTimeout(t);
    fallbackTimers.delete(tag);
  }
}

async function cancelScheduled(tag: string): Promise<void> {
  cancelFallback(tag);
  const reg = await getRegistration();
  if (!reg) return;
  try {
    const existing = await reg.getNotifications({ tag, includeTriggered: true } as NotificationOptions & { includeTriggered?: boolean });
    for (const n of existing) n.close();
  } catch {
    // ignore
  }
}

async function cancelAllWithPrefix(prefix: string): Promise<void> {
  for (const tag of Array.from(fallbackTimers.keys())) {
    if (tag.startsWith(prefix)) cancelFallback(tag);
  }
  const reg = await getRegistration();
  if (!reg) return;
  try {
    const existing = await reg.getNotifications({ includeTriggered: true } as NotificationOptions & { includeTriggered?: boolean });
    for (const n of existing) {
      if (n.tag.startsWith(prefix)) n.close();
    }
  } catch {
    // ignore
  }
}

function todoTag(id: string): string {
  return TODO_TAG_PREFIX + id;
}

export async function scheduleTodoReminder(todo: Todo): Promise<void> {
  const tag = todoTag(todo.id);
  await cancelScheduled(tag);
  if (todo.completed) return;
  const fireAt = reminderTime(todo);
  if (fireAt === null || fireAt <= Date.now()) return;
  const title = todo.title || 'Reminder';
  const body = todo.dueAt
    ? `Due ${new Date(todo.dueAt).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' })}`
    : '';
  await scheduleAt(fireAt, tag, title, body);
}

export async function cancelTodoReminder(id: string): Promise<void> {
  await cancelScheduled(todoTag(id));
}

export async function rescheduleAllTodos(todos: Todo[]): Promise<void> {
  if (!isSupported() || permission() !== 'granted') {
    await cancelAllWithPrefix(TODO_TAG_PREFIX);
    return;
  }
  await cancelAllWithPrefix(TODO_TAG_PREFIX);
  await Promise.all(todos.map((t) => scheduleTodoReminder(t)));
}

export async function scheduleDailyDigest(settings: AppSettings, todos: Todo[]): Promise<void> {
  await cancelScheduled(DIGEST_TAG);
  if (!settings.notificationsEnabled || !settings.dailyDigestEnabled) return;
  if (permission() !== 'granted') return;

  const fireAt = nextDailyAt(settings.dailyDigestTime);
  const open = todos.filter((t) => !t.completed);
  const q1 = open.filter((t) => t.important && t.urgent).length;
  const q2 = open.filter((t) => t.important && !t.urgent).length;
  const title = 'priorit-ease — daily digest';
  const body =
    open.length === 0
      ? 'No open todos. Nice.'
      : `${q1} do-first · ${q2} scheduled · ${open.length} open total`;
  await scheduleAt(fireAt, DIGEST_TAG, title, body);
}

export async function cancelDailyDigest(): Promise<void> {
  await cancelScheduled(DIGEST_TAG);
}

export async function syncAll(settings: AppSettings, todos: Todo[]): Promise<void> {
  if (!settings.notificationsEnabled || permission() !== 'granted') {
    await cancelAllWithPrefix(TODO_TAG_PREFIX);
    await cancelDailyDigest();
    return;
  }
  await rescheduleAllTodos(todos);
  await scheduleDailyDigest(settings, todos);
}
