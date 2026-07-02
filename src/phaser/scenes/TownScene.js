import Phaser from "phaser";
import { assetUrls } from "../assets.js";
import { WORLD, collisions, places } from "../../data/world.js";

const touchInput = { up: false, down: false, left: false, right: false };

export class TownScene extends Phaser.Scene {
  constructor() {
    super("TownScene");
    this.player = null;
    this.playerSprite = null;
    this.playerSpriteConfig = null;
    this.playerAnimPrefix = "player";
    this.questMarker = null;
    this.placeSprites = new Map();
    this.activeGlowId = "";
    this.activeGlowTween = null;
    this.activeSparkleTweens = [];
    this.npcSprites = new Map();
    this.interactionLockedUntil = 0;
    this.lastInputLocked = false;
    this.lastActivePlaceId = null;
    this.lastNearId = "";
    this.lastDir = "down";
  }

  preload() {
    this.load.image("base-town-map", assetUrls.maps.baseTown);
    Object.entries(assetUrls.players).forEach(([key, url]) => {
      const size = key === "player-cat"
        ? { frameWidth: 192, frameHeight: 192 }
        : { frameWidth: 48, frameHeight: 64 };
      this.load.spritesheet(key, url, size);
    });
    this.load.spritesheet("town-npcs", assetUrls.npcs, {
      frameWidth: 64,
      frameHeight: 96
    });
    Object.entries(assetUrls.buildings).forEach(([key, url]) => {
      this.load.image(`building-${key}`, url);
    });
  }

  create() {
    this.bridge = this.game.registry.get("bridge");
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    this.renderBaseMap();
    places.forEach((place) => this.addPlace(place));
    places.forEach((place) => this.addNpc(place));
    this.createPlayer();
    this.createPlayerAnimations();

    this.questMarker = this.add.text(0, 0, "⭐", {
      fontFamily: "Arial",
      fontSize: "34px",
      color: "#ffd94f",
      stroke: "#3b2b24",
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 3, color: "#3b2b24", blur: 0, fill: true }
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
    const glow = this.add.image(place.x, place.y, `building-${place.building}`);
    glow.setOrigin(0.5, 1);
    glow.setDisplaySize(place.w * 1.08, place.w * 0.8);
    glow.setDepth(place.y - 1);
    glow.setTint(0xffe27a);
    glow.setAlpha(0);
    glow.setVisible(false);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    const glowBaseScale = { x: glow.scaleX, y: glow.scaleY };

    const sprite = this.add.image(place.x, place.y, `building-${place.building}`);
    sprite.setOrigin(0.5, 1);
    sprite.setDisplaySize(place.w, place.w * 0.74);
    sprite.setDepth(place.y);
    const spriteBaseScale = { x: sprite.scaleX, y: sprite.scaleY };

    const sparkleOffsets = [
      { x: -place.w * 0.36, y: -place.w * 0.58, delay: 0 },
      { x: place.w * 0.34, y: -place.w * 0.5, delay: 180 },
      { x: 0, y: -place.w * 0.78, delay: 360 }
    ];
    const sparkles = sparkleOffsets.map(({ x, y }) => this.add.text(place.x + x, place.y + y, "✦", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#fff2a8",
      stroke: "#7a4a27",
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(place.y + 3).setVisible(false).setAlpha(0));

    this.placeSprites.set(place.id, { sprite, spriteBaseScale, glow, glowBaseScale, sparkles, sparkleOffsets, place });

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
    const idleFrame = (npc.sprite ?? 0) * 2;
    const shadow = this.add.ellipse(x, y + 24, 42, 14, 0x000000, 0.2).setDepth(y - 1);
    const sprite = this.add.sprite(x, y - 18, "town-npcs", idleFrame);
    sprite.setDisplaySize(64, 96);
    sprite.setDepth(y + 1);
    this.npcSprites.set(place.id, {
      sprite,
      idleFrame,
      talkingFrame: idleFrame + 1
    });
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
    const character = state.playerCharacter ?? {};
    this.playerSpriteConfig = character.sprite ?? {
      key: "player-cat",
      displayWidth: 104,
      displayHeight: 104,
      offsetY: -14,
      idle: { down: 0, left: 4, right: 8, up: 12 },
      walk: { down: [0, 3], left: [4, 7], right: [8, 11], up: [12, 15] }
    };
    this.playerAnimPrefix = this.playerSpriteConfig.key;
    this.player = this.add.container(WORLD.width * 0.5, WORLD.height * 0.58);
    const shadow = this.add.ellipse(0, 32, 58, 20, 0x000000, 0.22);
    this.playerSprite = this.add.sprite(0, this.playerSpriteConfig.offsetY ?? -14, this.playerSpriteConfig.key, this.playerSpriteConfig.idle?.down ?? 0);
    this.playerSprite.setDisplaySize(this.playerSpriteConfig.displayWidth ?? 104, this.playerSpriteConfig.displayHeight ?? 104);
    this.player.add([shadow, this.playerSprite]);
    this.player.setDepth(3000);
  }

  renderBaseMap() {
    this.add.image(WORLD.width / 2, WORLD.height / 2, "base-town-map")
      .setDisplaySize(WORLD.width, WORLD.height)
      .setDepth(0);
  }
  createPlayerAnimations() {
    const config = this.playerSpriteConfig;
    if (!config?.walk || !config.key) return;
    const create = (key, start, end) => {
      if (this.anims.exists(key)) return;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(config.key, { start, end }),
        frameRate: 7,
        repeat: -1
      });
    };
    Object.entries(config.walk).forEach(([dir, range]) => {
      create(`${this.playerAnimPrefix}-walk-${dir}`, range[0], range[1]);
    });
  }

