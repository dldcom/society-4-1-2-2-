import Phaser from "phaser";
import { TownScene } from "./scenes/TownScene.js";

export function createGame(parent, bridge) {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 1280,
    height: 720,
    backgroundColor: "#14251d",
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [TownScene]
  });

  game.registry.set("bridge", bridge);
  return game;
}
