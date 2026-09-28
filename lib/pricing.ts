import type { Product, Workspace } from "./types";

function selected(workspace: Workspace): Product[] {
  return [
    workspace.desk,
    workspace.chair,
    workspace.lamp,
    workspace.plant,
    ...workspace.monitors,
  ].filter((product): product is Product => product !== null);
}

export function calculateMonthlyPrice(workspace: Workspace): number {
  return selected(workspace).reduce(
    (total, product) => total + product.pricePerMonth,
    0,
  );
}

export function countItems(workspace: Workspace): number {
  return selected(workspace).length;
}

export function canRent(workspace: Workspace): boolean {
  return workspace.desk !== null && workspace.chair !== null;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export type RentalLine = { id: string; label: string; amount: number };

export function workspaceLines(workspace: Workspace): RentalLine[] {
  const lines: RentalLine[] = [];
  if (workspace.desk) {
    lines.push({
      id: "desk",
      label: workspace.desk.name,
      amount: workspace.desk.pricePerMonth,
    });
  }
  if (workspace.chair) {
    lines.push({
      id: "chair",
      label: workspace.chair.name,
      amount: workspace.chair.pricePerMonth,
    });
  }
  if (workspace.monitors.length > 0) {
    lines.push({
      id: "monitors",
      label: `${workspace.monitors.length} × ${workspace.monitors[0].name}`,
      amount: workspace.monitors.reduce(
        (total, monitor) => total + monitor.pricePerMonth,
        0,
      ),
    });
  }
  if (workspace.lamp) {
    lines.push({
      id: "lamp",
      label: workspace.lamp.name,
      amount: workspace.lamp.pricePerMonth,
    });
  }
  if (workspace.plant) {
    lines.push({
      id: "plant",
      label: workspace.plant.name,
      amount: workspace.plant.pricePerMonth,
    });
  }
  return lines;
}
