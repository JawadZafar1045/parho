export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return <div className="p-6 text-sm text-slate-500">{label}</div>;
}
