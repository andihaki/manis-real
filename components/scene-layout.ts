import { monitorLeft } from "@/lib/products";
import type { Product, Workspace } from "@/lib/types";

/**
 * World-space size of the room. The 16:12 wall keeps the 4:3 framing of the
 * old percentage-based 2D scene, so product layouts still map cleanly.
 */
export const ROOM_SIZE = { width: 16, height: 12, depth: 12 } as const;

/**
 * Where the desktop surface sits inside each desk drawing, as a share of the
 * plane height measured from the bottom. Monitors are stacked on this line so
 * they land on the desk rather than floating above it.
 */
const deskSurfaceRatio: Record<string, number> = {
  "minimal-desk": 1 - 30 / 160,
  "standing-desk": 1 - 28 / 170,
  "executive-desk": 1 - 30 / 160,
};

export type PlacedItem = {
  key: string;
  product: Product;
  position: { x: number; y: number; z: number };
  size: { width: number; height: number };
  /** Height of the item's bottom edge, used to tell stacked items from floor ones. */
  baseY: number;
};

function worldWidth(percent: number): number {
  return (percent / 100) * ROOM_SIZE.width;
}

function worldHeight(percent: number): number {
  return (percent / 100) * ROOM_SIZE.height;
}

/**
 * Turns the workspace state into world-space billboards. Percentages are kept
 * verbatim from lib/products.ts: x spans the room width, y becomes depth (so
 * "lower on screen" reads as "closer to the camera"), and width/height become
 * plane dimensions.
 */
export function placeWorkspace(workspace: Workspace): PlacedItem[] {
  const desk = workspace.desk;
  const deskBottom = desk ? worldHeight(desk.layout.height) : 0;
  const deskTop = desk ? deskBottom * (deskSurfaceRatio[desk.id] ?? 1) : 0;

  const items: PlacedItem[] = [];

  const place = (
    product: Product | null,
    key: string,
    baseY: number,
    xOverride?: number,
  ) => {
    if (!product) return;

    const x = xOverride ?? product.layout.x;
    const width = worldWidth(product.layout.width);
    const height = worldHeight(product.layout.height);

    items.push({
      key,
      product,
      size: { width, height },
      baseY,
      position: {
        x:
          ((x + product.layout.width / 2) / 100) * ROOM_SIZE.width -
          ROOM_SIZE.width / 2,
        y: baseY + height / 2,
        z:
          (product.layout.y / 100) * ROOM_SIZE.depth - ROOM_SIZE.depth / 2,
      },
    });
  };

  place(workspace.plant, "plant", 0);
  place(workspace.coffeeStation, "coffee-station", 0);
  place(desk, "desk", 0);
  place(workspace.lamp, "lamp", 0);
  workspace.monitors.forEach((monitor, index) => {
    place(
      monitor,
      `monitor-${index}`,
      deskTop,
      monitorLeft(index, workspace.monitors.length),
    );
  });
  place(workspace.beanBag, "bean-bag", 0);
  place(workspace.chair, "chair", 0);

  return items;
}
