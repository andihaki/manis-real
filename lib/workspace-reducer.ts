import { MAX_MONITORS } from "./products";
import type {
  Product,
  Workspace,
  WorkspaceAction,
  WorkspaceState,
} from "./types";

export const emptyWorkspace: Workspace = {
  desk: null,
  chair: null,
  monitors: [],
  lamp: null,
  plant: null,
};

export const initialWorkspaceState: WorkspaceState = {
  workspace: emptyWorkspace,
  term: 3,
  status: "editing",
  reference: null,
};

function toggleOne(current: Product | null, product: Product): Product | null {
  return current?.id === product.id ? null : product;
}

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case "selectDesk":
      return {
        ...state,
        workspace: {
          ...state.workspace,
          desk: toggleOne(state.workspace.desk, action.product),
        },
      };
    case "selectChair":
      return {
        ...state,
        workspace: {
          ...state.workspace,
          chair: toggleOne(state.workspace.chair, action.product),
        },
      };
    case "addMonitor":
      if (state.workspace.monitors.length >= MAX_MONITORS) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          monitors: [...state.workspace.monitors, action.product],
        },
      };
    case "removeMonitor":
      if (state.workspace.monitors.length === 0) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          monitors: state.workspace.monitors.slice(0, -1),
        },
      };
    case "toggleLamp":
      return {
        ...state,
        workspace: {
          ...state.workspace,
          lamp: toggleOne(state.workspace.lamp, action.product),
        },
      };
    case "togglePlant":
      return {
        ...state,
        workspace: {
          ...state.workspace,
          plant: toggleOne(state.workspace.plant, action.product),
        },
      };
    case "setTerm":
      return { ...state, term: action.term };
    case "reset":
      return { ...initialWorkspaceState, term: state.term };
    case "beginRent":
      return state.workspace.desk && state.workspace.chair
        ? { ...state, status: "confirming" }
        : state;
    case "confirmRent":
      return { ...state, status: "rented", reference: action.reference };
    case "cancelRent":
      return { ...state, status: "editing" };
    default:
      return state;
  }
}
