"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { products } from "@/lib/products";
import type { Workspace } from "@/lib/types";
import { ProductArt } from "./product-art";
import { placeWorkspace } from "./scene-layout";
import { createRoom, createShadowMaterial } from "./scene-room";
import { svgToTexture } from "./scene-texture";

const CAMERA_START = new THREE.Vector3(0, 7.4, 18.6);
const CAMERA_TARGET = new THREE.Vector3(0, 3.4, -0.5);

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

      // Room meshes own their textures, so those go with them.
      room.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.dispose();
        const material = child.material;
        if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
        else material.dispose();
      });

      // Item materials only borrow product textures, which are disposed below.
      items.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.dispose();
        const material = child.material;
        if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
        else if (material !== shadowMaterial) material.dispose();
      });

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
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (
          child.material instanceof THREE.MeshBasicMaterial &&
          child.material !== shadowMaterial
        ) {
          child.material.dispose();
        }
      }
    }

    for (const item of placeWorkspace(workspace)) {
      const texture = texturesRef.current.get(item.product.id);
      if (!texture) continue;

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(item.size.width, item.size.height),
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.05,
          side: THREE.DoubleSide,
        }),
      );
      mesh.position.set(item.position.x, item.position.y, item.position.z);
      items.add(mesh);

      // Items stacked on the desk already sit above the floor, so only
      // floor-standing pieces cast a contact shadow.
      if (shadowMaterial && item.baseY === 0) {
        const shadow = new THREE.Mesh(
          new THREE.PlaneGeometry(item.size.width * 0.95, item.size.width * 0.3),
          shadowMaterial,
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(item.position.x, 0.02, item.position.z);
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
