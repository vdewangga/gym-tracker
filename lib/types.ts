export type TemplateCategory = "upper" | "lower" | "custom";

export interface ExerciseItem {
  id: string;
  name: string;
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  exercises: ExerciseItem[];
}

export interface PlanDay {
  index: number;
  type: "workout" | "rest";
  templateId?: string;
}

export interface Plan {
  id: string;
  name: string;
  daysPerWeek: number;
  week: PlanDay[];
  isActive: boolean;
  createdAt: string;
}

export interface WorkoutItem {
  exerciseId: string;
  name: string;
  done: boolean;
  note?: string;
  weight?: number;
  reps?: number;
  sets?: number;
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD
  planId?: string;
  templateId: string;
  items: WorkoutItem[];
  status: "in_progress" | "done";
}
