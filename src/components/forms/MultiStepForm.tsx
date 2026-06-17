import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProjectFormData } from '@/types'

export interface StepProps {
  onNext: (data: Partial<ProjectFormData>) => void
  onBack: () => void
  defaultValues?: Partial<ProjectFormData>
}

interface Step {
  id: number
  title: string
  component: React.ComponentType<StepProps>
}

interface MultiStepFormProps {
  steps: Step[]
  onSubmit: (data: ProjectFormData) => Promise<void>
}

export function MultiStepForm({ steps, onSubmit }: MultiStepFormProps) {
  const [current, setCurrent] = useState(0)
  const [formData, setFormData] = useState<Partial<ProjectFormData>>({})

  function handleNext(data: Partial<ProjectFormData>) {
    const merged = { ...formData, ...data }
    setFormData(merged)
    if (current < steps.length - 1) setCurrent(c => c + 1)
    else onSubmit(merged as ProjectFormData)
  }

  function handleBack() {
    if (current > 0) setCurrent(c => c - 1)
  }

  const StepComponent = steps[current].component

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => i < current && setCurrent(i)}
              className={cn('flex items-center gap-2 text-sm font-medium transition-colors', i < current ? 'cursor-pointer' : 'cursor-default')}
            >
              <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                i < current ? 'bg-primary text-primary-foreground' :
                i === current ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                'bg-muted text-muted-foreground')}>
                {i < current ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn('hidden sm:block text-sm', i === current ? 'text-foreground font-semibold' : i < current ? 'text-primary' : 'text-muted-foreground')}>
                {step.title}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-3', i < current ? 'bg-primary' : 'bg-muted')} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <StepComponent onNext={handleNext} onBack={handleBack} defaultValues={formData} />
    </div>
  )
}
