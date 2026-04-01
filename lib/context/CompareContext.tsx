"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Product } from "@/types";

const MAX_COMPARE = 4;
const STORAGE_KEY = "sr_compare";

interface CompareContextValue {
  items: Product[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

function loadStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStored(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount — we need access to the products import
  // Since we store only IDs, the parent must provide products lookup or we store full objects
  // For simplicity, store full product objects in state, IDs in localStorage

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.length >= MAX_COMPARE) return prev;
      if (prev.some((p) => p.id === product.id)) return prev;
      const next = [...prev, product];
      saveStored(next.map((p) => p.id));
      return next;
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      saveStored(next.map((p) => p.id));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    saveStored([]);
  }, []);

  const has = useCallback(
    (productId: string) => items.some((p) => p.id === productId),
    [items]
  );

  return (
    <CompareContext.Provider
      value={{ items, add, remove, clear, has, isFull: items.length >= MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
