import * as THREE from "three";
import { ROOM_SIZE } from "./scene-layout";

const WALL_TOP = "#FCF5EA";
const WALL_BOTTOM = "#F0E1CE";
const FLOOR_BACK = "#E6CBA8";
const FLOOR_FRONT = "#D2AD83";
const FLOOR_SEAM = "rgba(194, 154, 110, 0.35)";
const BASEBOARD = "#C9A778";
const FRAME = "#E7D3B8";
const SKY_TOP = "#8ED3D8";
const SKY_BOTTOM = "#FBE3C4";
const SUN = "#FFE9B0";
const SHADOW = "rgba(35, 48, 58, 0.30)";
const RUG = "#D9684B";

function paintCanvas(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (context) draw(context);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function verticalGradient(stops: Array<[number, string]>): THREE.CanvasTexture {
  return paintCanvas(2, 256, (context) => {
    const fill = context.createLinearGradient(0, 0, 0, context.canvas.height);
    for (const [offset, color] of stops) fill.addColorStop(offset, color);
    context.fillStyle = fill;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  });
}

function bar(
  width: number,
  height: number,
  depth: number,
  position: [number, number, number],
  material: THREE.Material,
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material,
  );
  mesh.position.set(position[0], position[1], position[2]);
  return mesh;
}

function createWindow(): THREE.Group {
  const group = new THREE.Group();
  const paneWidth = 5;
  const paneHeight = 4.4;

  const pane = new THREE.Mesh(
    new THREE.PlaneGeometry(paneWidth, paneHeight),
    new THREE.MeshBasicMaterial({
      map: verticalGradient([
        [0, SKY_TOP],
        [1, SKY_BOTTOM],
      ]),
    }),
  );
  pane.position.z = 0.01;
  group.add(pane);

  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(0.55, 32),
    new THREE.MeshBasicMaterial({ color: SUN }),
  );
  sun.position.set(1.5, 1.25, 0.03);
  group.add(sun);

  const frame = new THREE.MeshBasicMaterial({ color: FRAME });
  group.add(bar(paneWidth + 0.4, 0.2, 0.12, [0, paneHeight / 2, 0.05], frame));
  group.add(bar(paneWidth + 0.4, 0.2, 0.12, [0, -paneHeight / 2, 0.05], frame));
  group.add(bar(0.2, paneHeight, 0.12, [-paneWidth / 2, 0, 0.05], frame));
  group.add(bar(0.2, paneHeight, 0.12, [paneWidth / 2, 0, 0.05], frame));
  group.add(bar(0.12, paneHeight, 0.08, [0, 0.1, 0.06], frame));
  group.add(bar(paneWidth, 0.12, 0.08, [0, 0.1, 0.06], frame));

  // Matches the window position in the old 800x600 room-backdrop viewBox.
  group.position.set(4.2, 8.7, -ROOM_SIZE.depth / 2 + 0.02);
  return group;
}

/** Soft radial blob reused as a contact shadow under every floor-standing item. */
export function createShadowMaterial(): THREE.MeshBasicMaterial {
  const texture = paintCanvas(128, 128, (context) => {
    const size = context.canvas.width;
    const fill = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    fill.addColorStop(0, SHADOW);
    fill.addColorStop(1, "rgba(35, 48, 58, 0)");
    context.fillStyle = fill;
    context.fillRect(0, 0, size, size);
  });

  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
}

function createFloorTexture(): THREE.CanvasTexture {
  return paintCanvas(64, 512, (context) => {
    const { width, height } = context.canvas;
    const fill = context.createLinearGradient(0, 0, 0, height);
    fill.addColorStop(0, FLOOR_BACK);
    fill.addColorStop(1, FLOOR_FRONT);
    context.fillStyle = fill;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = FLOOR_SEAM;
    context.lineWidth = 2;
    for (const row of [0.2, 0.45, 0.7]) {
      context.beginPath();
      context.moveTo(0, height * row);
      context.lineTo(width, height * row);
      context.stroke();
    }
  });
}

export function createRoom(): THREE.Group {
  const room = new THREE.Group();
  const wallZ = -ROOM_SIZE.depth / 2;

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE.width, ROOM_SIZE.height),
    new THREE.MeshBasicMaterial({
      map: verticalGradient([
        [0, WALL_TOP],
        [1, WALL_BOTTOM],
      ]),
    }),
  );
  wall.position.set(0, ROOM_SIZE.height / 2, wallZ);
  room.add(wall);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE.width, ROOM_SIZE.depth),
    new THREE.MeshBasicMaterial({ map: createFloorTexture() }),
  );
  floor.rotation.x = -Math.PI / 2;
  room.add(floor);

  room.add(
    bar(
      ROOM_SIZE.width,
      0.16,
      0.12,
      [0, 0.08, wallZ + 0.06],
      new THREE.MeshBasicMaterial({ color: BASEBOARD }),
    ),
  );

  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(1, 48),
    new THREE.MeshBasicMaterial({
      color: RUG,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    }),
  );
  rug.rotation.x = -Math.PI / 2;
  rug.scale.set(4.8, 2.16, 1);
  rug.position.set(0.2, 0.012, -0.12);
  room.add(rug);

  room.add(createWindow());

  return room;
}
