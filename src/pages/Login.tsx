import { useState } from "react"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { supabase } from "@/lib/supabase"
import type { User } from "@/types"

interface LoginProps { onLogin: (u: User) => void }

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!email.trim() || !pass.trim()) {
      setErr("Ingresá email y contraseña")
      return
    }
    
    setLoading(true)
    setErr("")
    
    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass
      })
      
      if (authError) {
        setErr("Credenciales incorrectas")
        setLoading(false)
        return
      }
      
      if (!authData.user) {
        setErr("Error de autenticación")
        setLoading(false)
        return
      }
      
      // 2. Check if user exists in org_users and is active
      const { data: orgUser, error: orgError } = await supabase
        .from('org_users')
        .select('*')
        .eq('id', authData.user.id)
        .eq('status', 'active')
        .is('archived_at', null)
        .single()
      
      if (orgError || !orgUser) {
        // User not in org_users or not active
        await supabase.auth.signOut()
        setErr("Usuario no autorizado. Contactá al administrador.")
        setLoading(false)
        return
      }
      
      // 3. Update last login
      await supabase
        .from('org_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', orgUser.id)
      
      // 4. Login successful
      onLogin({
        id: orgUser.id,
        email: orgUser.email,
        name: orgUser.name,
        role: orgUser.role,
        status: orgUser.status,
        department: orgUser.department,
        phone: orgUser.phone
      })
      
    } catch (e) {
      console.error('Login error:', e)
      setErr("Error de conexión. Intentá de nuevo.")
    } finally {
      setLoading(false)
    }
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
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            disabled={loading}
          />
          <Input
            className="bg-stone-800 border-stone-700 text-white placeholder-stone-500 focus:border-amber-500"
            placeholder="Password"
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            disabled={loading}
          />
          
          {err && <div className="text-red-400 text-xs bg-red-900/30 p-2 rounded">{err}</div>}
          
          <Button 
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-red-500 hover:opacity-90 disabled:opacity-50" 
            onClick={login}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>
        
        <div className="mt-6 text-center text-xs text-stone-500">
          Acceso exclusivo para miembros de Gennial Studios
        </div>
      </div>
    </div>
  )
}
