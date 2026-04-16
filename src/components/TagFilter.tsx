interface Props {
  allTags: string[];
  selected: Set<string>;
  onToggle: (tag: string) => void;
  onClear: () => void;
}

export function TagFilter({ allTags, selected, onToggle, onClear }: Props) {
  if (allTags.length === 0) return null;
  const activeCount = selected.size;
  return (
    <div className="tag-filter">
      <div className="tag-filter__header">
        <span className="tag-filter__label">
          Filter
          {activeCount > 0 && (
            <span className="tag-filter__count">{activeCount}</span>
          )}
        </span>
        {activeCount > 0 && (
          <button type="button" className="tag-filter__clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <ul className="tag-filter__list" role="list">
        {allTags.map((tag) => {
          const on = selected.has(tag);
          return (
            <li key={tag}>
              <button
                type="button"
                className={`tag${on ? ' tag--on' : ''}`}
                onClick={() => onToggle(tag)}
                aria-pressed={on}
              >
                #{tag}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
