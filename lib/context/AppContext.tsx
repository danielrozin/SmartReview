"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface UserSession {
  id: string;
  displayName: string;
  isGuest: boolean;
}

interface AppState {
  user: UserSession | null;
  votes: Record<string, "up" | "down">;
}

interface AppContextValue {
  user: UserSession | null;
  votes: Record<string, "up" | "down">;
  setUser: (user: UserSession | null) => void;
  setVote: (itemId: string, vote: "up" | "down" | null) => void;
  getVote: (itemId: string) => "up" | "down" | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({ user: null, votes: {} });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("sr_user");
    const storedVotes = localStorage.getItem("sr_votes");
    setState({
      user: storedUser ? JSON.parse(storedUser) : null,
      votes: storedVotes ? JSON.parse(storedVotes) : {},
    });
  }, []);

  const setUser = useCallback((user: UserSession | null) => {
    setState((prev) => ({ ...prev, user }));
    if (user) {
      localStorage.setItem("sr_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("sr_user");
    }
  }, []);

  const setVote = useCallback((itemId: string, vote: "up" | "down" | null) => {
    setState((prev) => {
      const votes = { ...prev.votes };
      if (vote) {
        votes[itemId] = vote;
      } else {
        delete votes[itemId];
      }
      localStorage.setItem("sr_votes", JSON.stringify(votes));
      return { ...prev, votes };
    });
  }, []);

  const getVote = useCallback(
    (itemId: string): "up" | "down" | null => state.votes[itemId] || null,
    [state.votes]
  );

  return (
    <AppContext.Provider value={{ user: state.user, votes: state.votes, setUser, setVote, getVote }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
