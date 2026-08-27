'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center border border-apple-border rounded-full overflow-hidden bg-apple-light">
      <button
        onClick={decrement}
        disabled={value <= min}
        className="p-2.5 hover:bg-apple-border/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5 text-apple-dark" />
      </button>

      <span className="w-10 text-center text-sm font-semibold text-apple-dark tabular-nums">
        {value}
      </span>

      <button
        onClick={increment}
        disabled={value >= max}
        className="p-2.5 hover:bg-apple-border/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5 text-apple-dark" />
      </button>
    </div>
  );
}
