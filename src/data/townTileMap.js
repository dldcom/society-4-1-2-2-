import tilesetData from "../assets/tilesets/cozy-town/tileset.json";

export const cozyTownTileset = tilesetData;
export const TILE_SIZE = 32;
export const MAP_COLS = 100;
export const MAP_ROWS = 56;

export const tileLookup = Object.fromEntries(
  cozyTownTileset.tiles.map((tile) => [tile.id, tile])
);

export const collisionTileIds = new Set(
  cozyTownTileset.tiles
    .filter((tile) => tile.collides)
    .map((tile) => tile.id)
);

function createGrid(cols = MAP_COLS, rows = MAP_ROWS) {
  return Array.from({ length: rows }, (_, row) => (
    Array.from({ length: cols }, (_, col) => {
      const variants = ["grass_0", "grass_1", "grass_2", "grass_light", "grass_dark"];
      return variants[(col * 7 + row * 3) % variants.length];
    })
  ));
}

function fillRect(grid, tileId, x, y, w, h) {
  for (let row = y; row < y + h; row++) {
    for (let col = x; col < x + w; col++) {
      if (!grid[row] || grid[row][col] === undefined) continue;
      grid[row][col] = tileId;
    }
  }
}

function place(grid, tileId, col, row) {
  if (!grid[row] || grid[row][col] === undefined) return;
  grid[row][col] = tileId;
}

function buildGroundLayer() {
  const grid = createGrid();

  fillRect(grid, "dirt_center", 5, 26, 90, 5);
  fillRect(grid, "dirt_center", 48, 4, 5, 48);
  fillRect(grid, "dirt_center", 17, 12, 31, 4);
  fillRect(grid, "dirt_center", 52, 38, 33, 4);

  fillRect(grid, "stone_center", 41, 21, 20, 14);
  fillRect(grid, "stone_crack_0", 43, 23, 16, 1);
  fillRect(grid, "stone_crack_1", 43, 32, 16, 1);

  fillRect(grid, "water_center", 73, 8, 17, 9);
  fillRect(grid, "water_edge_top", 73, 8, 17, 1);
  fillRect(grid, "water_edge_bottom", 73, 16, 17, 1);
  fillRect(grid, "water_edge_left", 73, 8, 1, 9);
  fillRect(grid, "water_edge_right", 89, 8, 1, 9);
  place(grid, "water_corner_tl", 73, 8);
  place(grid, "water_corner_tr", 89, 8);
  place(grid, "water_corner_br", 89, 16);

  return grid;
}

export const townTileMap = {
  id: "society-cozy-town",
  tileSize: TILE_SIZE,
  cols: MAP_COLS,
  rows: MAP_ROWS,
  layers: [
    {
      id: "ground",
      type: "tilelayer",
      width: MAP_COLS,
      height: MAP_ROWS,
      data: buildGroundLayer()
    }
  ],
  spawns: [
    { name: "player", x: 50 * TILE_SIZE, y: 30 * TILE_SIZE },
    { name: "north-road", x: 50 * TILE_SIZE, y: 6 * TILE_SIZE },
    { name: "market-road", x: 76 * TILE_SIZE, y: 30 * TILE_SIZE }
  ]
};

const item = (id, itemId, col, row, options = {}) => ({
  id,
  itemId,
  x: (col + 0.5) * TILE_SIZE,
  y: (row + 1) * TILE_SIZE,
  w: options.w ?? TILE_SIZE,
  h: options.h ?? TILE_SIZE,
  collides: options.collides ?? false,
  collision: options.collision ?? null
});

