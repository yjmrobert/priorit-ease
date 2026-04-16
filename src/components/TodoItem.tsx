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
      // Revert if user tried to clear the title
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
      <input
        type="checkbox"
        className="todo-item__check"
        checked={todo.completed}
        onChange={() => onToggleCompleted(todo.id)}
        aria-label={todo.completed ? 'Mark as not done' : 'Mark as done'}
      />

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
              placeholder="tags, comma, separated"
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
                  className="tag"
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

      <div className="todo-item__badges">
        <button
          type="button"
          className={`badge badge--important${todo.important ? ' is-on' : ''}`}
          onClick={() => onUpdate(todo.id, { important: !todo.important })}
          aria-pressed={todo.important}
          title="Toggle important"
        >
          {todo.important ? 'Important' : '\u00B7 important'}
        </button>
        <button
          type="button"
          className={`badge badge--urgent${todo.urgent ? ' is-on' : ''}`}
          onClick={() => onUpdate(todo.id, { urgent: !todo.urgent })}
          aria-pressed={todo.urgent}
          title="Toggle urgent"
        >
          {todo.urgent ? 'Urgent' : '\u00B7 urgent'}
        </button>
      </div>

      <button
        type="button"
        className="todo-item__delete"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
        title="Delete"
      >
        ×
      </button>
    </li>
  );
}
