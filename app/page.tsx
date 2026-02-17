import Link from "next/link"

export default function LandingPage() {

  return (
    <main className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <header className="flex justify-between p-6">

        <div className="text-xl font-bold">
          Mikxo
        </div>

        <div className="flex gap-4">

          <Link href="/login">
            Login
          </Link>

          <Link
            href="/register"
            className="bg-white text-black px-4 py-2 rounded"
          >
            Get Started
          </Link>

        </div>

      </header>


      {/* HERO */}

      <section className="flex flex-col items-center justify-center text-center mt-32">

        <h1 className="text-6xl font-bold mb-6">

          Where communication
          <br />
          happens faster.

        </h1>

        <p className="text-gray-400 mb-8">

          Mikxo is a modern realtime platform
          for teams and communities.

        </p>

        <Link
          href="/register"
          className="
            bg-white
            text-black
            px-8
            py-4
            rounded-xl
          "
        >
          Get Started
        </Link>

      </section>

    </main>
  )
}
