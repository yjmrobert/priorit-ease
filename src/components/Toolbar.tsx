interface Props {
  showCompleted: boolean;
  onToggleShowCompleted: (next: boolean) => void;
  completedCount: number;
  onClearCompleted: () => void;
  canInstall: boolean;
  onInstall: () => void;
  isOffline: boolean;
  onOpenSettings: () => void;
}

export function Toolbar({
  showCompleted,
  onToggleShowCompleted,
  completedCount,
  onClearCompleted,
  canInstall,
  onInstall,
  isOffline,
  onOpenSettings,
}: Props) {
  return (
    <div className="toolbar">
      <label className="toolbar__check">
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={(e) => onToggleShowCompleted(e.target.checked)}
        />
        Show completed
      </label>
      {completedCount > 0 && (
        <button type="button" className="toolbar__clear" onClick={onClearCompleted}>
          Clear {completedCount} completed
        </button>
      )}
      <div className="toolbar__spacer" />
      {isOffline && (
        <span className="toolbar__status" title="You're offline — changes save locally">
          <span className="toolbar__status-dot" aria-hidden="true" />
          Offline
        </span>
      )}
      <button
        type="button"
        className="toolbar__icon-btn"
        onClick={onOpenSettings}
        aria-label="Notification settings"
        title="Notifications"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M6 9a6 6 0 1 1 12 0v4l1.5 3h-15L6 13V9z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M10 19a2 2 0 0 0 4 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {canInstall && (
        <button type="button" className="toolbar__install" onClick={onInstall}>
          Install app
        </button>
      )}
    </div>
  );
}
