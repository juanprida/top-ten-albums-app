import React from 'react';
export function Input(p: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...p}
      className={`h-9 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gray-200 ${
        p.className || ''
      }`}
    />
  );
}
export function Textarea(p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...p}
      className={`min-h-[80px] w-full rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-200 ${
        p.className || ''
      }`}
    />
  );
}
export function Badge({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 ${className}`}
    >
      {children}
    </span>
  );
}
