import { useState, type KeyboardEvent } from 'react';
import type { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggleCompleted: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  onTagClick: (tag: string) => void;
}

export function TodoItem({ todo, onToggleCompleted, onUpdate, onDelete, onTagClick }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [tagDraft, setTagDraft] = useState(todo.tags.join(', '));

  function commitEdit() {
    const trimmed = draft.trim();
    const nextTags = tagDraft.split(',').map((t) => t.trim()).filter(Boolean);
    if (!trimmed) {
      setDraft(todo.title);
      setTagDraft(todo.tags.join(', '));
    } else {
      onUpdate(todo.id, { title: trimmed, tags: nextTags });
    }
    setEditing(false);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setDraft(todo.title);
      setTagDraft(todo.tags.join(', '));
      setEditing(false);
    }
  }

  return (
    <li className={`todo-item${todo.completed ? ' todo-item--done' : ''}`}>
      <label className="todo-item__check-wrap" aria-label="Mark done">
        <input
          type="checkbox"
          className="todo-item__check"
          checked={todo.completed}
          onChange={() => onToggleCompleted(todo.id)}
        />
        <span className="todo-item__check-box" aria-hidden="true" />
      </label>

      <div className="todo-item__main">
        {editing ? (
          <div className="todo-item__edit">
            <input
              className="todo-item__edit-title"
              type="text"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              onBlur={commitEdit}
              aria-label="Edit title"
            />
            <input
              className="todo-item__edit-tags"
              type="text"
              value={tagDraft}
              placeholder="tags, comma separated"
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={handleKey}
              onBlur={commitEdit}
              aria-label="Edit tags"
            />
          </div>
        ) : (
          <button
            type="button"
            className="todo-item__title"
            onClick={() => setEditing(true)}
            title="Click to edit"
          >
            {todo.title}
          </button>
        )}

        {todo.tags.length > 0 && !editing && (
          <ul className="todo-item__tags">
            {todo.tags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="tag tag--sm"
                  onClick={() => onTagClick(tag)}
                  title={`Filter by #${tag}`}
                >
                  #{tag}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="todo-item__actions">
        <button
          type="button"
          className={`icon-toggle icon-toggle--star${todo.important ? ' is-on' : ''}`}
          onClick={() => onUpdate(todo.id, { important: !todo.important })}
          aria-pressed={todo.important}
          aria-label={todo.important ? 'Unmark important' : 'Mark important'}
          title={todo.important ? 'Important' : 'Not important'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M12 3.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.9L12 3.5z"
              fill={todo.important ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className={`icon-toggle icon-toggle--bolt${todo.urgent ? ' is-on' : ''}`}
          onClick={() => onUpdate(todo.id, { urgent: !todo.urgent })}
          aria-pressed={todo.urgent}
          aria-label={todo.urgent ? 'Unmark urgent' : 'Mark urgent'}
          title={todo.urgent ? 'Urgent' : 'Not urgent'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
              fill={todo.urgent ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="icon-toggle icon-toggle--delete"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
          title="Delete"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
