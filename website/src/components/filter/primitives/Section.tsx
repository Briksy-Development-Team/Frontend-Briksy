export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function Divider() {
  return <hr className="border-gray-100" />;
}