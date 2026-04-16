import { useMemo, useState } from 'react';
import { TodoForm } from './components/TodoForm';
import { QuadrantSection } from './components/QuadrantSection';
import { TagFilter } from './components/TagFilter';
import { Toolbar } from './components/Toolbar';
import { groupByQuadrant, QUADRANT_ORDER } from './lib/quadrant';
import { useTodos } from './hooks/useTodos';

export default function App() {
  const { todos, addTodo, updateTodo, toggleCompleted, deleteTodo, clearCompleted } = useTodos();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const t of todos) for (const tag of t.tags) set.add(tag);
    return [...set].sort();
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter((t) => {
      if (!showCompleted && t.completed) return false;
      for (const tag of selectedTags) {
        if (!t.tags.includes(tag)) return false;
      }
      return true;
    });
  }, [todos, selectedTags, showCompleted]);

  const grouped = useMemo(() => groupByQuadrant(visibleTodos), [visibleTodos]);
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">priorit-ease</h1>
        <p className="app__tagline">
          A to-do tracker organized by importance and urgency.
        </p>
      </header>

      <main className="app__main">
        <TodoForm onAdd={addTodo} />

        <TagFilter
          allTags={allTags}
          selected={selectedTags}
          onToggle={toggleTag}
          onClear={() => setSelectedTags(new Set())}
        />

        <Toolbar
          showCompleted={showCompleted}
          onToggleShowCompleted={setShowCompleted}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />

        <div className="quadrants">
          {QUADRANT_ORDER.map((q) => (
            <QuadrantSection
              key={q}
              quadrant={q}
              todos={grouped[q]}
              onToggleCompleted={toggleCompleted}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onTagClick={toggleTag}
            />
          ))}
        </div>
      </main>

      <footer className="app__footer">
        Data is stored locally in your browser. Nothing is sent to a server.
      </footer>
    </div>
  );
}
