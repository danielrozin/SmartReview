"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { getActiveExperiments } from "./config";
import type { ExperimentAssignments, ExperimentConfig } from "./types";
import { trackEvent } from "@/lib/tracking/analytics";

const COOKIE_NAME = "ab_experiments";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

function parseCookie(raw: string): ExperimentAssignments {
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return {};
  }
}

function readCookieClient(): ExperimentAssignments {
  if (typeof document === "undefined") return {};
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  return match ? parseCookie(match[1]) : {};
}

function writeCookie(assignments: ExperimentAssignments) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(assignments));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  const key = "ab_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function assignVariant(
  experiment: ExperimentConfig,
  existing: ExperimentAssignments
): ExperimentAssignments {
  if (existing[experiment.id]) return existing;

  const visitorId = getVisitorId();
  const bucket = hashString(experiment.id + visitorId) % 100;
  if (bucket >= experiment.trafficPercent) return existing;

  const variantIndex =
    hashString(visitorId + experiment.id) % experiment.variants.length;

  return {
    ...existing,
    [experiment.id]: {
      variant: experiment.variants[variantIndex],
      assignedAt: Date.now(),
    },
  };
}

function resolveAssignments(
  initial: ExperimentAssignments
): ExperimentAssignments {
  const active = getActiveExperiments();
  let assignments = { ...initial };
  for (const exp of active) {
    assignments = assignVariant(exp, assignments);
  }
  return assignments;
}

const ExperimentContext = createContext<ExperimentAssignments>({});

interface ExperimentProviderProps {
  children: ReactNode;
}

export function ExperimentProvider({ children }: ExperimentProviderProps) {
  const clientAssignments = useMemo(
    () => resolveAssignments(readCookieClient()),
    []
  );

  const firedRef = useRef(false);
  useEffect(() => {
    writeCookie(clientAssignments);

    if (firedRef.current) return;
    firedRef.current = true;

    const active = getActiveExperiments();
    for (const exp of active) {
      const assignment = clientAssignments[exp.id];
      if (assignment) {
        trackEvent("experiment_view", {
          experiment_id: exp.id,
          experiment_name: exp.name,
          variant: assignment.variant,
        });
      }
    }
  }, [clientAssignments]);

  return (
    <ExperimentContext.Provider value={clientAssignments}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment(experimentId: string): {
  variant: string;
  isActive: boolean;
} {
  const assignments = useContext(ExperimentContext);
  const assignment = assignments[experimentId];

  if (!assignment) {
    return { variant: "control", isActive: false };
  }

  return { variant: assignment.variant, isActive: true };
}
