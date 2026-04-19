import { useEffect, useState } from 'react';
import type { AppSettings } from '../lib/settings';
import { isSupported, permission, requestPermission } from '../lib/notifications';

interface Props {
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
  onClose: () => void;
}

export function NotificationSettings({ settings, onChange, onClose }: Props) {
  const supported = isSupported();
  const [perm, setPerm] = useState<NotificationPermission>(() => permission());

  useEffect(() => {
    setPerm(permission());
  }, [settings.notificationsEnabled]);

  async function handleEnable(next: boolean) {
    if (next && perm !== 'granted') {
      const res = await requestPermission();
      setPerm(res);
      if (res !== 'granted') {
        onChange({ ...settings, notificationsEnabled: false });
        return;
      }
    }
    onChange({ ...settings, notificationsEnabled: next });
  }

  return (
    <div className="settings" role="dialog" aria-label="Notification settings">
      <div className="settings__header">
        <h2 className="settings__title">Notifications</h2>
        <button type="button" className="settings__close" onClick={onClose} aria-label="Close settings">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {!supported && (
        <p className="settings__note settings__note--warn">
          This browser doesn't support notifications.
        </p>
      )}

      <label className="settings__row">
        <input
          type="checkbox"
          checked={settings.notificationsEnabled && perm === 'granted'}
          disabled={!supported || perm === 'denied'}
          onChange={(e) => handleEnable(e.target.checked)}
        />
        <div>
          <div className="settings__row-label">Enable notifications</div>
          <div className="settings__row-blurb">
            Reminders for todos with a due date, and an optional daily summary.
          </div>
        </div>
      </label>

      {perm === 'denied' && (
        <p className="settings__note settings__note--warn">
          Notifications are blocked for this site. Allow them in your browser settings to enable.
        </p>
      )}

      <fieldset className="settings__group" disabled={!settings.notificationsEnabled || perm !== 'granted'}>
        <legend>Daily digest</legend>
        <label className="settings__row">
          <input
            type="checkbox"
            checked={settings.dailyDigestEnabled}
            onChange={(e) => onChange({ ...settings, dailyDigestEnabled: e.target.checked })}
          />
          <div>
            <div className="settings__row-label">Send a daily summary</div>
            <div className="settings__row-blurb">A short notification listing your open todos.</div>
          </div>
        </label>
        <label className="settings__row settings__row--inline">
          <span className="settings__row-label">Time</span>
          <input
            type="time"
            value={settings.dailyDigestTime}
            onChange={(e) => onChange({ ...settings, dailyDigestTime: e.target.value })}
          />
        </label>
      </fieldset>

      <p className="settings__note">
        Heads up: on iOS, web notifications only fire while the app is open. On Android and desktop,
        installed PWAs can notify in the background.
      </p>
    </div>
  );
}
