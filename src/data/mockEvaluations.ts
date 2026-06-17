import type { Evaluation } from '@/types'

export const mockEvaluations: Evaluation[] = [
  {
    id: 'eval-1',
    projectId: 'proj-1',
    overallScore: 84,
    grade: 'B+',
    categoryScores: [
      { category: 'Innovation', score: 82, maxScore: 100, comment: 'Novel approach to traffic optimization' },
      { category: 'Code Quality', score: 88, maxScore: 100, comment: 'Well-structured, modular code' },
      { category: 'Documentation', score: 80, maxScore: 100, comment: 'Good documentation, some gaps' },
      { category: 'Presentation', score: 85, maxScore: 100, comment: 'Clear and engaging presentation' },
      { category: 'Technical Implementation', score: 87, maxScore: 100, comment: 'YOLO integration impressive' },
      { category: 'Scalability', score: 78, maxScore: 100, comment: 'Can be improved for larger datasets' },
      { category: 'Security', score: 82, maxScore: 100, comment: 'Basic security measures in place' },
      { category: 'Impact', score: 90, maxScore: 100, comment: 'High potential real-world impact' },
    ],
    aiFeedback: {
      overallComment:
        'A well-implemented deep learning project demonstrating strong technical skills and real-world applicability. The system shows promise with its YOLO-based detection pipeline.',
      strengths: [
        'Strong technical implementation with YOLO v8 integration',
        'Clean, well-organized codebase with modular architecture',
        'Well-documented API endpoints and model pipeline',
        'Impressive real-world impact potential for urban traffic',
      ],
      areasOfImprovement: [
        'Add comprehensive unit and integration tests',
        'Improve UI consistency across dashboard components',
        'Optimize API call frequency to reduce latency',
        'Add edge case handling for low-light conditions',
      ],
      suggestions: [
        'Deploy on cloud platform (AWS/GCP) for scalability',
        'Implement CI/CD pipeline with GitHub Actions',
        'Add real-time data streaming with WebSockets',
        'Consider federated learning for privacy-preserving updates',
      ],
    },
    evaluatedAt: '2024-02-20T14:00:00Z',
    evaluatedBy: 'user-3',
  },
  {
    id: 'eval-2',
    projectId: 'proj-2',
    overallScore: 91,
    grade: 'A',
    categoryScores: [
      { category: 'Innovation', score: 90, maxScore: 100 },
      { category: 'Code Quality', score: 95, maxScore: 100 },
      { category: 'Documentation', score: 92, maxScore: 100 },
      { category: 'Presentation', score: 88, maxScore: 100 },
      { category: 'Technical Implementation', score: 93, maxScore: 100 },
      { category: 'Scalability', score: 88, maxScore: 100 },
      { category: 'Security', score: 90, maxScore: 100 },
      { category: 'Impact', score: 92, maxScore: 100 },
    ],
    aiFeedback: {
      overallComment:
        'Excellent NLP project with state-of-the-art BERT fine-tuning. The multi-language support and high accuracy demonstrate deep understanding of transformer architectures.',
      strengths: [
        'State-of-the-art BERT fine-tuning implementation',
        'Multi-language support (5 languages)',
        'Excellent code quality with type annotations',
        'Comprehensive documentation with usage examples',
      ],
      areasOfImprovement: [
        'Model inference speed could be optimized',
        'Add support for more languages',
        'Consider lighter model variants for production',
      ],
      suggestions: [
        'Publish model on HuggingFace Hub',
        'Add a REST API wrapper for easy integration',
        'Benchmark against other SOTA models',
      ],
    },
    evaluatedAt: '2024-02-05T11:00:00Z',
    evaluatedBy: 'user-3',
  },
  {
    id: 'eval-3',
    projectId: 'proj-6',
    overallScore: 76,
    grade: 'B-',
    categoryScores: [
      { category: 'Innovation', score: 74, maxScore: 100 },
      { category: 'Code Quality', score: 78, maxScore: 100 },
      { category: 'Documentation', score: 72, maxScore: 100 },
      { category: 'Presentation', score: 80, maxScore: 100 },
      { category: 'Technical Implementation', score: 77, maxScore: 100 },
      { category: 'Scalability', score: 75, maxScore: 100 },
      { category: 'Security', score: 70, maxScore: 100 },
      { category: 'Impact', score: 82, maxScore: 100 },
    ],
    aiFeedback: {
      overallComment:
        'A functional RAG-based chatbot with good user experience. Core functionality works well but needs improvements in security and documentation.',
      strengths: [
        'Good RAG pipeline implementation',
        'User-friendly chat interface',
        'Effective context retrieval',
      ],
      areasOfImprovement: [
        'Improve input sanitization and security',
        'Add more detailed API documentation',
        'Handle edge cases in retrieval pipeline',
      ],
      suggestions: [
        'Add rate limiting and authentication',
        'Implement conversation history persistence',
        'Consider adding voice input support',
      ],
    },
    evaluatedAt: '2024-01-28T15:00:00Z',
    evaluatedBy: 'user-3',
  },
  {
    id: 'eval-4',
    projectId: 'proj-7',
    overallScore: 88,
    grade: 'A-',
    categoryScores: [
      { category: 'Innovation', score: 92, maxScore: 100 },
      { category: 'Code Quality', score: 90, maxScore: 100 },
      { category: 'Documentation', score: 85, maxScore: 100 },
      { category: 'Presentation', score: 84, maxScore: 100 },
      { category: 'Technical Implementation', score: 91, maxScore: 100 },
      { category: 'Scalability', score: 86, maxScore: 100 },
      { category: 'Security', score: 90, maxScore: 100 },
      { category: 'Impact', score: 88, maxScore: 100 },
    ],
    aiFeedback: {
      overallComment:
        'Highly innovative federated learning implementation with strong privacy guarantees. Demonstrates excellent understanding of distributed ML.',
      strengths: [
        'Novel privacy-preserving approach',
        'Strong security and encryption implementation',
        'Clear architectural design',
        'Excellent technical depth',
      ],
      areasOfImprovement: [
        'Improve presentation slides layout',
        'Add more ablation studies',
        'Benchmark against centralized training',
      ],
      suggestions: [
        'Submit to a ML conference',
        'Open source the framework',
        'Add differential privacy guarantees',
      ],
    },
    evaluatedAt: '2024-03-01T10:00:00Z',
    evaluatedBy: 'user-2',
  },
  {
    id: 'eval-5',
    projectId: 'proj-8',
    overallScore: 95,
    grade: 'A+',
    categoryScores: [
      { category: 'Innovation', score: 96, maxScore: 100 },
      { category: 'Code Quality', score: 94, maxScore: 100 },
      { category: 'Documentation', score: 96, maxScore: 100 },
      { category: 'Presentation', score: 95, maxScore: 100 },
      { category: 'Technical Implementation', score: 97, maxScore: 100 },
      { category: 'Scalability', score: 92, maxScore: 100 },
      { category: 'Security', score: 94, maxScore: 100 },
      { category: 'Impact', score: 98, maxScore: 100 },
    ],
    aiFeedback: {
      overallComment:
        'Outstanding project with exceptional technical quality and societal impact. The real-time sign language recognition system achieves near-human accuracy.',
      strengths: [
        'Exceptional real-time performance (<50ms latency)',
        'High accuracy (96%) across 26 ASL gestures',
        'Beautifully documented with video demos',
        'Strong accessibility and societal impact',
        'Clean, production-ready code',
      ],
      areasOfImprovement: [
        'Expand to full sentence recognition',
        'Add mobile app support',
      ],
      suggestions: [
        'Partner with accessibility organizations',
        'Apply for grants or publish research',
        'Create an open dataset for the community',
      ],
    },
    evaluatedAt: '2024-03-10T14:00:00Z',
    evaluatedBy: 'user-3',
  },
]
