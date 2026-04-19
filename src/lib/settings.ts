const STORAGE_KEY = 'priorit-ease:settings:v1';

export interface AppSettings {
  notificationsEnabled: boolean;
  dailyDigestEnabled: boolean;
  /** 24h "HH:MM" in the user's local time. */
  dailyDigestTime: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  notificationsEnabled: false,
  dailyDigestEnabled: false,
  dailyDigestTime: '08:00',
};

export function loadSettings(): AppSettings {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_SETTINGS };
    const p = parsed as Partial<AppSettings>;
    return {
      notificationsEnabled: typeof p.notificationsEnabled === 'boolean' ? p.notificationsEnabled : DEFAULT_SETTINGS.notificationsEnabled,
      dailyDigestEnabled: typeof p.dailyDigestEnabled === 'boolean' ? p.dailyDigestEnabled : DEFAULT_SETTINGS.dailyDigestEnabled,
      dailyDigestTime: isValidTime(p.dailyDigestTime) ? p.dailyDigestTime : DEFAULT_SETTINGS.dailyDigestTime,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // quota exceeded or storage disabled — silently ignore
  }
}

function isValidTime(v: unknown): v is string {
  return typeof v === 'string' && /^\d{2}:\d{2}$/.test(v);
}
