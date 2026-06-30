import Phaser from "phaser";
import { assetUrls } from "../assets.js";
import { WORLD, collisions, places } from "../../data/world.js";
import { buildItemCollisionAreas, buildTileCollisionAreas, tileLookup, townItems, townTileMap } from "../../data/townTileMap.js";

const touchInput = { up: false, down: false, left: false, right: false };

export class TownScene extends Phaser.Scene {
  constructor() {
    super("TownScene");
    this.player = null;
    this.playerSprite = null;
    this.playerIcon = null;
    this.questMarker = null;
    this.itemCollisions = [];
    this.tileCollisions = [];
    this.lastNearId = "";
    this.lastDir = "down";
  }

  preload() {
    this.load.spritesheet("cozy-town-tileset", assetUrls.tilesets.cozyTown, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("player-cat", assetUrls.player, {
      frameWidth: 192,
      frameHeight: 192
    });
    this.load.spritesheet("town-npcs", assetUrls.npcs, {
      frameWidth: 64,
      frameHeight: 96
    });
    Object.entries(assetUrls.buildings).forEach(([key, url]) => {
      this.load.image(`building-${key}`, url);
    });
    Object.entries(assetUrls.townItems).forEach(([key, url]) => {
      this.load.image(`town-item-${key}`, url);
    });
  }

  create() {
    this.bridge = this.game.registry.get("bridge");
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    this.itemCollisions = buildItemCollisionAreas();
    this.tileCollisions = buildTileCollisionAreas();

    this.renderTileMap();
    this.renderTownItems();
    places.forEach((place) => this.addPlace(place));
    places.forEach((place) => this.addNpc(place));
    this.createPlayerAnimations();
    this.createPlayer();

    this.questMarker = this.add.text(0, 0, "★", {
      fontFamily: "Arial",
      fontSize: "38px",
      color: "#3b2b24",
      backgroundColor: "#ffd94f",
      padding: { x: 10, y: 2 }
    }).setOrigin(0.5).setDepth(5000);
    this.questMarker.setVisible(false);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.05);

    this.keys = this.input.keyboard.addKeys({
      up: "W",
      down: "S",
      left: "A",
      right: "D",
      arrowUp: "UP",
      arrowDown: "DOWN",
      arrowLeft: "LEFT",
      arrowRight: "RIGHT",
      interact: "SPACE"
    });

    window.addEventListener("town-control", this.handleTouchControl);
    this.events.once("shutdown", () => window.removeEventListener("town-control", this.handleTouchControl));
    this.events.once("destroy", () => window.removeEventListener("town-control", this.handleTouchControl));
  }

  handleTouchControl = (event) => {
    const { dir, pressed } = event.detail;
    if (dir in touchInput) touchInput[dir] = pressed;
  };

