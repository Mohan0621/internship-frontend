import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as Dialog from '@radix-ui/react-dialog'
import type { StepProps } from './MultiStepForm'

export function StepReviewSubmit({ onNext, onBack, defaultValues }: StepProps) {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const d = defaultValues ?? {}

  function handleDraft() {
    toast.success('Draft saved! You can continue later.')
  }

  async function handleSubmit() {
    setSubmitting(true)
    await onNext(d)
    setSubmitting(false)
    setSuccessOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-sm">Step 1 – Basic Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-muted-foreground">Title:</span> <span className="font-medium">{d.title || '—'}</span></div>
          <div><span className="text-muted-foreground">Team:</span> <span className="font-medium">{d.teamName || '—'}</span></div>
          <div><span className="text-muted-foreground">Domain:</span> <span className="font-medium">{d.domain || '—'}</span></div>
          {d.description && <div className="col-span-2"><span className="text-muted-foreground">Description:</span> <span className="font-medium">{d.description}</span></div>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm">Step 2 – Project Links</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-sm">
          {d.githubUrl && <div><span className="text-muted-foreground">GitHub:</span> <a href={d.githubUrl} className="text-primary hover:underline">{d.githubUrl}</a></div>}
          {d.demoVideoUrl && <div><span className="text-muted-foreground">Demo:</span> <a href={d.demoVideoUrl} className="text-primary hover:underline">{d.demoVideoUrl}</a></div>}
          {d.deployedUrl && <div><span className="text-muted-foreground">Live:</span> <a href={d.deployedUrl} className="text-primary hover:underline">{d.deployedUrl}</a></div>}
          {!d.githubUrl && !d.demoVideoUrl && !d.deployedUrl && <p className="text-muted-foreground">No links provided</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm">Step 3 – Documents</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1">
          <p className="text-muted-foreground">Report: {d.reportFile ? d.reportFile.name : 'Not uploaded'}</p>
          <p className="text-muted-foreground">Presentation: {d.presentationFile ? d.presentationFile.name : 'Not uploaded'}</p>
          <p className="text-muted-foreground">Additional: {d.additionalFiles?.length ? `${d.additionalFiles.length} file(s)` : 'None'}</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleDraft}>Save Draft</Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Project'}</Button>
        </div>
      </div>

      <Dialog.Root open={successOpen} onOpenChange={setSuccessOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-sm z-50 text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <Dialog.Title className="text-lg font-bold text-foreground">Project Submitted!</Dialog.Title>
            <p className="text-sm text-muted-foreground">Your project has been submitted successfully. You'll be notified when it's evaluated.</p>
            <Button className="w-full" onClick={() => { setSuccessOpen(false); navigate('/projects') }}>View My Projects</Button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
