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
  /** Millisecond epoch for the due date/time. Absent = no due date. */
  dueAt?: number;
  /** Minutes before dueAt to fire a reminder. 0 = at due time. Default 0. */
  reminderLeadMinutes?: number;
}

export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';