  addPlace(place) {
    const sprite = this.add.image(place.x, place.y, `building-${place.building}`);
    sprite.setOrigin(0.5, 1);
    sprite.setDisplaySize(place.w, place.w * 0.74);
    sprite.setDepth(place.y);

    this.add.text(place.x, place.y + 20, `${place.icon ?? ""} ${place.name}`, {
      fontFamily: "Arial",
      fontSize: "22px",
      fontStyle: "bold",
      color: "#fff8df",
      stroke: "#4b3324",
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(place.y + 2);
  }

  addNpc(place) {
    const npc = place.npc;
    if (!npc) return;
    const x = place.x + Math.min(96, place.w * 0.28);
    const y = place.y + 18;
    const shadow = this.add.ellipse(x, y + 24, 42, 14, 0x000000, 0.2).setDepth(y - 1);
    const sprite = this.add.sprite(x, y - 18, "town-npcs", npc.sprite ?? 0);
    sprite.setDisplaySize(64, 96);
    sprite.setDepth(y + 1);
    this.tweens.add({ targets: sprite, y: y - 21, duration: 900 + ((npc.sprite ?? 0) * 70), yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.add.text(x, y + 42, npc.name, {
      fontFamily: "Arial",
      fontSize: "15px",
      fontStyle: "bold",
      color: "#fff8df",
      stroke: "#4b3324",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(y + 2);
  }
  createPlayer() {
    const state = this.bridge.getState();
    const character = state.playerCharacter ?? { icon: "😺" };
    this.player = this.add.container(WORLD.width * 0.5, WORLD.height * 0.58);
    const shadow = this.add.ellipse(0, 32, 58, 20, 0x000000, 0.22);
    this.playerSprite = this.add.sprite(0, -14, "player-cat", 0);
    this.playerSprite.setDisplaySize(104, 104);
    this.playerIcon = this.add.text(34, -46, character.icon, {
      fontFamily: "Arial",
      fontSize: "20px",
      backgroundColor: "#fff8df",
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5).setDepth(2);
    this.player.add([shadow, this.playerSprite, this.playerIcon]);
    this.player.setDepth(3000);
  }

  renderTileMap() {
    const tileSize = townTileMap.tileSize;
    const scaleX = WORLD.width / (townTileMap.cols * tileSize);
    const scaleY = WORLD.height / (townTileMap.rows * tileSize);
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (WORLD.width - townTileMap.cols * tileSize * scale) / 2;
    const offsetY = (WORLD.height - townTileMap.rows * tileSize * scale) / 2;
    const layer = townTileMap.layers.find((item) => item.id === "ground");
    if (!layer) return;

    layer.data.forEach((row, rowIndex) => {
      row.forEach((tileId, colIndex) => {
        const tile = tileLookup[tileId];
        if (!tile) return;
        const sprite = this.add.image(
          offsetX + (colIndex + 0.5) * tileSize * scale,
          offsetY + (rowIndex + 0.5) * tileSize * scale,
          "cozy-town-tileset",
          tile.index
        );
        sprite.setDisplaySize(tileSize * scale, tileSize * scale);
        sprite.setDepth(0);
      });
    });
  }

  renderTownItems() {
    townItems.forEach((item) => {
      const sprite = this.add.image(item.x, item.y, `town-item-${item.itemId}`);
      sprite.setOrigin(0.5, 1);
      sprite.setDisplaySize(item.w, item.h);
      sprite.setDepth(item.y);
    });
  }

  createPlayerAnimations() {
    const create = (key, start, end) => {
      if (this.anims.exists(key)) return;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers("player-cat", { start, end }),
        frameRate: 7,
        repeat: -1
      });
    };
    create("cat-walk-down", 0, 3);
    create("cat-walk-left", 4, 7);
    create("cat-walk-right", 8, 11);
    create("cat-walk-up", 12, 15);
  }

  update(_time, deltaMs) {
    const state = this.bridge.getState();
    const playerIcon = state.playerCharacter?.icon ?? "😺";
    if (this.playerIcon.text !== playerIcon) this.playerIcon.setText(playerIcon);

    const movement = this.movePlayer(deltaMs);
    this.updatePlayerAnimation(movement);
    this.player.setDepth(this.player.y + 50);

    const nearPlace = this.findNearestActionPlace(state.actionPlaceIds ?? []);
    const nearId = nearPlace?.id ?? "";
    if (nearId !== this.lastNearId) {
      this.lastNearId = nearId;
      this.bridge.onNearChange(nearPlace ?? null);
    }

    if (nearPlace) {
      this.questMarker.setVisible(true);
      this.questMarker.setPosition(nearPlace.x, nearPlace.y - nearPlace.w * 0.58);
    } else {
      this.questMarker.setVisible(false);
    }

    if (nearPlace && Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
      this.bridge.onInteract(nearPlace);
    }
  }

  findNearestActionPlace(actionPlaceIds) {
    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    places.forEach((place) => {
      if (actionPlaceIds.length && !actionPlaceIds.includes(place.id)) return;
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, place.x, place.y);
      if (distance < WORLD.interactionRadius && distance < bestDistance) {
        best = place;
        bestDistance = distance;
      }
    });
    return best;
  }

  movePlayer(deltaMs) {
    let dx = 0;
    let dy = 0;
    if (this.keys.up.isDown || this.keys.arrowUp.isDown || touchInput.up) dy -= 1;
    if (this.keys.down.isDown || this.keys.arrowDown.isDown || touchInput.down) dy += 1;
    if (this.keys.left.isDown || this.keys.arrowLeft.isDown || touchInput.left) dx -= 1;
    if (this.keys.right.isDown || this.keys.arrowRight.isDown || touchInput.right) dx += 1;
    if (!dx && !dy) return null;

    const length = Math.hypot(dx, dy);
    const speed = WORLD.playerSpeed * (deltaMs / 1000);
    const nextX = Phaser.Math.Clamp(this.player.x + (dx / length) * speed, 48, WORLD.width - 48);
    const nextY = Phaser.Math.Clamp(this.player.y + (dy / length) * speed, 64, WORLD.height - 48);
    const dir = Math.abs(dx) > Math.abs(dy)
      ? (dx < 0 ? "left" : "right")
      : (dy < 0 ? "up" : "down");

    if (!this.collides(nextX, nextY)) {
      this.player.setPosition(nextX, nextY);
      return dir;
    }
    return null;
  }

  updatePlayerAnimation(dir) {
    if (!this.playerSprite) return;
    if (!dir) {
      this.playerSprite.anims.stop();
      const idleFrame = { down: 0, left: 4, right: 8, up: 12 }[this.lastDir] ?? 0;
      this.playerSprite.setFrame(idleFrame);
      return;
    }
    this.lastDir = dir;
    const key = `cat-walk-${dir}`;
    if (this.playerSprite.anims.currentAnim?.key !== key) {
      this.playerSprite.play(key, true);
    }
  }

  collides(x, y) {
    return [...collisions, ...this.tileCollisions, ...this.itemCollisions].some((rect) => (
      x > rect.x - rect.w / 2 &&
      x < rect.x + rect.w / 2 &&
      y > rect.y - rect.h / 2 &&
      y < rect.y + rect.h / 2
    ));
  }
}


