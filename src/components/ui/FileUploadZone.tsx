import { useRef, useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/utils'
import type { UploadedFile } from '@/types'
import { toast } from 'sonner'

interface FileUploadZoneProps {
  accept?: string[]
  maxSizeMB?: number
  multiple?: boolean
  onFilesSelected: (files: File[]) => void
  uploadedFiles: UploadedFile[]
  onRemove: (fileId: string) => void
  label?: string
}

export function FileUploadZone({ accept = [], maxSizeMB = 10, multiple = false, onFilesSelected, uploadedFiles, onRemove, label }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function validate(files: FileList | null) {
    if (!files) return
    const valid: File[] = []
    Array.from(files).forEach(f => {
      if (accept.length && !accept.some(a => f.name.endsWith(a) || f.type.includes(a.replace('.', '')))) {
        toast.error(`Invalid file type: ${f.name}`)
        return
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${f.name} exceeds ${maxSizeMB}MB limit`)
        return
      }
      valid.push(f)
    })
    if (valid.length) onFilesSelected(valid)
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); validate(e.dataTransfer.files) }}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}>
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Drag & drop or click to browse</p>
        {accept.length > 0 && <p className="text-xs text-muted-foreground mt-1">{accept.join(', ')} · Max {maxSizeMB}MB</p>}
        <input ref={inputRef} type="file" className="hidden" multiple={multiple}
          accept={accept.join(',')} onChange={e => validate(e.target.files)} />
      </div>
      {uploadedFiles.length > 0 && (
        <ul className="space-y-1">
          {uploadedFiles.map(f => (
            <li key={f.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-foreground">{f.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">{formatFileSize(f.size)}</span>
              <button onClick={() => onRemove(f.id)} aria-label="Remove file" className="p-0.5 hover:text-destructive text-muted-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
