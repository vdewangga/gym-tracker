## Gym Tracker

Gym Tracker is a mobile-first workout planner built with [Next.js App Router](https://nextjs.org/docs/app) and Tailwind CSS. The experience is optimized for small screens and focuses on templates → plans → workout sessions → history tracking so you can spot trends in your lifting performance.

### Key features

- **Plan + template builder** – create exercise templates (upper, lower, custom), assemble them into weekly plans, and mark one plan as active.
- **Workout sessions** – mark individual exercises as done, log sets/reps/weight, and persist everything in local storage.
- **History feed** – see all completed workouts, tap to revisit a past session, and keep your progress visible.
- **Progress insights** – a template-level chart summarizes weight/reps/sets over the last week, while an exercise drill-down chart lets you select any logged exercise (e.g., “Incline dumbbell press”) and see weight/reps/sets lines plus max stats for the past 90 days.
- **Mobile shell** – consistent header, back navigation, and tab/bottom nav layout so the app feels native on phones.

### Getting started

```bash
# install dependencies
npm install

# run in development mode (http://localhost:3000)
npm run dev

# lint the project
npm run lint

# build for production
npm run build
# then preview
npm run start
```

### Architecture notes

- **`app/page.tsx`** – entry point that renders the Today card, the workout + exercise charts, and the collapsible “Minggu ini” week overview.
- **`contexts/GymContext.tsx`** – single provider for templates, plans, and workout sessions with hydration via the lightweight `lib/storage` helpers.
- **`components/WorkoutChart.tsx`** – draws filled SVG lines for total volume/reps/sets and surfaces the latest numbers per template.
- **`components/ExerciseChart.tsx`** – exercise-aware dropdown + 90-day data window that graphs weight/reps/sets for the selected movement while showing maxes.
- **`components/DayCard.tsx` & `MobileShell`** – shared UI atoms for day summaries, CTA buttons, and shell scaffolding with bottom/tab navigation.

### Data handling

- All user data (templates, plans, sessions) is stored in the browser via `lib/storage.ts`. Hydration runs once on mount and persists any updates back to `localStorage`.
- Workout sessions contain `WorkoutItem`s with optional `weight`, `reps`, and `sets`, which are aggregated inside each chart to surface totals, maxes, and selectable exercise history.

### Next steps

1. Complete the plan/template flow to generate real sessions so the charts can render actual progress.
2. Consider integrating analytics, dark-mode, or exporting history once the core chart experience is trusted.
