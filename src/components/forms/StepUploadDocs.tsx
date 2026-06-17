import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileUploadZone } from '@/components/ui/FileUploadZone'
import type { StepProps } from './MultiStepForm'
import type { UploadedFile } from '@/types'

let _id = 0
const mkId = () => `file-${++_id}`

export function StepUploadDocs({ onNext, onBack }: StepProps) {
  const [reportFiles, setReportFiles] = useState<UploadedFile[]>([])
  const [pptFiles, setPptFiles] = useState<UploadedFile[]>([])
  const [additionalFiles, setAdditionalFiles] = useState<UploadedFile[]>([])

  function toUploaded(files: File[]): UploadedFile[] {
    return files.map(f => ({ id: mkId(), name: f.name, size: f.size, type: f.type, status: 'done', file: f }))
  }

  function handleNext() {
    onNext({
      reportFile: reportFiles[0]?.file,
      presentationFile: pptFiles[0]?.file,
      additionalFiles: additionalFiles.map(f => f.file!).filter(Boolean),
    })
  }

  return (
    <div className="space-y-6">
      <FileUploadZone label="Project Report (PDF, max 10MB)" accept={['.pdf']} maxSizeMB={10}
        onFilesSelected={f => setReportFiles(toUploaded(f).slice(0, 1))}
        uploadedFiles={reportFiles} onRemove={id => setReportFiles([])} />
      <FileUploadZone label="Presentation (PDF/PPTX, max 20MB)" accept={['.pdf', '.pptx']} maxSizeMB={20}
        onFilesSelected={f => setPptFiles(toUploaded(f).slice(0, 1))}
        uploadedFiles={pptFiles} onRemove={() => setPptFiles([])} />
      <FileUploadZone label="Additional Documents (max 5 files, 10MB each)" accept={[]} maxSizeMB={10} multiple
        onFilesSelected={f => setAdditionalFiles(prev => [...prev, ...toUploaded(f)].slice(0, 5))}
        uploadedFiles={additionalFiles} onRemove={id => setAdditionalFiles(prev => prev.filter(f => f.id !== id))} />
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button type="button" onClick={handleNext}>Next →</Button>
      </div>
    </div>
  )
}
