import React from 'react';
type C = { value: string; setValue: (v: string) => void };
const Ctx = React.createContext<C | null>(null);
export function Tabs({
  value,
  onValueChange,
  children,
  className = '',
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Ctx.Provider value={{ value, setValue: onValueChange }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  );
}
export function TabsList({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
}
export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const c = React.useContext(Ctx)!;
  const a = c.value === value;
  return (
    <button
      onClick={() => c.setValue(value)}
      className={`mx-1 inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm transition ${
        a
          ? 'bg-white shadow border border-gray-200'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}
export function TabsContent({
  value,
  children,
  className = '',
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const c = React.useContext(Ctx)!;
  if (c.value !== value) return null;
  return <div className={className}>{children}</div>;
}
