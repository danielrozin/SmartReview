import { ExperimentConfig } from "./types";

export const experiments: ExperimentConfig[] = [
  {
    id: "review-form-placement",
    name: "Review Form Placement",
    variants: ["control", "above-fold"],
    trafficPercent: 100,
    startDate: "2026-04-15",
    endDate: "2026-05-15",
    goalMetric: "review_submitted",
  },
  {
    id: "social-proof-badges",
    name: "Social Proof Badges",
    variants: ["control", "treatment"],
    trafficPercent: 100,
    startDate: "2026-04-15",
    endDate: "2026-05-15",
    goalMetric: "product_viewed",
  },
];

export function getActiveExperiments(): ExperimentConfig[] {
  const now = new Date();
  return experiments.filter((exp) => {
    const start = new Date(exp.startDate);
    const end = new Date(exp.endDate);
    return now >= start && now <= end;
  });
}

export function getExperimentById(id: string): ExperimentConfig | undefined {
  return experiments.find((exp) => exp.id === id);
}
