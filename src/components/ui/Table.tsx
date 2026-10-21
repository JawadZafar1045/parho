import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto rounded-lg border border-slate-200">{children}</div>;
}
