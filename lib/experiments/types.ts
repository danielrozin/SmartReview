export interface ExperimentConfig {
  id: string;
  name: string;
  variants: string[];
  trafficPercent: number;
  startDate: string;
  endDate: string;
  goalMetric: string;
}

export interface ExperimentAssignment {
  variant: string;
  assignedAt: number;
}

export type ExperimentAssignments = Record<string, ExperimentAssignment>;
