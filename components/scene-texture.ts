import * as THREE from "three";

const TEXTURE_WIDTH = 1024;

/**
 * Rasterises a live SVG element into a texture.
 *
 * The clone gets explicit pixel dimensions first: once an SVG is loaded through
 * an <img> the Tailwind sizing in product-art.tsx no longer applies, so without
 * this the browser would fall back to the viewBox size and blow the art up soft.
 */
export async function svgToTexture(
  svg: SVGSVGElement,
  width = TEXTURE_WIDTH,
): Promise<THREE.CanvasTexture> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const [, , viewBoxWidth, viewBoxHeight] = (
    clone.getAttribute("viewBox") ?? "0 0 1 1"
  )
    .split(/[\s,]+/)
    .map(Number);

  const height = Math.max(1, Math.round((width * viewBoxHeight) / viewBoxWidth));
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const markup = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(
    new Blob([markup], { type: "image/svg+xml;charset=utf-8" }),
  );

  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not rasterise scene art"));
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  } finally {
    URL.revokeObjectURL(url);
  }
}
