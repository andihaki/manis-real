"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { products } from "@/lib/products";
import type { Workspace } from "@/lib/types";
import { ProductArt } from "./product-art";
import { placeWorkspace, type PlacedItem } from "./scene-layout";
import {
  buildProductModel,
  modelHalfDepth,
  modelSurfaceY,
} from "./scene-models";
import { createRoom, createShadowMaterial } from "./scene-room";
import { svgToTexture } from "./scene-texture";

const CAMERA_START = new THREE.Vector3(0, 7.4, 18.6);
const CAMERA_TARGET = new THREE.Vector3(0, 3.4, -0.5);

type Placement = { x: number; y: number; z: number; rotationY: number };

/**
 * Turns a flat-scene placement into a 3D arrangement.
 *
 * The 2D layout was tuned for zero-thickness planes: a monitor sat deeper than
 * the desk it belongs to, and a chair sat at the desk's own z. Real geometry has
 * depth and a real surface, so the pieces that rest on the desk are re-seated
 * against it here.
 */
function arrange(
  item: PlacedItem,
  desk: PlacedItem | undefined,
  deskSurface: number | null,
): Placement {
  // Stacked items (monitors) use the desk model's actual surface height instead
  // of the estimate scene-layout.ts takes from the 2D art.
  const baseY =
    desk && deskSurface !== null && item.baseY > 0 ? deskSurface : item.baseY;

  if (desk && item.product.category === "monitor") {
    return {
      x: item.position.x,
      y: baseY,
      // Sit it towards the back of the desktop rather than at its own layout
      // depth, which is behind the desk entirely.
      z: desk.position.z - modelHalfDepth(desk.product) * 0.3,
      rotationY: 0,
    };
  }

  if (desk && item.product.category === "chair") {
    return {
      x: item.position.x,
      y: baseY,
      // Clear the desk's footprint so the base cannot clip through it.
      z:
        desk.position.z +
        modelHalfDepth(desk.product) +
        modelHalfDepth(item.product) +
        0.3,
      // Models face +z, i.e. the viewer; a chair at the desk faces the desk.
      rotationY: Math.PI,
    };
  }

  return { x: item.position.x, y: baseY, z: item.position.z, rotationY: 0 };
}

/**
 * Releases the GPU resources under a node. Materials flagged `userData.shared`
 * (the palette and the contact-shadow blob) are deliberately left alone because
 * they are reused across rebuilds and remounts.
 */
function disposeTree(root: THREE.Object3D): void {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();

    const dispose = (material: THREE.Material) => {
      if (material.userData.shared !== true) material.dispose();
    };
    if (Array.isArray(child.material)) child.material.forEach(dispose);
    else dispose(child.material);
  });
}

export function Workspace3D({ workspace }: { workspace: Workspace }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const artRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<THREE.Group | null>(null);
  const shadowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const texturesRef = useRef(new Map<string, THREE.Texture>());
  const [textureVersion, setTextureVersion] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const room = createRoom();
    scene.add(room);

    const items = new THREE.Group();
    scene.add(items);
    itemsRef.current = items;

    const shadowMaterial = createShadowMaterial();
    shadowMaterialRef.current = shadowMaterial;

    const camera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 200);
    camera.position.copy(CAMERA_START);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(CAMERA_TARGET);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 10;
    controls.maxDistance = 30;
    controls.minPolarAngle = 0.45;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    // Stay in front of the back wall so the room never opens up.
    controls.minAzimuthAngle = -Math.PI * 0.44;
    controls.maxAzimuthAngle = Math.PI * 0.44;
    controls.update();

    const resize = () => {
      const { clientWidth, clientHeight } = host;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    const textures = texturesRef.current;

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      renderer.dispose();

      // Shared palette materials survive; everything else is owned here.
      disposeTree(room);
      disposeTree(items);

      shadowMaterial.map?.dispose();
      shadowMaterial.dispose();
      textures.forEach((texture) => texture.dispose());
      textures.clear();
      host.removeChild(renderer.domElement);
      itemsRef.current = null;
      shadowMaterialRef.current = null;
    };
  }, []);

  // Rasterise one texture per product from the hidden SVG layer. Done once:
  // every product is prepared whether or not it is currently selected.
  useLayoutEffect(() => {
    const host = artRef.current;
    if (!host) return;

    let cancelled = false;

    const run = async () => {
      for (const product of products) {
        const svg = host.querySelector<SVGSVGElement>(
          `[data-art="${product.id}"] svg`,
        );
        if (!svg) continue;

        try {
          const texture = await svgToTexture(svg);
          if (cancelled) {
            texture.dispose();
            return;
          }
          texturesRef.current.set(product.id, texture);
          setTextureVersion((version) => version + 1);
        } catch {
          // Art that fails to rasterise simply stays out of the scene.
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const items = itemsRef.current;
    if (!items) return;
    const shadowMaterial = shadowMaterialRef.current;

    for (const child of [...items.children]) {
      items.remove(child);
      disposeTree(child);
    }

    const placed = placeWorkspace(workspace);
    const desk = placed.find((item) => item.product.category === "desk");
    const deskSurface = desk ? modelSurfaceY(desk.product) : null;

    for (const item of placed) {
      const placement = arrange(item, desk, deskSurface);

      const model = buildProductModel(item.product);
      if (model) {
        model.position.set(placement.x, placement.y, placement.z);
        model.rotation.y = placement.rotationY;
        items.add(model);
        continue;
      }

      // Not modelled yet, so fall back to the 2D art on a lit billboard.
      const texture = texturesRef.current.get(item.product.id);
      if (!texture) continue;

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(item.size.width, item.size.height),
        new THREE.MeshLambertMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.05,
          side: THREE.DoubleSide,
        }),
      );
      mesh.position.set(
        placement.x,
        placement.y + item.size.height / 2,
        placement.z,
      );
      items.add(mesh);

      // Billboards are flat, so they get a painted blob rather than a real
      // shadow. Stacked items already sit above the floor and get none.
      if (shadowMaterial && item.baseY === 0) {
        const shadow = new THREE.Mesh(
          new THREE.PlaneGeometry(item.size.width * 0.95, item.size.width * 0.3),
          shadowMaterial,
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(placement.x, 0.02, placement.z);
        items.add(shadow);
      }
    }
  }, [workspace, textureVersion]);

  return (
    <div ref={hostRef} className="absolute inset-0">
      <div ref={artRef} className="hidden" aria-hidden="true">
        {products.map((product) => (
          <div key={product.id} data-art={product.id}>
            <ProductArt product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