  update(_time, deltaMs) {
    const state = this.bridge.getState();
    const activePlaceId = state.activePlaceId ?? null;
    const inputLocked = Boolean(state.inputLocked || activePlaceId);
    if ((this.lastActivePlaceId && !activePlaceId) || (this.lastInputLocked && !inputLocked)) {
      this.interactionLockedUntil = this.time.now + 350;
      this.input.keyboard.resetKeys();
      Object.keys(touchInput).forEach((dir) => {
        touchInput[dir] = false;
      });
    }
    this.lastActivePlaceId = activePlaceId;
    this.lastInputLocked = inputLocked;

    const movement = inputLocked ? null : this.movePlayer(deltaMs);
    this.updatePlayerAnimation(movement);
    this.updateNpcTalkingState(activePlaceId);
    this.player.setDepth(this.player.y + 50);

    const nearPlace = this.findNearestActionPlace(state.actionPlaceIds ?? []);
    const nearId = nearPlace?.id ?? "";
    if (nearId !== this.lastNearId) {
      this.lastNearId = nearId;
      this.bridge.onNearChange(nearPlace ?? null);
    }

    this.questMarker.setVisible(false);
    this.updatePlaceGlow(nearPlace);

    if (
      !activePlaceId &&
      !inputLocked &&
      this.time.now >= this.interactionLockedUntil &&
      nearPlace &&
      Phaser.Input.Keyboard.JustDown(this.keys.interact)
    ) {
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

  updatePlaceGlow(nearPlace) {
    const nextId = nearPlace?.id ?? "";
    if (nextId === this.activeGlowId) return;

    if (this.activeGlowTween) {
      this.activeGlowTween.stop();
      this.activeGlowTween = null;
    }
    this.activeSparkleTweens.forEach((tween) => tween.stop());
    this.activeSparkleTweens = [];

    if (this.activeGlowId) {
      const previous = this.placeSprites.get(this.activeGlowId);
      previous?.sprite.clearTint();
      if (previous?.spriteBaseScale) previous.sprite.setScale(previous.spriteBaseScale.x, previous.spriteBaseScale.y);
      if (previous?.glow) {
        previous.glow.setVisible(false);
        previous.glow.setAlpha(0);
        if (previous.glowBaseScale) previous.glow.setScale(previous.glowBaseScale.x, previous.glowBaseScale.y);
      }
      previous?.sparkles?.forEach((sparkle, index) => {
        const offset = previous.sparkleOffsets[index];
        sparkle.setVisible(false);
        sparkle.setAlpha(0);
        sparkle.setScale(1);
        if (offset && previous.place) sparkle.setPosition(previous.place.x + offset.x, previous.place.y + offset.y);
      });
    }

    this.activeGlowId = nextId;
    if (!nextId) return;

    const current = this.placeSprites.get(nextId);
    if (!current) return;
    current.sprite.setTint(0xfff4bc);
    current.glow.setVisible(true);
    current.glow.setAlpha(0.28);
    current.glow.setScale(current.glowBaseScale.x, current.glowBaseScale.y);
    this.activeGlowTween = this.tweens.add({
      targets: current.glow,
      alpha: { from: 0.2, to: 0.5 },
      scaleX: { from: current.glowBaseScale.x, to: current.glowBaseScale.x * 1.035 },
      scaleY: { from: current.glowBaseScale.y, to: current.glowBaseScale.y * 1.035 },
      duration: 720,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
    this.activeSparkleTweens.push(this.tweens.add({
      targets: current.sprite,
      scaleX: { from: current.spriteBaseScale.x, to: current.spriteBaseScale.x * 1.012 },
      scaleY: { from: current.spriteBaseScale.y, to: current.spriteBaseScale.y * 1.012 },
      duration: 720,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    }));
    current.sparkles.forEach((sparkle, index) => {
      const offset = current.sparkleOffsets[index];
      sparkle.setPosition(nearPlace.x + offset.x, nearPlace.y + offset.y);
      sparkle.setVisible(true);
      sparkle.setAlpha(0);
      sparkle.setScale(0.7);
      this.activeSparkleTweens.push(this.tweens.add({
        targets: sparkle,
        alpha: { from: 0, to: 1 },
        scale: { from: 0.7, to: 1.18 },
        y: sparkle.y - 8,
        duration: 680,
        delay: offset.delay,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      }));
    });
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
      const idleFrame = this.playerSpriteConfig?.idle?.[this.lastDir] ?? 0;
      this.playerSprite.setFrame(idleFrame);
      return;
    }
    this.lastDir = dir;
    const key = `${this.playerAnimPrefix}-walk-${dir}`;
    if (this.playerSprite.anims.currentAnim?.key !== key) {
      this.playerSprite.play(key, true);
    }
  }

  updateNpcTalkingState(activePlaceId) {
    this.npcSprites.forEach((entry, placeId) => {
      const nextFrame = activePlaceId === placeId ? entry.talkingFrame : entry.idleFrame;
      if (String(entry.sprite.frame.name) !== String(nextFrame)) {
        entry.sprite.setFrame(nextFrame);
      }
    });
  }

  collides(x, y) {
    return collisions.some((rect) => (
      x > rect.x - rect.w / 2 &&
      x < rect.x + rect.w / 2 &&
      y > rect.y - rect.h / 2 &&
      y < rect.y + rect.h / 2
    ));
  }
}





