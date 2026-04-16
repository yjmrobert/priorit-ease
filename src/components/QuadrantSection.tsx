import type { Quadrant, Todo } from '../types';
import { QUADRANT_BLURB, QUADRANT_LABEL } from '../lib/quadrant';
import { TodoItem } from './TodoItem';

interface Props {
  quadrant: Quadrant;
  todos: Todo[];
  onToggleCompleted: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  onTagClick: (tag: string) => void;
}

const EMPTY_COPY: Record<Quadrant, string> = {
  Q1: 'Nothing burning. Nice.',
  Q2: 'Nothing scheduled yet.',
  Q3: 'Nothing to pass off.',
  Q4: 'Clean slate here.',
};

export function QuadrantSection({
  quadrant,
  todos,
  onToggleCompleted,
  onUpdate,
  onDelete,
  onTagClick,
}: Props) {
  return (
    <section className={`quadrant quadrant--${quadrant.toLowerCase()}`}>
      <header className="quadrant__header">
        <div className="quadrant__heading">
          <h2 className="quadrant__title">{QUADRANT_LABEL[quadrant]}</h2>
          <span className="quadrant__blurb">{QUADRANT_BLURB[quadrant]}</span>
        </div>
        <span className="quadrant__count" aria-label={`${todos.length} items`}>
          {todos.length}
        </span>
      </header>
      {todos.length === 0 ? (
        <p className="quadrant__empty">{EMPTY_COPY[quadrant]}</p>
      ) : (
        <ul className="quadrant__list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleCompleted={onToggleCompleted}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onTagClick={onTagClick}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
