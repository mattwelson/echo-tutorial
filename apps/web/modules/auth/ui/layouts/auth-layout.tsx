export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-4 flex-col items-center justify-center min-h-svh">
      {children}
    </div>
  );
}
