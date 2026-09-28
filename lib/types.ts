export type Category = "desk" | "chair" | "monitor" | "lamp" | "plant";

/** A percentage-based box inside the scene container. */
export type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  pricePerMonth: number;
  blurb: string;
  layout: Layout;
};

export type Workspace = {
  desk: Product | null;
  chair: Product | null;
  monitors: Product[];
  lamp: Product | null;
  plant: Product | null;
};

export type Term = 1 | 3 | 6 | 12;

export const TERMS: Term[] = [1, 3, 6, 12];

export type RentStatus = "editing" | "confirming" | "rented";

export type WorkspaceState = {
  workspace: Workspace;
  term: Term;
  status: RentStatus;
  reference: string | null;
};

export type WorkspaceAction =
  | { type: "selectDesk"; product: Product }
  | { type: "selectChair"; product: Product }
  | { type: "addMonitor"; product: Product }
  | { type: "removeMonitor" }
  | { type: "toggleLamp"; product: Product }
  | { type: "togglePlant"; product: Product }
  | { type: "setTerm"; term: Term }
  | { type: "reset" }
  | { type: "beginRent" }
  | { type: "confirmRent"; reference: string }
  | { type: "cancelRent" };
