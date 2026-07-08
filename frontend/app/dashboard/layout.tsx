import Nav from "../Component/Nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 min-h-screen bg-surface border-r border-border-app p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-danger" />
          <h1 className="text-xl font-extrabold tracking-wide text-accent">
            REELLIST
          </h1>
        </div>
        <Nav />
      </aside>
      <div className="flex-1 min-h-screen">{children}</div>
    </div>
  );
}
