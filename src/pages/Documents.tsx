import { useState, useEffect } from "react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Card, CardContent } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { FileText, Download, Search, FileCode, BookOpen, File } from "lucide-react"

interface Document {
  id: string
  name: string
  filename: string
  size: number
  type: string
  created_at: string
  url: string
  category: string
}

// Documents hardcoded from Supabase Storage (public bucket)
// TODO: Move to database table when migration is run
const STATIC_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Mission Control Skill",
    filename: "mission-control-skill.md",
    size: 28626,
    type: "markdown",
    created_at: "2026-03-09T10:57:00Z",
    url: "https://zyyebbeqofkhsanhwerk.supabase.co/storage/v1/object/public/documents/mission-control-skill.md",
    category: "skills"
  },
  {
    id: "2",
    name: "SKILL.md",
    filename: "SKILL.md",
    size: 28626,
    type: "markdown",
    created_at: "2026-03-08T18:00:00Z",
    url: "https://zyyebbeqofkhsanhwerk.supabase.co/storage/v1/object/public/documents/SKILL.md",
    category: "skills"
  },
  {
    id: "3",
    name: "AGENTS.md",
    filename: "AGENTS.md",
    size: 7569,
    type: "markdown",
    created_at: "2026-03-08T18:00:00Z",
    url: "https://zyyebbeqofkhsanhwerk.supabase.co/storage/v1/object/public/documents/AGENTS.md",
    category: "docs"
  },
  {
    id: "4",
    name: "SOUL.md",
    filename: "SOUL.md",
    size: 9007,
    type: "markdown",
    created_at: "2026-03-08T18:00:00Z",
    url: "https://zyyebbeqofkhsanhwerk.supabase.co/storage/v1/object/public/documents/SOUL.md",
    category: "docs"
  },
  {
    id: "5",
    name: "Estado Completo CRM",
    filename: "ESTADO_COMPLETO_CRM_LEARNINGS.md",
    size: 6116,
    type: "markdown",
    created_at: "2026-03-08T18:00:00Z",
    url: "https://zyyebbeqofkhsanhwerk.supabase.co/storage/v1/object/public/documents/ESTADO_COMPLETO_CRM_LEARNINGS.md",
    category: "docs"
  },
  {
    id: "6",
    name: "Estrategia Outreach Escalable",
    filename: "estrategia-outreach-escalable.md",
    size: 5158,
    type: "markdown",
    created_at: "2026-03-08T18:00:00Z",
    url: "https://zyyebbeqofkhsanhwerk.supabase.co/storage/v1/object/public/documents/estrategia-outreach-escalable.md",
    category: "strategy"
  },
  {
    id: "7",
    name: "LinkedIn Growth Strategy v2",
    filename: "linkedin-growth-strategy-v2.md",
    size: 4689,
    type: "markdown",
    created_at: "2026-03-08T18:00:00Z",
    url: "https://zyyebbeqofkhsanhwerk.supabase.co/storage/v1/object/public/documents/linkedin-growth-strategy-v2.md",
    category: "strategy"
  },
  {
    id: "8",
    name: "LinkedIn Growth Strategy",
    filename: "linkedin-growth-strategy.md",
    size: 1807,
    type: "markdown",
    created_at: "2026-03-08T18:00:00Z",
    url: "https://zyyebbeqofkhsanhwerk.supabase.co/storage/v1/object/public/documents/linkedin-growth-strategy.md",
    category: "strategy"
  }
]

export function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    // Simulate loading from API
    setTimeout(() => {
      setDocuments(STATIC_DOCUMENTS)
      setLoading(false)
    }, 500)
  }, [])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'markdown':
      case 'text': return <BookOpen className="w-5 h-5 text-blue-600" />
      case 'json':
      case 'yaml':
      case 'sql': return <FileCode className="w-5 h-5 text-purple-600" />
      case 'python':
      case 'code': return <FileCode className="w-5 h-5 text-amber-600" />
      default: return <File className="w-5 h-5 text-stone-500" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      console.error('Download error:', e)
      window.open(url, '_blank')
    }
  }

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Documentos</h1>
          <p className="text-stone-500 text-sm mt-1">Skills, guías y recursos descargables</p>
        </div>
        <div className="text-sm text-stone-500">
          {documents.length} archivos disponibles
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <Input 
          placeholder="Buscar documentos..." 
          className="pl-10"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      {/* Documents List */}
      <Card>
        <div className="divide-y divide-stone-50">
          {loading ? (
            <div className="px-5 py-8 text-center text-stone-400">Cargando documentos...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="px-5 py-12 text-center text-stone-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-stone-300" />
              <p>No hay documentos</p>
            </div>
          ) : (
            filteredDocs.map(doc => (
              <div key={doc.id} className="px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(doc.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900">{doc.name}</span>
                      <Badge value={doc.category} />
                    </div>
                    <div className="text-sm text-stone-500">
                      {formatFileSize(doc.size)} • {formatDate(doc.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => downloadFile(doc.url, doc.filename)}
                    className="text-stone-400 hover:text-stone-700"
                    title="Descargar"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Instructions */}
      <div className="text-sm text-stone-500 bg-stone-50 p-4 rounded-lg">
        <strong>Nota:</strong> Para agregar más documentos, contactá a Kimi o subí los archivos directamente al bucket 
        <code className="bg-stone-200 px-1 rounded">documents</code> en Supabase Storage.
      </div>
    </div>
  )
}
