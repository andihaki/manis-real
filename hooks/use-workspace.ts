"use client";

import { useCallback, useMemo, useReducer } from "react";
import {
  lampProduct,
  monitorProduct,
  plantProduct,
} from "@/lib/products";
import type { Product, Term } from "@/lib/types";
import {
  initialWorkspaceState,
  workspaceReducer,
} from "@/lib/workspace-reducer";

function makeReference(): string {
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `KRJ-${suffix}`;
}

export function useWorkspace() {
  const [state, dispatch] = useReducer(workspaceReducer, initialWorkspaceState);

  const selectDesk = useCallback(
    (product: Product) => dispatch({ type: "selectDesk", product }),
    [],
  );
  const selectChair = useCallback(
    (product: Product) => dispatch({ type: "selectChair", product }),
    [],
  );
  const addMonitor = useCallback(
    () => dispatch({ type: "addMonitor", product: monitorProduct }),
    [],
  );
  const removeMonitor = useCallback(
    () => dispatch({ type: "removeMonitor" }),
    [],
  );
  const toggleLamp = useCallback(
    () => dispatch({ type: "toggleLamp", product: lampProduct }),
    [],
  );
  const togglePlant = useCallback(
    () => dispatch({ type: "togglePlant", product: plantProduct }),
    [],
  );
  const setTerm = useCallback(
    (term: Term) => dispatch({ type: "setTerm", term }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const beginRent = useCallback(() => dispatch({ type: "beginRent" }), []);
  const cancelRent = useCallback(() => dispatch({ type: "cancelRent" }), []);
  const confirmRent = useCallback(
    () => dispatch({ type: "confirmRent", reference: makeReference() }),
    [],
  );

  return useMemo(
    () => ({
      state,
      selectDesk,
      selectChair,
      addMonitor,
      removeMonitor,
      toggleLamp,
      togglePlant,
      setTerm,
      reset,
      beginRent,
      cancelRent,
      confirmRent,
    }),
    [
      state,
      selectDesk,
      selectChair,
      addMonitor,
      removeMonitor,
      toggleLamp,
      togglePlant,
      setTerm,
      reset,
      beginRent,
      cancelRent,
      confirmRent,
    ],
  );
}
