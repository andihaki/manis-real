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

export function WorkspaceScene({ workspace }: { workspace: Workspace }) {
  const isEmpty =
    !workspace.desk &&
    !workspace.chair &&
    workspace.monitors.length === 0 &&
    !workspace.lamp &&
    !workspace.plant &&
    !workspace.beanBag &&
    !workspace.coffeeStation;

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-sm">
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

      {isEmpty && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[16%] flex justify-center">
          <p className="rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-ink/70 backdrop-blur">
            Pick a desk to start designing
          </p>
        </div>
      )}
    </div>
  );
}
