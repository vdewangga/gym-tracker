"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Plan, WorkoutSession, Template } from "../lib/types";
import {
  loadPlans,
  loadSessions,
  loadTemplates,
  persistPlans,
  persistSessions,
  persistTemplates,
} from "../lib/storage";

const WEEK_PATTERNS: Record<number, ("workout" | "rest")[]> = {
  1: ["workout", "rest", "rest", "rest", "rest", "rest", "rest"],
  2: ["workout", "rest", "rest", "workout", "rest", "rest", "rest"],
  3: ["workout", "rest", "workout", "rest", "workout", "rest", "rest"],
  4: ["workout", "rest", "workout", "rest", "workout", "rest", "workout"],
  5: ["workout", "workout", "rest", "workout", "workout", "rest", "workout"],
  6: ["workout", "workout", "workout", "rest", "workout", "workout", "workout"],
  7: ["workout", "workout", "workout", "workout", "workout", "workout", "workout"],
};

interface GymState {
  templates: Template[];
  plans: Plan[];
  sessions: WorkoutSession[];
  hydrated: boolean;
}

const initialState: GymState = {
  templates: [],
  plans: [],
  sessions: [],
  hydrated: false,
};

const GymContext = createContext<
  GymState & {
    actions: {
      addTemplate: (template: Template) => void;
      updateTemplate: (template: Template) => void;
      deleteTemplate: (id: string) => void;
      addPlan: (plan: Plan) => void;
      updatePlan: (planId: string, updates: Partial<Plan>) => void;
      setActivePlan: (planId: string) => void;
      addSession: (session: WorkoutSession) => void;
      updateSession: (
        sessionId: string,
        updates: Partial<WorkoutSession>,
      ) => void;
    };
  }
>(null!);

type GymAction =
  | {
      type: "hydrate";
      payload: GymState;
    }
  | { type: "addTemplate"; payload: Template }
  | { type: "updateTemplate"; payload: Template }
  | { type: "deleteTemplate"; payload: string }
  | { type: "addPlan"; payload: Plan }
  | { type: "updatePlan"; payload: { planId: string; updates: Partial<Plan> } }
  | { type: "setActivePlan"; payload: string }
  | { type: "addSession"; payload: WorkoutSession }
  | {
      type: "updateSession";
      payload: { sessionId: string; updates: Partial<WorkoutSession> };
    };

const reducer = (state: GymState, action: GymAction): GymState => {
  switch (action.type) {
    case "hydrate":
      return { ...action.payload, hydrated: true };
    case "addTemplate":
      return { ...state, templates: [...state.templates, action.payload] };
    case "updateTemplate":
      return {
        ...state,
        templates: state.templates.map((tpl) =>
          tpl.id === action.payload.id ? action.payload : tpl,
        ),
      };
    case "deleteTemplate":
      return {
        ...state,
        templates: state.templates.filter((tpl) => tpl.id !== action.payload),
      };
    case "addPlan":
      return { ...state, plans: [...state.plans, action.payload] };
    case "updatePlan":
      return {
        ...state,
        plans: state.plans.map((plan) =>
          plan.id === action.payload.planId
            ? { ...plan, ...action.payload.updates }
            : plan,
        ),
      };
    case "setActivePlan":
      return {
        ...state,
        plans: state.plans.map((plan) => ({
          ...plan,
          isActive: plan.id === action.payload,
        })),
      };
    case "addSession":
      return { ...state, sessions: [...state.sessions, action.payload] };
    case "updateSession":
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === action.payload.sessionId
            ? { ...session, ...action.payload.updates }
            : session,
        ),
      };
    default:
      return state;
  }
};

export const generateWeekPattern = (daysPerWeek: number) => {
  const pattern = WEEK_PATTERNS[daysPerWeek];
  if (!pattern) return WEEK_PATTERNS[4];
  return pattern;
};

export const GymProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const templates = loadTemplates();
    const plans = loadPlans();
    const sessions = loadSessions();

    dispatch({
      type: "hydrate",
      payload: {
        templates,
        plans,
        sessions,
        hydrated: true,
      },
    });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    persistTemplates(state.templates);
    persistPlans(state.plans);
    persistSessions(state.sessions);
  }, [state.templates, state.plans, state.sessions, state.hydrated]);

  const actions = useMemo(
    () => ({
      addTemplate: (template: Template) =>
        dispatch({ type: "addTemplate", payload: template }),
      updateTemplate: (template: Template) =>
        dispatch({ type: "updateTemplate", payload: template }),
      deleteTemplate: (id: string) =>
        dispatch({ type: "deleteTemplate", payload: id }),
      addPlan: (plan: Plan) => dispatch({ type: "addPlan", payload: plan }),
      updatePlan: (planId: string, updates: Partial<Plan>) =>
        dispatch({
          type: "updatePlan",
          payload: { planId, updates },
        }),
      setActivePlan: (planId: string) =>
        dispatch({ type: "setActivePlan", payload: planId }),
      addSession: (session: WorkoutSession) =>
        dispatch({ type: "addSession", payload: session }),
      updateSession: (sessionId: string, updates: Partial<WorkoutSession>) =>
        dispatch({
          type: "updateSession",
          payload: { sessionId, updates },
        }),
    }),
    [],
  );

  return (
    <GymContext.Provider value={{ ...state, actions }}>{children}</GymContext.Provider>
  );
};

export const useGymContext = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error("GymContext must be used within a GymProvider");
  }
  return context;
};
