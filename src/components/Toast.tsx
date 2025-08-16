import React from 'react';
type Toast = { id: string; text: string };
const Ctx = React.createContext<{ push: (t: string) => void } | null>(null);
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Toast[]>([]);
  function push(text: string) {
    const id = crypto.randomUUID();
    setItems((p) => [...p, { id, text }]);
    setTimeout(() => setItems((p) => p.filter((x) => x.id !== id)), 2400);
  }
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow"
          >
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
export function useToast() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('ToastProvider missing');
  return ctx;
}
