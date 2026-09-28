import { monitorLayout, monitorLeft } from "@/lib/products";
import type { Product, Workspace } from "@/lib/types";
import { ProductArt } from "./product-art";
import { RoomBackdrop } from "./room-backdrop";

function SceneItem({
  product,
  x,
  z,
}: {
  product: Product;
  x?: number;
  z?: number;
}) {
  const { layout } = product;
  return (
    <div
      className="scene-item absolute"
      style={{
        left: `${x ?? layout.x}%`,
        top: `${layout.y}%`,
        width: `${layout.width}%`,
        height: `${layout.height}%`,
        zIndex: z ?? layout.z,
      }}
    >
      <ProductArt product={product} />
    </div>
  );
}

/**
 * The original flat scene: percentage-positioned product art layered over the
 * painted room. Render order is bottom-of-the-room first so later items (chair,
 * monitors) sit on top, matching each product's z-index.
 */
export function Workspace2D({ workspace }: { workspace: Workspace }) {
  return (
    <>
      <RoomBackdrop />

      {workspace.plant && (
        <SceneItem key={workspace.plant.id} product={workspace.plant} />
      )}
      {workspace.coffeeStation && (
        <SceneItem
          key={workspace.coffeeStation.id}
          product={workspace.coffeeStation}
        />
      )}
      {workspace.desk && (
        <SceneItem key={workspace.desk.id} product={workspace.desk} />
      )}
      {workspace.lamp && (
        <SceneItem key={workspace.lamp.id} product={workspace.lamp} />
      )}
      {workspace.monitors.map((monitor, index) => (
        <SceneItem
          key={`monitor-${index}`}
          product={monitor}
          x={monitorLeft(index, workspace.monitors.length)}
          z={monitorLayout.z + index}
        />
      ))}
      {workspace.beanBag && (
        <SceneItem key={workspace.beanBag.id} product={workspace.beanBag} />
      )}
      {workspace.chair && (
        <SceneItem key={workspace.chair.id} product={workspace.chair} />
      )}
    </>
  );
}
