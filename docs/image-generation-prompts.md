# Image Generation Prompts

Use one consistent art direction across every asset:

- Original cozy Korean neighborhood pixel-art look, inspired by classic top-down farming RPG warmth but not copying any existing game.
- Top-down/isometric-leaning 2D game asset style.
- Chunky readable shapes for elementary school students.
- Warm daylight, clear silhouettes, no text embedded in images.
- Pixel-art feel with clean edges, but polished enough for a web game.

## 1. Base Town Map

Use case: stylized-concept
Asset type: web game top-down base map
Primary request: A cozy top-down village map for an elementary social studies web game, without any buildings.
Scene/backdrop: Korean neighborhood village with winding dirt paths, grass, small plaza, flower beds, fences, trees, a small pond, crosswalk-like paths, and clearly prepared empty pads where buildings will be placed later.
Subject: environment-only base map, no buildings, no characters.
Style/medium: original warm pixel-art game background, top-down 2D, tile-map feeling, crisp readable shapes.
Composition/framing: wide landscape map, 16:9, designed as a playable game map with open walking space and empty building lots around the map.
Lighting/mood: bright friendly daytime, cheerful classroom-safe mood.
Color palette: fresh grass greens, warm dirt roads, soft blue water, small colorful flowers, gentle shadows.
Constraints: no buildings, no labels, no letters, no people, no UI, no watermark, no logo.
Avoid: copying Stardew Valley, dark fantasy, realistic photo look, heavy blur, tiny unreadable details.

Suggested filename: `src/assets/maps/base-town-map.png`

## 2. Building Spritesheet

Use case: stylized-concept
Asset type: transparent building spritesheet for top-down web game
Primary request: A single spritesheet of cozy pixel-art Korean neighborhood buildings for an elementary social studies game.
Subject: school, cafeteria, stationery shop, bakery, parcel delivery center, convenience store, bus stop, hair salon, small theater, packing room.
Style/medium: original warm pixel-art game asset style, top-down/isometric-leaning 2D, consistent camera angle and lighting.
Composition/framing: clean grid layout, one building per cell, generous padding between sprites.
Lighting/mood: bright friendly daytime.
Color palette: varied but harmonious, readable silhouettes.
Constraints: transparent or flat chroma-key background, no text, no signs with readable letters, no characters, no watermark.
Avoid: copying existing game assets, realistic photos, inconsistent perspective.

Spritesheet order: 5 columns x 2 rows.

Top row:

1. school
2. cafeteria
3. stationery shop
4. bakery
5. parcel delivery center

Bottom row:

6. convenience store
7. bus stop
8. hair salon
9. small theater
10. packing room

Suggested filename: `src/assets/buildings/building-spritesheet.png`

## 3. Character Sprite Test

Use case: stylized-concept
Asset type: character sprite sheet
Primary request: A cute original pixel-art child helper character for a social studies web game.
Subject: milk lunch helper wearing a small milk cap, white apron, and carrying a small cooler bag.
Style/medium: top-down farming-RPG-like pixel-art sprite, original design, kid-friendly, crisp silhouette.
Composition/framing: sprite sheet grid with idle and walking frames facing down, up, left, and right; 3 frames per direction.
Lighting/mood: cheerful and warm.
Constraints: transparent or flat chroma-key background, no text, no watermark, consistent scale.
Avoid: copying existing game characters, overly detailed anime style, realistic proportions.

Suggested filename: `src/assets/characters/milk-idle.png` first, then `milk-walk-sheet.png`.
