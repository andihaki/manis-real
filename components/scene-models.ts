import * as THREE from "three";
import { palette } from "@/lib/palette";
import type { Product } from "@/lib/types";

/**
 * World units per metre. A single global scale (rather than sizing each model to
 * its 2D layout box) is what keeps the products physically consistent with each
 * other: a 0.75m desk really is shorter than a 1m chair back.
 */
export const METRE = 4;

/** Height of the desktop surface on every desk model, in metres. */
const DESK_SURFACE = 0.75;

/**
 * Materials are keyed by colour and reused across every model and every
 * remount, so they are intentionally never disposed. The renderer owns the GPU
 * side of a material, so an instance stays valid across context rebuilds.
 */
const materialCache = new Map<string, THREE.MeshLambertMaterial>();

function material(color: string): THREE.MeshLambertMaterial {
  let cached = materialCache.get(color);
  if (!cached) {
    cached = new THREE.MeshLambertMaterial({ color });
    cached.userData.shared = true;
    materialCache.set(color, cached);
  }
  return cached;
}

function box(
  width: number,
  height: number,
  depth: number,
  x: number,
  y: number,
  z: number,
  color: string,
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material(color),
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cylinder(
  radius: number,
  height: number,
  x: number,
  y: number,
  z: number,
  color: string,
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 20),
    material(color),
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Five-star caster base shared by both chairs. */
function addStarBase(group: THREE.Group, color: string): void {
  group.add(cylinder(0.1, 0.07, 0, 0.06, 0, color));

  for (let index = 0; index < 5; index += 1) {
    const angle = (index / 5) * Math.PI * 2;
    const spoke = box(0.05, 0.045, 0.42, 0, 0, 0, color);
    spoke.position.set(Math.sin(angle) * 0.21, 0.05, Math.cos(angle) * 0.21);
    spoke.rotation.y = angle;
    group.add(spoke);

    const caster = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 14, 10),
      material(palette.metalDark),
    );
    caster.position.set(Math.sin(angle) * 0.4, 0.045, Math.cos(angle) * 0.4);
    caster.castShadow = true;
    group.add(caster);
  }
}

/** Oak top on straight metal legs with a stretcher bar. */
function minimalDesk(): THREE.Group {
  const group = new THREE.Group();
  const surface = DESK_SURFACE;
  const depth = 0.65;

  group.add(box(2.4, 0.06, depth, 0, surface - 0.03, 0, palette.oak));

  for (const x of [-1.12, 1.12]) {
    for (const z of [-0.24, 0.24]) {
      group.add(
        box(
          0.06,
          surface - 0.06,
          0.06,
          x,
          (surface - 0.06) / 2,
          z,
          palette.metal,
        ),
      );
    }
  }

  group.add(box(2.24, 0.05, 0.05, 0, 0.3, 0, palette.metalDark));

  return group;
}

/** Timber top on two steel columns with a control panel. */
function standingDesk(): THREE.Group {
  const group = new THREE.Group();
  const surface = DESK_SURFACE;
  const depth = 0.65;

  group.add(box(2.5, 0.05, depth, 0, surface - 0.025, 0, palette.timber));

  for (const x of [-0.95, 0.95]) {
    group.add(box(0.16, 0.7, 0.16, x, 0.35, 0, palette.metal));
    group.add(box(0.5, 0.05, 0.66, x, 0.025, 0, palette.charcoal));
  }

  group.add(
    box(0.26, 0.07, 0.05, 0.95, 0.66, depth / 2 + 0.02, palette.charcoal),
  );
  group.add(box(0.07, 0.04, 0.03, 1.0, 0.66, depth / 2 + 0.05, palette.gold));

  return group;
}

/** Walnut top on solid side panels with a drawer stack. */
function executiveDesk(): THREE.Group {
  const group = new THREE.Group();
  const surface = DESK_SURFACE;
  const depth = 0.72;

  group.add(box(2.6, 0.07, depth, 0, surface - 0.035, 0, palette.walnut));

  for (const x of [-1.19, 1.19]) {
    group.add(
      box(
        0.22,
        surface - 0.07,
        depth * 0.92,
        x,
        (surface - 0.07) / 2,
        0,
        palette.walnutDark,
      ),
    );
  }

  group.add(box(0.78, 0.44, depth * 0.8, -0.3, 0.36, 0, palette.walnutMid));
  group.add(
    box(0.26, 0.035, 0.035, -0.3, 0.44, depth * 0.4 + 0.02, palette.gold),
  );

  return group;
}

