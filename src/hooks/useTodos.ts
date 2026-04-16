import { useCallback, useEffect, useState } from 'react';
import type { Todo } from '../types';
import { loadTodos, saveTodos } from '../lib/storage';

export interface NewTodoInput {
  title: string;
  important: boolean;
  urgent: boolean;
  tags: string[];
  notes?: string;
}

export interface UseTodos {
  todos: Todo[];
  addTodo: (input: NewTodoInput) => void;
  updateTodo: (id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  toggleCompleted: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
}

export function useTodos(): UseTodos {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback((input: NewTodoInput) => {
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        title: input.title.trim(),
        notes: input.notes?.trim() || undefined,
        important: input.important,
        urgent: input.urgent,
        tags: normalizeTags(input.tags),
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const updateTodo = useCallback<UseTodos['updateTodo']>((id, patch) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next: Todo = { ...t, ...patch };
        if (patch.tags) next.tags = normalizeTags(patch.tags);
        if (patch.title !== undefined) next.title = patch.title.trim();
        return next;
      }),
    );
  }, []);

  const toggleCompleted = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : undefined,
            }
          : t,
      ),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  return { todos, addTodo, updateTodo, toggleCompleted, deleteTodo, clearCompleted };
}

function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const tag = raw.trim().toLowerCase();
    if (!tag) continue;
    if (seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out;
}
