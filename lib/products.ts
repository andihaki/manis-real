import type { Category, Layout, Product } from "./types";

export const MAX_MONITORS = 3;

/**
 * Monitor boxes are laid out dynamically so that one is centred, two are
 * symmetric, and three are evenly spread — always inside the desk footprint.
 */
export const monitorLayout = {
  centerX: 50,
  y: 32,
  width: 15,
  height: 20,
  z: 40,
  spacing: 16,
};

export function monitorLeft(index: number, count: number): number {
  const center =
    monitorLayout.centerX + (index - (count - 1) / 2) * monitorLayout.spacing;
  return center - monitorLayout.width / 2;
}

function desk(
  id: string,
  name: string,
  pricePerMonth: number,
  blurb: string,
  layout: Omit<Layout, "z">,
): Product {
  return {
    id,
    name,
    category: "desk",
    pricePerMonth,
    blurb,
    layout: { ...layout, z: 20 },
  };
}

function chair(
  id: string,
  name: string,
  pricePerMonth: number,
  blurb: string,
  layout: Omit<Layout, "z">,
): Product {
  return {
    id,
    name,
    category: "chair",
    pricePerMonth,
    blurb,
    layout: { ...layout, z: 50 },
  };
}

export const products: Product[] = [
  desk(
    "minimal-desk",
    "Minimal Desk",
    80,
    "Clean oak top on powder-coated A-frame legs.",
    {
      x: 20,
      y: 45,
      width: 60,
      height: 30,
    },
  ),
  desk(
    "standing-desk",
    "Standing Desk",
    120,
    "Electric sit-stand with four memory presets.",
    {
      x: 19,
      y: 45,
      width: 62,
      height: 32,
    },
  ),
  desk(
    "executive-desk",
    "Executive Desk",
    160,
    "Solid walnut with a soft-close drawer.",
    {
      x: 17,
      y: 45,
      width: 66,
      height: 30,
    },
  ),
  chair(
    "mesh-chair",
    "Mesh Chair",
    60,
    "Breathable mesh back on a five-point base.",
    {
      x: 39,
      y: 52,
      width: 22,
      height: 38,
    },
  ),
  chair(
    "ergonomic-chair",
    "Ergonomic Chair",
    80,
    "Lumbar support, headrest, and padded arms.",
    {
      x: 39,
      y: 52,
      width: 22,
      height: 40,
    },
  ),
  {
    id: "monitor",
    name: '27" Monitor',
    category: "monitor",
    pricePerMonth: 30,
    blurb: "QHD panel with tilt and height adjustment.",
    layout: {
      x: monitorLeft(0, 1),
      y: monitorLayout.y,
      width: monitorLayout.width,
      height: monitorLayout.height,
      z: monitorLayout.z,
    },
  },
  {
    id: "standing-lamp",
    name: "Standing Lamp",
    category: "lamp",
    pricePerMonth: 15,
    blurb: "Tall floor lamp with a warm, dimmable shade.",
    layout: { x: 1, y: 16, width: 11, height: 62, z: 30 },
  },
  {
    id: "potted-plant",
    name: "Potted Plant",
    category: "plant",
    pricePerMonth: 10,
    blurb: "A little bit of Bali greenery.",
    layout: { x: 6, y: 52, width: 13, height: 26, z: 8 },
  },
  {
    id: "bean-bag",
    name: "Bean Bag",
    category: "bean-bag",
    pricePerMonth: 15,
    blurb: "Soft floor seating for reading breaks.",
    layout: { x: 62, y: 64, width: 18, height: 21, z: 45 },
  },
  {
    id: "coffee-station",
    name: "Coffee Station",
    category: "coffee-station",
    pricePerMonth: 35,
    blurb: "Compact cart with a grinder and pour-over kit.",
    layout: { x: 83, y: 40, width: 15, height: 36, z: 15 },
  },
];

export function productsByCategory(category: Category): Product[] {
  return products.filter((product) => product.category === category);
}

export const monitorProduct = products.find(
  (product) => product.id === "monitor",
) as Product;

export const lampProduct = products.find(
  (product) => product.id === "standing-lamp",
) as Product;

export const plantProduct = products.find(
  (product) => product.id === "potted-plant",
) as Product;

export const beanBagProduct = products.find(
  (product) => product.id === "bean-bag",
) as Product;

export const coffeeStationProduct = products.find(
  (product) => product.id === "coffee-station",
) as Product;
