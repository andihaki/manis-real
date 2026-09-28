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

/**
 * Lighting knobs. The models are shaded with MeshLambertMaterial, so these two
 * numbers are what control how bright the whole 3D scene reads.
 */
const AMBIENT_INTENSITY = 0.45;
const KEY_INTENSITY = 0.85;

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
    new THREE.MeshLambertMaterial({
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
    new THREE.MeshLambertMaterial({ color: SUN }),
  );
  sun.position.set(1.5, 1.25, 0.03);
  group.add(sun);

  const frame = new THREE.MeshLambertMaterial({ color: FRAME });
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

/**
 * Soft radial blob used as a contact shadow under items that are still 2D
 * billboards. Modelled products cast a real shadow from the key light instead.
 */
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

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  material.userData.shared = true;
  return material;
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

function createLighting(): THREE.Group {
  const lighting = new THREE.Group();

  const key = new THREE.DirectionalLight(0xfff6e8, KEY_INTENSITY);
  key.position.set(7, 13, 9);
  key.target.position.set(0, 1, -1);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 48;
  key.shadow.camera.left = -14;
  key.shadow.camera.right = 14;
  key.shadow.camera.top = 14;
  key.shadow.camera.bottom = -10;
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.02;
  key.shadow.camera.updateProjectionMatrix();

  lighting.add(key);
  lighting.add(key.target);
  lighting.add(new THREE.HemisphereLight(0xfff3e0, 0xd9b88f, AMBIENT_INTENSITY));

  return lighting;
}

export function createRoom(): THREE.Group {
  const room = new THREE.Group();
  const wallZ = -ROOM_SIZE.depth / 2;

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE.width, ROOM_SIZE.height),
    new THREE.MeshLambertMaterial({
      map: verticalGradient([
        [0, WALL_TOP],
        [1, WALL_BOTTOM],
      ]),
    }),
  );
  wall.position.set(0, ROOM_SIZE.height / 2, wallZ);
  wall.receiveShadow = true;
  room.add(wall);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE.width, ROOM_SIZE.depth),
    new THREE.MeshLambertMaterial({ map: createFloorTexture() }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  room.add(
    bar(
      ROOM_SIZE.width,
      0.16,
      0.12,
      [0, 0.08, wallZ + 0.06],
      new THREE.MeshLambertMaterial({ color: BASEBOARD }),
    ),
  );

  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(1, 48),
    new THREE.MeshLambertMaterial({
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
  room.add(createLighting());

  return room;
}
