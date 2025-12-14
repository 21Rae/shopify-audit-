export interface AuditSection {
  title: string;
  score: number;
  details: string[];
  status: 'good' | 'warning' | 'critical';
}

export interface AuditResult {
  url: string;
  overallScore: number;
  summary: string;
  sections: AuditSection[];
  recommendations: string[];
}

export interface LoadingStep {
  message: string;
  active: boolean;
}
