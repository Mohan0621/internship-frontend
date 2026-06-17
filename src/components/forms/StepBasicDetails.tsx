import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PROJECT_DOMAINS } from '@/lib/constants'
import type { StepProps } from './MultiStepForm'
import type { ProjectDomain } from '@/types'

export function StepBasicDetails({ onNext, defaultValues }: StepProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? '')
  const [teamName, setTeamName] = useState(defaultValues?.teamName ?? '')
  const [domain, setDomain] = useState<ProjectDomain | ''>(defaultValues?.domain ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleNext() {
    const errs: Record<string, string> = {}
    if (!title || title.length < 3) errs.title = 'Title must be at least 3 characters'
    if (!teamName) errs.teamName = 'Team name is required'
    if (!domain) errs.domain = 'Please select a domain'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onNext({ title, teamName, domain: domain as ProjectDomain, description })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="title">Project Title <span className="text-destructive">*</span></Label>
        <Input id="title" placeholder="My AI Project" value={title} onChange={e => setTitle(e.target.value)} />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="teamName">Team Name <span className="text-destructive">*</span></Label>
        <Input id="teamName" placeholder="Team Alpha" value={teamName} onChange={e => setTeamName(e.target.value)} />
        {errors.teamName && <p className="text-xs text-destructive">{errors.teamName}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="domain">Domain <span className="text-destructive">*</span></Label>
        <select id="domain" value={domain} onChange={e => setDomain(e.target.value as ProjectDomain)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <option value="">Select domain...</option>
          {PROJECT_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {errors.domain && <p className="text-xs text-destructive">{errors.domain}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3}
          placeholder="Brief description of your project..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={handleNext}>Next →</Button>
      </div>
    </div>
  )
}
