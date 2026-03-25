import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'clockin_data';

const defaultState = {
  projects: [],
  sessions: [],
  activeSession: null, // { projectId, startTime }
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useStore() {
  const [state, setState] = useState(load);

  // Persist every change
  useEffect(() => {
    save(state);
  }, [state]);

  const addProject = useCallback((name) => {
    const project = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: Date.now(),
      color: PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)],
    };
    setState((s) => ({ ...s, projects: [...s.projects, project] }));
    return project;
  }, []);

  const deleteProject = useCallback((projectId) => {
    setState((s) => {
      const next = {
        ...s,
        projects: s.projects.filter((p) => p.id !== projectId),
        sessions: s.sessions.filter((se) => se.projectId !== projectId),
      };
      if (s.activeSession?.projectId === projectId) {
        next.activeSession = null;
      }
      return next;
    });
  }, []);

  const clockIn = useCallback((projectId) => {
    setState((s) => {
      if (s.activeSession) return s; // already clocked in
      return { ...s, activeSession: { projectId, startTime: Date.now() } };
    });
  }, []);

  const clockOut = useCallback(() => {
    setState((s) => {
      if (!s.activeSession) return s;
      const { projectId, startTime } = s.activeSession;
      const endTime = Date.now();
      const session = {
        id: crypto.randomUUID(),
        projectId,
        startTime,
        endTime,
        duration: endTime - startTime,
      };
      return {
        ...s,
        activeSession: null,
        sessions: [session, ...s.sessions],
      };
    });
  }, []);

  const deleteSession = useCallback((sessionId) => {
    setState((s) => ({
      ...s,
      sessions: s.sessions.filter((se) => se.id !== sessionId),
    }));
  }, []);

  return {
    projects: state.projects,
    sessions: state.sessions,
    activeSession: state.activeSession,
    addProject,
    deleteProject,
    clockIn,
    clockOut,
    deleteSession,
  };
}

const PROJECT_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f97316', // orange
];
