interface ForgotProps {
  dark: boolean
}

const Forgot = ({ dark }: ForgotProps) => {
  return (
    <div className={`min-h-screen flex items-center justify-center px-6 ${dark ? "bg-black text-white" : "bg-zinc-50 text-black"}`}>
      <div className={`max-w-md w-full rounded-3xl border p-8 text-center ${dark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white"}`}>
        <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
        <p className={`mt-3 text-sm ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
          Password reset is not wired yet. Login and signup are now connected; we can build reset flow next on top of this auth foundation.
        </p>
      </div>
    </div>
  )
}

export default Forgot
