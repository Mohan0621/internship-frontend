import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { StepProps } from './MultiStepForm'

function isValidUrl(s: string) {
  if (!s) return true
  try { new URL(s); return true } catch { return false }
}

export function StepProjectLinks({ onNext, onBack, defaultValues }: StepProps) {
  const [githubUrl, setGithubUrl] = useState(defaultValues?.githubUrl ?? '')
  const [demoVideoUrl, setDemoVideoUrl] = useState(defaultValues?.demoVideoUrl ?? '')
  const [deployedUrl, setDeployedUrl] = useState(defaultValues?.deployedUrl ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleNext() {
    const errs: Record<string, string> = {}
    if (!isValidUrl(githubUrl)) errs.githubUrl = 'Please enter a valid URL'
    if (!isValidUrl(demoVideoUrl)) errs.demoVideoUrl = 'Please enter a valid URL'
    if (!isValidUrl(deployedUrl)) errs.deployedUrl = 'Please enter a valid URL'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onNext({ githubUrl: githubUrl || undefined, demoVideoUrl: demoVideoUrl || undefined, deployedUrl: deployedUrl || undefined })
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">All links are optional. Provide whatever applies to your project.</p>
      {[
        { id: 'githubUrl', label: 'GitHub Repository URL', value: githubUrl, set: setGithubUrl, ph: 'https://github.com/...' },
        { id: 'demoVideoUrl', label: 'Demo Video URL', value: demoVideoUrl, set: setDemoVideoUrl, ph: 'https://youtube.com/...' },
        { id: 'deployedUrl', label: 'Deployed Website URL', value: deployedUrl, set: setDeployedUrl, ph: 'https://myproject.vercel.app' },
      ].map(({ id, label, value, set, ph }) => (
        <div key={id} className="space-y-1">
          <Label htmlFor={id}>{label}</Label>
          <Input id={id} placeholder={ph} value={value} onChange={e => set(e.target.value)} />
          {errors[id] && <p className="text-xs text-destructive">{errors[id]}</p>}
        </div>
      ))}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button type="button" onClick={handleNext}>Next →</Button>
      </div>
    </div>
  )
}
