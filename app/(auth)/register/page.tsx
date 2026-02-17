"use client"
const  RegisterPage = () => {

  return (
    <div className="flex flex-col gap-4">

      <h1>Create account</h1>

      {/* GOOGLE BUTTON */}

      <button
        onClick={() => {
          window.location.href =
            "/api/auth/google"
        }}
        className="
          bg-white
          text-black
          p-3
          rounded-lg
        "
      >
        Continue with Google
      </button>

    </div>
  )
}
export default RegisterPage
