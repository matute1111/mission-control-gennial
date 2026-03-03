import { useState } from "react"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { USERS } from "@/types"
import type { User } from "@/types"

interface LoginProps { onLogin: (u: User) => void }

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [err, setErr] = useState("")

  const login = () => {
    const u = USERS[email]
    if (u && u.pass === pass) onLogin({ email, name: u.name, role: u.role })
    else setErr("Credenciales incorrectas")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950">
      <div className="w-full max-w-sm p-8 bg-stone-900 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">G</div>
          <div>
            <div className="text-white font-semibold text-lg">Mission Control</div>
            <div className="text-stone-500 text-xs">gennial.ai</div>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            className="bg-stone-800 border-stone-700 text-white placeholder-stone-500 focus:border-amber-500"
            placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
          <Input
            className="bg-stone-800 border-stone-700 text-white placeholder-stone-500 focus:border-amber-500"
            placeholder="Password" type="password" value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
          {err && <div className="text-red-400 text-xs">{err}</div>}
          <Button className="w-full py-3 bg-gradient-to-r from-amber-500 to-red-500 hover:opacity-90" onClick={login}>
            Entrar
          </Button>
        </div>
      </div>
    </div>
  )
}
