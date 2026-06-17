import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { submitProject } from '@/data'
import { MultiStepForm } from '@/components/forms/MultiStepForm'
import { StepBasicDetails } from '@/components/forms/StepBasicDetails'
import { StepProjectLinks } from '@/components/forms/StepProjectLinks'
import { StepUploadDocs } from '@/components/forms/StepUploadDocs'
import { StepReviewSubmit } from '@/components/forms/StepReviewSubmit'
import type { ProjectFormData } from '@/types'

const steps = [
  { id: 1, title: 'Basic Details', component: StepBasicDetails },
  { id: 2, title: 'Project Links', component: StepProjectLinks },
  { id: 3, title: 'Upload Docs', component: StepUploadDocs },
  { id: 4, title: 'Review & Submit', component: StepReviewSubmit },
]

export default function SubmitProjectPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(data: ProjectFormData) {
    if (!user?.id) return
    await submitProject(data, user.id)
    toast.success('Project submitted successfully!')
    navigate('/projects')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Submit Project</h2>
        <p className="text-muted-foreground text-sm mt-1">Fill out the form to submit your project for evaluation</p>
      </div>
      <MultiStepForm steps={steps} onSubmit={handleSubmit} />
    </div>
  )
}
