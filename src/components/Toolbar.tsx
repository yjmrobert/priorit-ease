interface Props {
  showCompleted: boolean;
  onToggleShowCompleted: (next: boolean) => void;
  completedCount: number;
  onClearCompleted: () => void;
}

export function Toolbar({
  showCompleted,
  onToggleShowCompleted,
  completedCount,
  onClearCompleted,
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
    </div>
  );
}
