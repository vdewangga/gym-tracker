import { Plan, Template, WorkoutSession } from "./types";

const STORAGE_KEYS = {
  templates: "gym-tracker-templates",
  plans: "gym-tracker-plans",
  sessions: "gym-tracker-sessions",
} as const;

const isBrowser = typeof window !== "undefined";

const readJson = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Gym Tracker localStorage parse failed", key, error);
    return fallback;
  }
};

const writeJson = <T>(key: string, value: T) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadTemplates = (): Template[] =>
  readJson<Template[]>(STORAGE_KEYS.templates, []);

export const persistTemplates = (templates: Template[]) =>
  writeJson(STORAGE_KEYS.templates, templates);

export const loadPlans = (): Plan[] => readJson<Plan[]>(STORAGE_KEYS.plans, []);

export const persistPlans = (plans: Plan[]) => writeJson(STORAGE_KEYS.plans, plans);

export const loadSessions = (): WorkoutSession[] =>
  readJson<WorkoutSession[]>(STORAGE_KEYS.sessions, []);

export const persistSessions = (sessions: WorkoutSession[]) =>
  writeJson(STORAGE_KEYS.sessions, sessions);
