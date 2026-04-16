import { useState, type FormEvent } from 'react';
import type { NewTodoInput } from '../hooks/useTodos';

interface Props {
  onAdd: (input: NewTodoInput) => void;
}

export function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [important, setImportant] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [tagsRaw, setTagsRaw] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({
      title: trimmed,
      important,
      urgent,
      tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setTitle('');
    setImportant(false);
    setUrgent(false);
    setTagsRaw('');
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-form__title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        aria-label="Todo title"
      />
      <input
        className="todo-form__tags"
        type="text"
        value={tagsRaw}
        onChange={(e) => setTagsRaw(e.target.value)}
        placeholder="tags, comma, separated"
        aria-label="Tags"
      />
      <label className="todo-form__check">
        <input
          type="checkbox"
          checked={important}
          onChange={(e) => setImportant(e.target.checked)}
        />
        Important
      </label>
      <label className="todo-form__check">
        <input
          type="checkbox"
          checked={urgent}
          onChange={(e) => setUrgent(e.target.checked)}
        />
        Urgent
      </label>
      <button type="submit" className="todo-form__submit" disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
}
