export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto px-4 py-8 max-w-[70%] flex-grow">
        {children}
      </main>
      <footer className="py-6 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Made by PVN-TienL</p>
          <p>© 2023 EzSplitPVN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 