import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { NewTodoInput } from '../hooks/useTodos';
import type { Quadrant } from '../types';
import { QuadrantPicker } from './QuadrantPicker';
import { fromDatetimeLocalValue } from '../lib/due';

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
  const [dueRaw, setDueRaw] = useState('');
  const [lead, setLead] = useState<number>(0);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const { important, urgent } = quadrantToFlags(quadrant);
    const dueAt = fromDatetimeLocalValue(dueRaw) ?? undefined;
    onAdd({
      title: trimmed,
      important,
      urgent,
      tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
      dueAt,
      reminderLeadMinutes: dueAt !== undefined ? lead : undefined,
    });
    setTitle('');
    setTagsRaw('');
    setDueRaw('');
    setLead(0);
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
      <div className="todo-form__due">
        <span className="todo-form__picker-label">Due (optional)</span>
        <div className="todo-form__due-row">
          <input
            className="todo-form__due-input"
            type="datetime-local"
            value={dueRaw}
            onChange={(e) => setDueRaw(e.target.value)}
            aria-label="Due date and time"
          />
          <select
            className="todo-form__lead"
            value={lead}
            onChange={(e) => setLead(Number(e.target.value))}
            disabled={!dueRaw}
            aria-label="Remind before due"
          >
            <option value={0}>At due time</option>
            <option value={5}>5m before</option>
            <option value={15}>15m before</option>
            <option value={60}>1h before</option>
            <option value={24 * 60}>1d before</option>
          </select>
        </div>
      </div>
      <button type="submit" className="todo-form__submit" disabled={!title.trim()}>
        Add todo
      </button>
    </form>
  );
}