export const townItems = [
  item("tree-northwest-1", "tree-round", 8, 6, { w: 72, h: 72, collides: true, collision: { w: 34, h: 24, offsetY: -8 } }),
  item("tree-northwest-2", "tree-apple", 20, 8, { w: 72, h: 72, collides: true, collision: { w: 34, h: 24, offsetY: -8 } }),
  item("bush-northwest", "bush-flower", 27, 14, { w: 44, h: 44, collides: true, collision: { w: 30, h: 24, offsetY: -8 } }),
  item("tree-east-1", "tree-round", 83, 22, { w: 72, h: 72, collides: true, collision: { w: 34, h: 24, offsetY: -8 } }),
  item("tree-east-2", "tree-apple", 88, 27, { w: 72, h: 72, collides: true, collision: { w: 34, h: 24, offsetY: -8 } }),
  item("rock-east", "rock-small", 76, 20, { w: 42, h: 42, collides: true, collision: { w: 28, h: 22, offsetY: -7 } }),
  item("bench-plaza-left", "bench", 44, 25, { w: 64, h: 40, collides: true, collision: { w: 52, h: 22, offsetY: -8 } }),
  item("bench-plaza-right", "bench", 56, 32, { w: 64, h: 40, collides: true, collision: { w: 52, h: 22, offsetY: -8 } }),
  item("sign-plaza", "signpost", 39, 28, { w: 44, h: 52, collides: true, collision: { w: 24, h: 18, offsetY: -8 } }),
  item("lamp-plaza-north", "lamp", 47, 20, { w: 44, h: 58, collides: true, collision: { w: 18, h: 18, offsetY: -8 } }),
  item("lamp-plaza-south", "lamp", 54, 37, { w: 44, h: 58, collides: true, collision: { w: 18, h: 18, offsetY: -8 } }),
  item("mailbox-plaza", "mailbox", 63, 28, { w: 40, h: 40, collides: true, collision: { w: 24, h: 20, offsetY: -8 } }),
  item("market-east", "market-stall", 76, 30, { w: 74, h: 58, collides: true, collision: { w: 58, h: 26, offsetY: -10 } }),
  item("notice-plaza", "notice-board", 51, 20, { w: 58, h: 50, collides: true, collision: { w: 38, h: 20, offsetY: -8 } }),
  item("crate-southwest", "crate", 22, 43, { w: 42, h: 42, collides: true, collision: { w: 30, h: 24, offsetY: -8 } }),
  item("barrel-southwest", "barrel", 24, 43, { w: 42, h: 42, collides: true, collision: { w: 28, h: 24, offsetY: -8 } }),
  item("flowers-west", "flower-red", 31, 38, { w: 42, h: 42 }),
  item("flowers-east", "flower-yellow", 70, 38, { w: 42, h: 42 }),
  item("stump-west", "stump", 13, 34, { w: 46, h: 42, collides: true, collision: { w: 30, h: 22, offsetY: -8 } }),
  item("fence-north-1", "fence-horizontal", 9, 10, { w: 42, h: 36, collides: true, collision: { w: 38, h: 18, offsetY: -10 } }),
  item("fence-north-2", "fence-horizontal", 13, 10, { w: 42, h: 36, collides: true, collision: { w: 38, h: 18, offsetY: -10 } }),
  item("fence-north-3", "fence-horizontal", 17, 10, { w: 42, h: 36, collides: true, collision: { w: 38, h: 18, offsetY: -10 } }),
  item("fence-north-4", "fence-horizontal", 21, 10, { w: 42, h: 36, collides: true, collision: { w: 38, h: 18, offsetY: -10 } }),
  item("fence-north-5", "fence-horizontal", 25, 10, { w: 42, h: 36, collides: true, collision: { w: 38, h: 18, offsetY: -10 } }),
  item("fence-west-1", "fence-vertical", 14, 38, { w: 34, h: 42, collides: true, collision: { w: 18, h: 38, offsetY: -16 } }),
  item("fence-west-2", "fence-vertical", 14, 42, { w: 34, h: 42, collides: true, collision: { w: 18, h: 38, offsetY: -16 } }),
  item("fence-west-3", "fence-vertical", 14, 46, { w: 34, h: 42, collides: true, collision: { w: 18, h: 38, offsetY: -16 } }),
  item("fence-west-4", "fence-vertical", 14, 50, { w: 34, h: 42, collides: true, collision: { w: 18, h: 38, offsetY: -16 } })
];

export function buildItemCollisionAreas(items = townItems) {
  return items
    .filter((entry) => entry.collides && entry.collision)
    .map((entry) => ({
      id: `item-${entry.id}`,
      x: entry.x,
      y: entry.y + (entry.collision.offsetY ?? 0),
      w: entry.collision.w,
      h: entry.collision.h
    }));
}

export function buildTileCollisionAreas(map = townTileMap) {
  const layer = map.layers.find((item) => item.id === "ground");
  if (!layer) return [];
  const size = map.tileSize;
  const areas = [];
  layer.data.forEach((row, rowIndex) => {
    row.forEach((tileId, colIndex) => {
      if (!collisionTileIds.has(tileId)) return;
      areas.push({
        id: `tile-${tileId}-${colIndex}-${rowIndex}`,
        x: colIndex * size + size / 2,
        y: rowIndex * size + size / 2,
        w: size,
        h: size
      });
    });
  });
  return areas;
}
