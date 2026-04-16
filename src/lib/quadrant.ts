import type { Quadrant, Todo } from '../types';

// Eisenhower order: importance wins ties.
export const QUADRANT_ORDER: readonly Quadrant[] = ['Q1', 'Q2', 'Q3', 'Q4'];

export const QUADRANT_RANK: Record<Quadrant, number> = {
  Q1: 0,
  Q2: 1,
  Q3: 2,
  Q4: 3,
};

export const QUADRANT_LABEL: Record<Quadrant, string> = {
  Q1: 'Important & Urgent',
  Q2: 'Important, Not Urgent',
  Q3: 'Not Important, Urgent',
  Q4: 'Not Important, Not Urgent',
};

export const QUADRANT_BLURB: Record<Quadrant, string> = {
  Q1: 'Do first',
  Q2: 'Schedule',
  Q3: 'Delegate',
  Q4: 'Eliminate',
};

export function quadrantOf(t: Pick<Todo, 'important' | 'urgent'>): Quadrant {
  if (t.important && t.urgent) return 'Q1';
  if (t.important) return 'Q2';
  if (t.urgent) return 'Q3';
  return 'Q4';
}

export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const r = QUADRANT_RANK[quadrantOf(a)] - QUADRANT_RANK[quadrantOf(b)];
    if (r !== 0) return r;
    return b.createdAt - a.createdAt;
  });
}

export function groupByQuadrant(todos: Todo[]): Record<Quadrant, Todo[]> {
  const out: Record<Quadrant, Todo[]> = { Q1: [], Q2: [], Q3: [], Q4: [] };
  for (const t of sortTodos(todos)) {
    out[quadrantOf(t)].push(t);
  }
  return out;
}
