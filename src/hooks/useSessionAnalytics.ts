import { useCallback, useEffect, useRef, useState } from 'react';
import { del, entries, set } from 'idb-keyval';
import type { SessionAnalytics, SessionRoundAnalytics } from '../types';

const SESSION_PREFIX = 'session-';

interface SessionInProgress {
  sessionId: string;
  startedAt: number;
  rounds: SessionRoundAnalytics[];
}

const toSessionKey = (timestamp: number): string => `${SESSION_PREFIX}${timestamp}`;

const isSessionKey = (key: IDBValidKey): key is string => typeof key === 'string' && key.startsWith(SESSION_PREFIX);

const readSessions = async (): Promise<SessionAnalytics[]> => {
  const allEntries = await entries<string, SessionAnalytics>();

  return allEntries
    .filter(([key, value]) => isSessionKey(key) && Boolean(value))
    .map(([, value]) => value)
    .sort((a, b) => b.startedAt - a.startedAt);
};

export const useSessionAnalytics = () => {
  const [sessions, setSessions] = useState<SessionAnalytics[]>([]);
  const sessionRef = useRef<SessionInProgress | null>(null);

  const refreshSessions = useCallback(async () => {
    const nextSessions = await readSessions();
    setSessions(nextSessions);
    return nextSessions;
  }, []);

  useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  const startSession = useCallback(async () => {
    const existingSession = sessionRef.current;
    if (existingSession) {
      const endedSession: SessionAnalytics = {
        sessionId: existingSession.sessionId,
        startedAt: existingSession.startedAt,
        endedAt: Date.now(),
        rounds: existingSession.rounds
      };
      await set(toSessionKey(existingSession.startedAt), endedSession);
    }

    const startedAt = Date.now();
    sessionRef.current = {
      sessionId: toSessionKey(startedAt),
      startedAt,
      rounds: []
    };
  }, []);

  const recordAttempt = useCallback((round: Omit<SessionRoundAnalytics, 'timestamp'>) => {
    if (!sessionRef.current) {
      return;
    }

    sessionRef.current.rounds.push({
      ...round,
      timestamp: Date.now()
    });
  }, []);

  const endSession = useCallback(async () => {
    const current = sessionRef.current;
    if (!current) {
      return null;
    }

    const completedSession: SessionAnalytics = {
      sessionId: current.sessionId,
      startedAt: current.startedAt,
      endedAt: Date.now(),
      rounds: current.rounds
    };

    await set(toSessionKey(current.startedAt), completedSession);
    sessionRef.current = null;
    await refreshSessions();

    return completedSession;
  }, [refreshSessions]);

  const clearSession = useCallback(async (sessionId: string) => {
    await del(sessionId);
    await refreshSessions();
  }, [refreshSessions]);

  const exportSessionAnalytics = useCallback(async () => {
    return refreshSessions();
  }, [refreshSessions]);

  return {
    sessions,
    startSession,
    recordAttempt,
    endSession,
    refreshSessions,
    clearSession,
    exportSessionAnalytics
  };
};
