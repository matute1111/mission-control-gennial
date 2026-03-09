import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Badge } from "@/components/Badge"
import { Card, CardContent } from "@/components/Card"
import { Dialog, DialogTitle } from "@/components/Dialog"
import type { User as OrgUser } from "@/types"
import { 
  Users, 
  Plus, 
  Edit3, 
  Save, 
  X,
  Shield,
  User,
  Eye,
  Mail,
  Phone,
  Building
} from "lucide-react"

interface BackofficeProps {
  currentUser: OrgUser | null
}

export function Backoffice({ currentUser }: BackofficeProps) {
  const [users, setUsers] = useState<OrgUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewUser, setShowNewUser] = useState(false)
  const [editingUser, setEditingUser] = useState<OrgUser | null>(null)
  
  // Form fields
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<'admin' | 'user' | 'viewer'>('user')
  const [department, setDepartment] = useState("")
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  const isAdmin = currentUser?.role === 'admin'

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('org_users')
      .select('*')
      .is('archived_at', null)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching users:', error)
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  const createUser = async () => {
    if (!email.trim() || !name.trim()) return
    
    const { error } = await supabase
      .from('org_users')
      .insert({
        email: email.trim(),
        name: name.trim(),
        role,
        department: department.trim() || null,
        phone: phone.trim() || null,
        status
      })
    
    if (error) {
      console.error('Error creating user:', error)
      alert('Error: ' + error.message)
      return
    }
    
    resetForm()
    setShowNewUser(false)
    fetchUsers()
  }

  const updateUser = async () => {
    if (!editingUser) return
    
    const { error } = await supabase
      .from('org_users')
      .update({
        name: name.trim(),
        role,
        department: department.trim() || null,
        phone: phone.trim() || null,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingUser.id)
    
    if (error) {
      console.error('Error updating user:', error)
      alert('Error: ' + error.message)
      return
    }
    
    resetForm()
    setEditingUser(null)
    fetchUsers()
  }

  const archiveUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return
    
    await supabase.rpc('archive_record', { 
      p_table: 'org_users', 
      p_id: userId 
    })
    fetchUsers()
  }

  const resetForm = () => {
    setEmail('')
    setName('')
    setRole('user')
    setDepartment('')
    setPhone('')
    setStatus('active')
  }

  const startEdit = (user: OrgUser) => {
    setEditingUser(user)
    setEmail(user.email)
    setName(user.name)
    setRole(user.role as any)
    setDepartment(user.department || '')
    setPhone(user.phone || '')
    setStatus(user.status as any)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-purple-600" />
      case 'viewer': return <Eye className="w-4 h-4 text-stone-400" />
      default: return <User className="w-4 h-4 text-blue-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700'
      case 'viewer': return 'bg-stone-100 text-stone-600'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 mx-auto mb-4 text-stone-300" />
        <h2 className="text-xl font-semibold text-stone-900">Acceso Restringido</h2>
        <p className="text-stone-500 mt-2">Solo administradores pueden acceder al backoffice.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Backoffice</h1>
          <p className="text-stone-500 text-sm mt-1">Gestión de usuarios de la organización</p>
        </div>
        <Button onClick={() => setShowNewUser(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="text-3xl font-semibold text-stone-900">{users.length}</div>
            <div className="text-sm text-stone-500">Usuarios totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-3xl font-semibold text-purple-600">
              {users.filter(u => u?.role === 'admin').length}
            </div>
            <div className="text-sm text-stone-500">Administradores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-3xl font-semibold text-blue-600">
              {users.filter(u => u?.role === 'user').length}
            </div>
            <div className="text-sm text-stone-500">Usuarios</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-3xl font-semibold text-emerald-600">
              {users.filter(u => u?.status === 'active').length}
            </div>
            <div className="text-sm text-stone-500">Activos</div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <div className="divide-y divide-stone-50">
          {loading ? (
            <div className="px-5 py-8 text-center text-stone-400">Cargando...</div>
          ) : users.length === 0 ? (
            <div className="px-5 py-8 text-center text-stone-400">
              <Users className="w-12 h-12 mx-auto mb-4 text-stone-300" />
              <p>Sin usuarios registrados</p>
            </div>
          ) : (
            users.map(user => user && (
              <div key={user?.id || 'unknown'} className="px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 font-medium">
                    {user?.name?.[0] || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900">{user?.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(user?.role || 'user')}`}>
                        {user?.role}
                      </span>
                      <Badge value={user?.status || 'unknown'} />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user?.email}
                      </span>
                      {user?.department && (
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" /> {user.department}
                        </span>
                      )}
                      {user?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {user.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => startEdit(user)}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  {user?.id !== currentUser?.id && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => user?.id && archiveUser(user.id)}
                      className="text-stone-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* New User Dialog */}
      <Dialog open={showNewUser} onClose={() => { setShowNewUser(false); resetForm(); }}>
        <DialogTitle>Nuevo Usuario</DialogTitle>
        <div className="space-y-3">
          <Input 
            placeholder="Email *" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <Input 
            placeholder="Nombre *" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <div>
            <label className="text-xs text-stone-500">Rol</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value as any)}
              className="w-full mt-1 border border-stone-200 rounded px-3 py-2 text-sm"
            >
              <option value="user">Usuario (acceso CRM)</option>
              <option value="admin">Administrador (gestión completa)</option>
              <option value="viewer">Solo lectura</option>
            </select>
          </div>
          <Input 
            placeholder="Departamento" 
            value={department} 
            onChange={e => setDepartment(e.target.value)} 
          />
          <Input 
            placeholder="Teléfono" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
          />
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => { setShowNewUser(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button 
              onClick={createUser}
              disabled={!email.trim() || !name.trim()}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Crear Usuario
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onClose={() => { setEditingUser(null); resetForm(); }}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <div className="space-y-3">
          <div className="text-sm text-stone-500">
            Email: <span className="font-medium text-stone-900">{email}</span>
          </div>
          <Input 
            placeholder="Nombre" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <div>
            <label className="text-xs text-stone-500">Rol</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value as any)}
              className="w-full mt-1 border border-stone-200 rounded px-3 py-2 text-sm"
            >
              <option value="user">Usuario (acceso CRM)</option>
              <option value="admin">Administrador (gestión completa)</option>
              <option value="viewer">Solo lectura</option>
            </select>
          </div>
          <Input 
            placeholder="Departamento" 
            value={department} 
            onChange={e => setDepartment(e.target.value)} 
          />
          <Input 
            placeholder="Teléfono" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
          />
          <div>
            <label className="text-xs text-stone-500">Estado</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value as any)}
              className="w-full mt-1 border border-stone-200 rounded px-3 py-2 text-sm"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => { setEditingUser(null); resetForm(); }}>
              Cancelar
            </Button>
            <Button 
              onClick={updateUser}
              disabled={!name.trim()}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Save className="w-4 h-4 mr-1" />
              Guardar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
