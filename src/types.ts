export interface Todo {
  id: string;
  title: string;
  notes?: string;
  important: boolean;
  urgent: boolean;
  tags: string[];
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';
