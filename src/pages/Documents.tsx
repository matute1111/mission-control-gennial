import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Card, CardContent } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { Dialog, DialogTitle } from "@/components/Dialog"
import { FileText, Download, Upload, Trash2, Search, FileCode, BookOpen, File } from "lucide-react"

interface Document {
  id: string
  name: string
  size: number
  type: string
  created_at: string
  url: string
}

export function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const BUCKET_NAME = "documents"

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      // List files from bucket
      const { data: files, error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list('', {
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) {
        console.error('Error fetching documents:', error)
        setLoading(false)
        return
      }
      
      console.log('Files from bucket:', files)

      // Get public URLs for each file
      const docs: Document[] = files
        .filter(file => file.name && !file.name.endsWith('/')) // Filter out folders
        .map(file => {
          const { data: { publicUrl } } = supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(file.name)
          
          return {
            id: file.id,
            name: file.name,
            size: file.metadata?.size || 0,
            type: getFileType(file.name),
            created_at: file.created_at || new Date().toISOString(),
            url: publicUrl
          }
        })

      setDocuments(docs)
    } catch (e) {
      console.error('Error:', e)
    }
    setLoading(false)
  }

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'md': return 'markdown'
      case 'txt': return 'text'
      case 'json': return 'json'
      case 'sql': return 'sql'
      case 'yaml':
      case 'yml': return 'yaml'
      case 'py': return 'python'
      case 'js':
      case 'ts':
      case 'tsx': return 'code'
      default: return 'file'
    }
  }

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const uploadFile = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const { error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .upload(selectedFile.name, selectedFile, {
          upsert: true
        })

      if (error) {
        console.error('Upload error:', error)
        alert('Error al subir: ' + error.message)
      } else {
        setShowUpload(false)
        setSelectedFile(null)
        fetchDocuments()
      }
    } catch (e) {
      console.error('Error:', e)
    }
    setUploading(false)
  }

  const downloadFile = async (url: string, filename: string) => {
    try {
      // Fetch the file content first (to handle CORS)
      const response = await fetch(url)
      const blob = await response.blob()
      
      // Create a blob URL and download
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      console.error('Download error:', e)
      // Fallback: open in new tab
      window.open(url, '_blank')
    }
  }

  const deleteFile = async (filename: string) => {
    if (!confirm(`¿Eliminar ${filename}?`)) return

    try {
      const { error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .remove([filename])

      if (error) {
        console.error('Delete error:', error)
        alert('Error al eliminar: ' + error.message)
      } else {
        fetchDocuments()
      }
    } catch (e) {
      console.error('Error:', e)
    }
  }

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Documentos</h1>
          <p className="text-stone-500 text-sm mt-1">Skills, guías y recursos descargables</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Subir Documento
        </Button>
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
              <p className="text-sm text-stone-400 mt-1">Subí tu primer archivo</p>
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
                      <Badge value={doc.type} />
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
                    onClick={() => downloadFile(doc.url, doc.name)}
                    className="text-stone-400 hover:text-stone-700"
                    title="Descargar"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteFile(doc.name)}
                    className="text-stone-400 hover:text-red-600"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onClose={() => { setShowUpload(false); setSelectedFile(null); }}>
        <DialogTitle>Subir Documento</DialogTitle>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-stone-200 rounded-lg p-8 text-center hover:border-amber-300 transition">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept=".md,.txt,.json,.sql,.yaml,.yml,.py,.js,.ts,.tsx"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-3 text-stone-400" />
              <p className="text-sm text-stone-600">
                {selectedFile ? selectedFile.name : 'Arrastrá un archivo o hacé click para seleccionar'}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                MD, TXT, JSON, SQL, YAML, PY, JS, TS
              </p>
            </label>
          </div>
          
          {selectedFile && (
            <div className="text-sm text-stone-600 bg-stone-50 p-3 rounded">
              <strong>Archivo:</strong> {selectedFile.name}<br />
              <strong>Tamaño:</strong> {formatFileSize(selectedFile.size)}
            </div>
          )}
          
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => { setShowUpload(false); setSelectedFile(null); }}>
              Cancelar
            </Button>
            <Button 
              onClick={uploadFile}
              disabled={!selectedFile || uploading}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {uploading ? 'Subiendo...' : 'Subir'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
