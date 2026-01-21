import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: number;
}

export const Slider: React.FC<SliderProps> = ({ label, value, className = '', onChange, min, max, ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
            {label}
          </label>
          <input
            type="number"
            value={value.toString()} // Ensure string for input handling
            onChange={onChange}
            min={min}
            max={max}
            className="w-16 px-2 py-1 text-right text-sm font-mono font-medium bg-white border border-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-slate-900 placeholder:text-slate-300"
            placeholder="0"
          />
        </div>
      )}
      <input
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        {...props}
      />
    </div>
  );
};