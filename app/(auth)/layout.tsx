import Link from "next/link"

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <Link
        href="/"
        className="absolute top-6 left-6 text-gray-400 hover:text-white"
      >
        ← Mikxo
      </Link>

      {children}

    </main>
  )
}
