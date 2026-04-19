import { useState, type KeyboardEvent } from 'react';
import type { Todo } from '../types';
import { formatDue, fromDatetimeLocalValue, isOverdue, toDatetimeLocalValue } from '../lib/due';

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
  const [dueDraft, setDueDraft] = useState(
    todo.dueAt ? toDatetimeLocalValue(todo.dueAt) : '',
  );
  const [leadDraft, setLeadDraft] = useState<number>(todo.reminderLeadMinutes ?? 0);

  const overdue = isOverdue(todo);

  function commitEdit() {
    const trimmed = draft.trim();
    const nextTags = tagDraft.split(',').map((t) => t.trim()).filter(Boolean);
    if (!trimmed) {
      setDraft(todo.title);
      setTagDraft(todo.tags.join(', '));
      setDueDraft(todo.dueAt ? toDatetimeLocalValue(todo.dueAt) : '');
      setLeadDraft(todo.reminderLeadMinutes ?? 0);
    } else {
      const nextDue = fromDatetimeLocalValue(dueDraft);
      onUpdate(todo.id, {
        title: trimmed,
        tags: nextTags,
        dueAt: nextDue ?? undefined,
        reminderLeadMinutes: nextDue !== null ? leadDraft : undefined,
      });
    }
    setEditing(false);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setDraft(todo.title);
      setTagDraft(todo.tags.join(', '));
      setDueDraft(todo.dueAt ? toDatetimeLocalValue(todo.dueAt) : '');
      setLeadDraft(todo.reminderLeadMinutes ?? 0);
      setEditing(false);
    }
  }

  return (
    <li
      className={`todo-item${todo.completed ? ' todo-item--done' : ''}${overdue ? ' todo-item--overdue' : ''}`}
    >
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
            <div className="todo-item__edit-due">
              <input
                className="todo-item__edit-duedate"
                type="datetime-local"
                value={dueDraft}
                onChange={(e) => setDueDraft(e.target.value)}
                onBlur={commitEdit}
                aria-label="Edit due date"
              />
              <select
                className="todo-item__edit-lead"
                value={leadDraft}
                onChange={(e) => setLeadDraft(Number(e.target.value))}
                onBlur={commitEdit}
                disabled={!dueDraft}
                aria-label="Remind before due"
              >
                <option value={0}>At due</option>
                <option value={5}>5m before</option>
                <option value={15}>15m before</option>
                <option value={60}>1h before</option>
                <option value={24 * 60}>1d before</option>
              </select>
              {dueDraft && (
                <button
                  type="button"
                  className="todo-item__edit-clear"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setDueDraft('');
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="todo-item__title"
              onClick={() => setEditing(true)}
              title="Click to edit"
            >
              {todo.title}
            </button>
            {todo.dueAt !== undefined && (
              <div className={`todo-item__due${overdue ? ' is-overdue' : ''}`}>
                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                  <circle cx="12" cy="13" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 9v4l2.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span>
                  {overdue ? 'Overdue' : 'Due'} {formatDue(todo.dueAt)}
                </span>
              </div>
            )}
          </>
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