/** Breathable mesh back in a charcoal frame. */
function meshChair(): THREE.Group {
  const group = new THREE.Group();

  group.add(box(0.48, 0.08, 0.46, 0, 0.45, 0, palette.charcoal));

  const frame = box(0.46, 0.56, 0.07, 0, 0.76, -0.24, palette.charcoal);
  frame.rotation.x = -0.1;
  group.add(frame);

  const mesh = box(0.4, 0.5, 0.03, 0, 0.76, -0.18, palette.slate);
  mesh.rotation.x = -0.1;
  group.add(mesh);

  for (const x of [-0.28, 0.28]) {
    group.add(box(0.07, 0.05, 0.36, x, 0.6, -0.02, palette.slate));
  }

  group.add(cylinder(0.04, 0.38, 0, 0.26, 0, palette.metal));
  addStarBase(group, palette.charcoal);

  return group;
}

/** Padded back, lumbar pad, and headrest. */
function ergonomicChair(): THREE.Group {
  const group = new THREE.Group();

  group.add(box(0.5, 0.1, 0.48, 0, 0.46, 0, palette.charcoal));
  group.add(box(0.46, 0.62, 0.12, 0, 0.9, -0.2, palette.slate));
  group.add(box(0.4, 0.09, 0.12, 0, 0.72, -0.15, palette.teal));
  group.add(box(0.3, 0.15, 0.11, 0, 1.28, -0.24, palette.charcoal));

  for (const x of [-0.29, 0.29]) {
    group.add(box(0.07, 0.05, 0.4, x, 0.63, -0.02, palette.slate));
  }

  group.add(cylinder(0.04, 0.4, 0, 0.26, 0, palette.metal));
  addStarBase(group, palette.charcoal);

  return group;
}

/** Flat panel on a column, screen proud of the bezel so no faces are coplanar. */
function monitor(): THREE.Group {
  const group = new THREE.Group();

  group.add(box(0.3, 0.02, 0.19, 0, 0.01, 0, palette.metal));
  group.add(box(0.07, 0.25, 0.05, 0, 0.135, -0.02, palette.metalDark));
  group.add(box(0.64, 0.39, 0.03, 0, 0.445, 0, palette.charcoal));
  group.add(box(0.59, 0.34, 0.02, 0, 0.445, 0.02, palette.screen));

  return group;
}

/**
 * Builds the 3D model for a product, or null when it has not been modelled yet
 * (those items keep falling back to their 2D art billboard).
 *
 * Model space: metres, origin at the centre of the footprint on the floor, so
 * the group can be dropped straight onto a world position.
 */
export function buildProductModel(product: Product): THREE.Group | null {
  let group: THREE.Group;

  switch (product.id) {
    case "minimal-desk":
      group = minimalDesk();
      break;
    case "standing-desk":
      group = standingDesk();
      break;
    case "executive-desk":
      group = executiveDesk();
      break;
    case "mesh-chair":
      group = meshChair();
      break;
    case "ergonomic-chair":
      group = ergonomicChair();
      break;
    case "monitor":
      group = monitor();
      break;
    default:
      return null;
  }

  group.scale.setScalar(METRE);
  return group;
}

/**
 * Half-depth of a modelled product's footprint in world units. The flat scene's
 * depth values were tuned for zero-thickness planes, so the renderer uses this
 * to stop a freestanding chair from clipping into the desk.
 */
export function modelHalfDepth(product: Product): number {
  switch (product.id) {
    case "minimal-desk":
      return (0.65 * METRE) / 2;
    case "standing-desk":
      return (0.65 * METRE) / 2;
    case "executive-desk":
      return (0.72 * METRE) / 2;
    case "mesh-chair":
      return (0.5 * METRE) / 2;
    case "ergonomic-chair":
      return (0.52 * METRE) / 2;
    default:
      return 0;
  }
}

/**
 * Height of a modelled item's flat working surface in world units, or null when
 * it has none. Stacked items sit on this rather than on the estimate that
 * scene-layout.ts derives from the 2D art.
 */
export function modelSurfaceY(product: Product): number | null {
  return product.category === "desk" ? DESK_SURFACE * METRE : null;
}
