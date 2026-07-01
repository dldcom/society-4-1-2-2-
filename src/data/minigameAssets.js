const modules = import.meta.glob("../assets/items/minigames/*.png", { eager: true, import: "default" });

export const minigameAssets = Object.fromEntries(
  Object.entries(modules).map(([path, source]) => {
    const file = path.split("/").pop();
    return [file.replace(/\.png$/, ""), source];
  })
);

const commonTokenAssets = {
  "🐕": "pet-dog",
  "🐈": "pet-cat",
  "🦴": "pet-bone",
  "🥣": "water-bowl",
  "🪮": "pet-brush",
  "🧸": "toy-ball",
  "🔴": "button-red",
  "🕹️": "arcade-lever",
  "💡": "stage-light",
  "🎤": "microphone",
  "👏": "clap-icon",
  "🙂": "smile-target",
  "😐": "photo-frame",
  "😁": "smile-target",
  "😉": "camera",
  "⬛": "robot-body",
  "🤖": "robot-head",
  "⚙️": "robot-wheel",
  "🔋": "battery"
};

const orderTokenAssets = {
  "pizza-job": {
    "🍕": "pizza-dough",
    "🧀": "pizza-cheese",
    "🍄": "pizza-mushroom",
    "🫒": "pizza-olive",
    "🌽": "pizza-corn",
    "🍅": "pizza-tomato"
  },
  "icecream-job": {
    "🥄": "icecream-cup",
    "🍦": "scoop-vanilla",
    "🍓": "scoop-strawberry",
    "🍫": "scoop-chocolate",
    "🍪": "cookie-topping",
    "🍒": "cherry-topping"
  }
};

export function getMiniAsset(id) {
  return minigameAssets[id] ?? null;
}

export function getMiniAssetForToken(token, jobId) {
  return orderTokenAssets[jobId]?.[token] ?? commonTokenAssets[token] ?? null;
}

export function getMiniAssetForPart(part) {
  const partAssets = {
    button: "button-red",
    lever: "arcade-lever",
    body: "robot-body",
    head: "robot-head",
    wheel: "robot-wheel",
    power: "battery",
    snack: "pet-bone",
    water: "water-bowl",
    brush: "pet-brush",
    toy: "toy-ball"
  };

  return partAssets[part?.id] ?? getMiniAssetForToken(part?.icon);
}

export function getMiniAssetForWire(color) {
  return {
    red: "wire-red",
    blue: "wire-blue",
    yellow: "wire-yellow"
  }[color] ?? null;
}
