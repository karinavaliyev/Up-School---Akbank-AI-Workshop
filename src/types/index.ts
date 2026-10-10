export type CandidateLevel = 'Stajyer (Üniversite Öğrencisi)' | 'Yeni Mezun / Junior';

export interface InterviewQuestion {
  id: string;
  category: string;
  categoryBadge: string;
  questionText: string;
  interviewerIntent: string;
  whatToHighlight: string[];
  starAdvice: string;
  sampleGoodResponse: string;
  commonPitfalls: string;
}

export interface InterviewGenerationResponse {
  interviewerMindsetSummary: string;
  interviewerPriorities: string[];
  questions: InterviewQuestion[];
}

export interface StarAnalysis {
  situationTask: string;
  action: string;
  resultImpact: string;
}

export interface EvaluationResult {
  score: number;
  verdict: string;
  executiveSummary: string;
  starAnalysis: StarAnalysis;
  strengths: string[];
  areasForImprovement: string[];
  rephrasedIdealAnswer: string;
  coachTip: string;
}

export interface PracticeSessionRecord {
  id: string;
  timestamp: string;
  questionText: string;
  interviewerTitle: string;
  userAnswer: string;
  evaluation: EvaluationResult;
}

export interface TrainingItem {
  id: string;
  title: string;
  provider: string;
  topicsCovered: string;
  duration?: string;
  skillsGained?: string;
}

export interface SkillGap {
  skillName: string;
  severity: string;
  gapReason: string;
  interviewRisk: string;
}

export interface RecommendedNextTraining {
  stepNumber: number;
  trainingTitle: string;
  targetCompetency: string;
  estimatedWeeks: string;
  syllabusTopics: string[];
  recommendedPlatformsOrResources: string[];
  capstoneProjectIdea: string;
}

export interface CurrentLevelAssessment {
  levelBadge: string;
  levelPercentage: number;
  profileSummary: string;
  validatedSkills: string[];
}

export interface CareerRoadmapResponse {
  currentLevelAssessment: CurrentLevelAssessment;
  skillGaps: SkillGap[];
  recommendedNextTrainings: RecommendedNextTraining[];
  careerCoachAdvice: string;
}
