// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-100 p-4 font-sans">
      <div className="w-full max-w-md overflow-hidden rounded-2xl sm:rounded-[24px] border border-zinc-200 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {children}
      </div>
    </div>
  );
}
