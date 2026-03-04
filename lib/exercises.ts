import workoutData from "@/const/workout.json";

export interface ExerciseCatalogEntry {
  name: string;
  targetMuscles: string[];
  description: string;
  videoList: string[];
  tags: string[];
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const catalog: ExerciseCatalogEntry[] = workoutData;

export const getExerciseBySlug = (slug?: string) =>
  catalog.find((entry) => {
    // console.log({entry: entry.name, slug})
    return slugify(entry.name) === slug
  });

export const getExerciseSlug = (name: string) => slugify(name);

export const findAlternatives = (exercise: ExerciseCatalogEntry) => {
  const sharedTargets = new Set(exercise.targetMuscles.map((target) => target.toLowerCase()));
  return catalog.filter((candidate) => {
    if (candidate.name === exercise.name) return false;
    if (!candidate.tags.includes("upper")) return false;
    return candidate.targetMuscles.some((target) =>
      sharedTargets.has(target.toLowerCase()),
    );
  });
};
