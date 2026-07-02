# Character Spritesheet Workflow

This workflow turns an image-generated 4-direction character sheet into a game-ready Phaser spritesheet.

## Target Format

- Frame size: `48x64`
- Grid: `4 columns x 4 rows`
- Total frames: `16`
- Output atlas size: `192x256`
- Row order used by the game data:
  - row 1: `down`
  - row 2: `up`
  - row 3: `left`
  - row 4: `right`

If the generated image swaps left and right rows, keep the PNG as-is and fix the `idle` / `walk` mapping in `src/data/alba.js`.

## 1. Generate The Source Image

Use `image_gen`, not a hand-coded placeholder, for the source art.

Prompt template:

```text
Use case: stylized-concept
Asset type: game character sprite sheet
Primary request: Create one complete pixel-art sprite sheet image of a cute <CHARACTER> walking upright or moving in a simple RPG style. Keep the character clearly <CHARACTER>-like and not human-like unless requested.
Style/medium: high-quality retro pixel art for a 2D RPG game, crisp edges, limited color palette, readable tiny character design.
Composition/framing: a clean sprite sheet grid with exactly 4 columns and 4 rows, 16 total frames. Each frame should show the same character centered in its cell, with consistent scale and alignment. Rows are walking directions in this exact order: row 1 front/down walk, row 2 back/up walk, row 3 left-facing side walk, row 4 right-facing side walk. Columns are the 4 walk animation frames for each direction.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background across the entire image, no shadows, no floor, no texture.
Constraints: one character only; exact 4x4 sprite sheet; no labels, no text, no frame numbers, no borders, no watermark; use generous empty padding within each cell so frames can be cropped into 48x64 sprites later.
Avoid: realistic photo, vector icon style, 3D render, painterly illustration, anti-pixel blur, multiple characters, props unless requested, background scenery.
```

Save the generated source into:

```text
src/assets/characters/<character-id>-generated-spritesheet.png
```

## 2. Process And Validate

Compile the reusable processor:

```powershell
& 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe' /nologo /r:System.Drawing.dll /out:tools\process-generated-character-spritesheet.exe tools\process-generated-character-spritesheet.cs
```

Run it:

```powershell
.\tools\process-generated-character-spritesheet.exe `
  --input src\assets\characters\<character-id>-generated-spritesheet.png `
  --output src\assets\characters\<character-id>.png `
  --transparent src\assets\characters\<character-id>-generated-transparent.png `
  --validation src\assets\characters\<character-id>-split-validation.png `
  --cols 4 `
  --rows 4 `
  --frame-width 48 `
  --frame-height 64 `
  --max-width 43 `
  --max-height 60 `
  --min-area 500
```

The processor does this in order:

1. Removes the green chroma-key background.
2. Detects the 16 separated sprite components from the transparent image.
3. Sorts them into rows and columns by detected position.
4. Writes a validation image with red numbered boxes.
5. Builds the final `48x64` cell atlas.

## 3. Required Validation

Open the validation image before wiring the character into the game:

```text
src/assets/characters/<character-id>-split-validation.png
```

Check:

- Exactly 16 red boxes exist.
- Each box wraps one full character frame.
- No frame includes part of another row or column.
- Numbering follows the expected animation order.
- Character scale is consistent across all rows.

If validation fails, regenerate the source image with stronger spacing language:

```text
Add wide empty green padding between rows and columns. Keep every sprite fully separated from all neighboring sprites.
```

## 4. Wire Into The Game

Add the generated atlas to `src/phaser/assets.js`:

```js
import characterUrl from "../assets/characters/<character-id>.png";

players: {
  "player-<character-id>": characterUrl
}
```

Add a character entry to `src/data/alba.js`:

```js
{
  id: "<character-id>",
  name: "<display name>",
  icon: "🐶",
  role: "<short description>",
  item: "<asset description>",
  sprite: {
    key: "player-<character-id>",
    frameWidth: 48,
    frameHeight: 64,
    displayWidth: 78,
    displayHeight: 104,
    offsetY: -18,
    idle: { down: 0, up: 4, left: 8, right: 12 },
    walk: {
      down: [0, 3],
      up: [4, 7],
      left: [8, 11],
      right: [12, 15]
    }
  }
}
```

Run:

```powershell
npm run build
```

## Current Dog Example

Source:

```text
src/assets/characters/dog-generated-spritesheet.png
```

Validation:

```text
src/assets/characters/dog-split-validation.png
```

Final atlas:

```text
src/assets/characters/dog-walk.png
```
