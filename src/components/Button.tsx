import React from 'react';
import clsx from 'clsx';
type P = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'icon';
};
export function Button({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: P) {
  const base =
    'inline-flex items-center justify-center rounded-2xl border transition active:translate-y-px disabled:opacity-50';
  const v = {
    default: 'bg-black text-white border-black hover:bg-gray-800',
    outline: 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50',
  };
  const s = { sm: 'px-2 py-1 text-sm', md: 'px-3 py-2 text-sm', icon: 'p-2' };
  return (
    <button className={clsx(base, v[variant], s[size], className)} {...props} />
  );
}
