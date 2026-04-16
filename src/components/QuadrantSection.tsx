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
        <h2 className="quadrant__title">{QUADRANT_LABEL[quadrant]}</h2>
        <span className="quadrant__blurb">{QUADRANT_BLURB[quadrant]}</span>
        <span className="quadrant__count">{todos.length}</span>
      </header>
      {todos.length === 0 ? (
        <p className="quadrant__empty">No items.</p>
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
