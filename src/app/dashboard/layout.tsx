import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <header className="border-b border-[#333] bg-[#222]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold text-white">
            Autopost
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-[#a0a0a0] hover:text-white transition-colors"
            >
              Posts
            </Link>
            <Link
              href="/dashboard/media"
              className="text-sm text-[#a0a0a0] hover:text-white transition-colors"
            >
              Imagens
            </Link>
            <Link
              href="/dashboard/novo"
              className="rounded-lg bg-[#4f8a3c] px-4 py-2 text-sm font-medium text-white hover:bg-[#5ea048] transition-colors"
            >
              + Novo Post
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
