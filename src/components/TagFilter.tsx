interface Props {
  allTags: string[];
  selected: Set<string>;
  onToggle: (tag: string) => void;
  onClear: () => void;
}

export function TagFilter({ allTags, selected, onToggle, onClear }: Props) {
  if (allTags.length === 0) return null;
  return (
    <div className="tag-filter">
      <span className="tag-filter__label">Filter by tag:</span>
      <ul className="tag-filter__list">
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
      {selected.size > 0 && (
        <button type="button" className="tag-filter__clear" onClick={onClear}>
          clear
        </button>
      )}
    </div>
  );
}
