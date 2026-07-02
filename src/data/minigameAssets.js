const modules = import.meta.glob([
  "../assets/items/minigames/*.png",
  "!../assets/items/minigames/*sheet*.png",
  "!../assets/items/minigames/*preview*.png"
], { eager: true, import: "default" });

export const minigameAssets = Object.fromEntries(
  Object.entries(modules).map(([path, source]) => {
    const file = path.split("/").pop();
    return [file.replace(/\.png$/, ""), source];
  })
);

const commonTokenAssets = {
  "🐕": "pet-dog",
  "🐈": "pet-cat",
  "🐇": "pet-rabbit",
  "🐶": "pet-puppy",
  "🦴": "pet-bone",
  "🥣": "water-bowl",
  "🪮": "pet-brush",
  "🧸": "toy-ball",
  "💗": "pet-heart",
  "🫧": "pet-bath",
  "🛏️": "pet-bed",
  "📷": "pet-camera",
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
    "🍅": "pizza-tomato",
    "🥓": "pizza-pepperoni",
    "🌿": "pizza-basil",
    "🧅": "pizza-onion"
  },
  "icecream-job": {
    "🥄": "icecream-cup",
    "🍦": "icecream-cone",
    "🍓": "scoop-strawberry",
    "🍫": "scoop-chocolate",
    "🍪": "cookie-topping",
    "🍒": "cherry-topping",
    "🍯": "caramel-syrup",
    "🍨": "scoop-vanilla"
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
    leftWheel: "robot-wheel-left",
    rightWheel: "robot-wheel-right",
    battery: "battery",
    power: "battery",
    antenna: "robot-antenna",
    circuit: "circuit-panel",
    spark: "spark-plug",
    snack: "pet-bone",
    water: "water-bowl",
    brush: "pet-brush",
    toy: "toy-ball",
    cuddle: "pet-heart",
    bath: "pet-bath",
    bed: "pet-bed",
    photo: "pet-camera"
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
