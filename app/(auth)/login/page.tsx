"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  async function handleLogin() {

    setLoading(true)

    const res = await fetch("/api/auth/login", {

      method: "POST",

      body: JSON.stringify({
        username,
        password
      })

    })

    setLoading(false)

    if (res.ok)
      router.push("/chat")

    else
      alert("Invalid credentials")

  }

  return (
    <div className="w-[340px] flex flex-col gap-4">

      <h1 className="text-2xl font-semibold">
        Login
      </h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        className="bg-gray-900 p-3 rounded-lg outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="bg-gray-900 p-3 rounded-lg outline-none"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="
          bg-white
          text-black
          p-3
          rounded-lg
        "
      >
        {loading ? "Logging in..." : "Login"}
      </button>

    </div>
  )
}
