import type { Quadrant } from '../types';
import { QUADRANT_BLURB, QUADRANT_LABEL, QUADRANT_ORDER } from '../lib/quadrant';

interface Props {
  value: Quadrant;
  onChange: (next: Quadrant) => void;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

/**
 * Tiny 2x2 quadrant picker. Tapping a cell sets both important and urgent
 * in a single gesture. Used in the add form and (potentially) in row edit.
 */
export function QuadrantPicker({ value, onChange, size = 'md', ariaLabel }: Props) {
  return (
    <div
      className={`qpick qpick--${size}`}
      role="radiogroup"
      aria-label={ariaLabel ?? 'Priority quadrant'}
    >
      {QUADRANT_ORDER.map((q) => {
        const on = value === q;
        return (
          <button
            key={q}
            type="button"
            role="radio"
            aria-checked={on}
            className={`qpick__cell qpick__cell--${q.toLowerCase()}${on ? ' is-on' : ''}`}
            onClick={() => onChange(q)}
          >
            <span className="qpick__label">{QUADRANT_LABEL[q]}</span>
            <span className="qpick__blurb">{QUADRANT_BLURB[q]}</span>
          </button>
        );
      })}
    </div>
  );
}
