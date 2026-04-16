import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { NewTodoInput } from '../hooks/useTodos';
import type { Quadrant } from '../types';
import { QuadrantPicker } from './QuadrantPicker';

interface Props {
  onAdd: (input: NewTodoInput) => void;
}

function quadrantToFlags(q: Quadrant): { important: boolean; urgent: boolean } {
  return {
    important: q === 'Q1' || q === 'Q2',
    urgent: q === 'Q1' || q === 'Q3',
  };
}

export function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [quadrant, setQuadrant] = useState<Quadrant>('Q2');
  const [tagsRaw, setTagsRaw] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  // Autofocus the title input on mount so users can start typing immediately.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const { important, urgent } = quadrantToFlags(quadrant);
    onAdd({
      title: trimmed,
      important,
      urgent,
      tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setTitle('');
    setTagsRaw('');
    setQuadrant('Q2');
    titleRef.current?.focus();
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        ref={titleRef}
        className="todo-form__title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        aria-label="Todo title"
        enterKeyHint="done"
      />
      <input
        className="todo-form__tags"
        type="text"
        value={tagsRaw}
        onChange={(e) => setTagsRaw(e.target.value)}
        placeholder="Tags, comma separated"
        aria-label="Tags"
      />
      <div className="todo-form__picker">
        <span className="todo-form__picker-label">Priority</span>
        <QuadrantPicker value={quadrant} onChange={setQuadrant} size="sm" />
      </div>
      <button type="submit" className="todo-form__submit" disabled={!title.trim()}>
        Add todo
      </button>
    </form>
  );
}
