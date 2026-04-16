import type { Todo } from '../types';

const STORAGE_KEY = 'priorit-ease:todos:v1';

export function loadTodos(): Todo[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTodo);
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // quota exceeded or storage disabled — silently ignore
  }
}

function isTodo(value: unknown): value is Todo {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.title === 'string' &&
    typeof v.important === 'boolean' &&
    typeof v.urgent === 'boolean' &&
    typeof v.completed === 'boolean' &&
    typeof v.createdAt === 'number' &&
    Array.isArray(v.tags) &&
    v.tags.every((t) => typeof t === 'string')
  );
}
