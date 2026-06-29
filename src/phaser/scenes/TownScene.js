import Phaser from "phaser";
import { assetUrls } from "../assets.js";
import { WORLD, collisions, findPlaceForMission, places } from "../../data/world.js";

const touchInput = { up: false, down: false, left: false, right: false };

export class TownScene extends Phaser.Scene {
  constructor() {
    super("TownScene");
    this.player = null;
    this.playerIcon = null;
    this.questMarker = null;
    this.lastMissionId = "";
    this.lastNear = false;
  }

  preload() {
    this.load.image("town-map", assetUrls.map);
    Object.entries(assetUrls.buildings).forEach(([key, url]) => {
      this.load.image(`building-${key}`, url);
    });
  }

  create() {
    this.bridge = this.game.registry.get("bridge");
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);

    const map = this.add.image(0, 0, "town-map").setOrigin(0);
    map.setDisplaySize(WORLD.width, WORLD.height);

    places.forEach((place) => this.addPlace(place));
    this.createPlayer();

    this.questMarker = this.add.text(0, 0, "!", {
      fontFamily: "Arial",
      fontSize: "42px",
      color: "#3b2b24",
      backgroundColor: "#ffd94f",
      padding: { x: 12, y: 3 }
    }).setOrigin(0.5).setDepth(5000);

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

    this.add.text(place.x, place.y + 20, place.name, {
      fontFamily: "Arial",
      fontSize: "22px",
      fontStyle: "bold",
      color: "#fff8df",
      stroke: "#4b3324",
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(place.y + 2);
  }

  createPlayer() {
    const state = this.bridge.getState();
    const character = state.playerCharacter ?? state.character;
    this.player = this.add.container(WORLD.width * 0.5, WORLD.height * 0.58);
    const shadow = this.add.ellipse(0, 24, 58, 22, 0x000000, 0.22);
    const body = this.add.rectangle(0, 0, 56, 64, 0xfff3c4, 1).setStrokeStyle(4, 0x4b3324);
    this.playerIcon = this.add.text(0, -4, character.icon, {
      fontFamily: "Arial",
      fontSize: "32px"
    }).setOrigin(0.5);
    this.player.add([shadow, body, this.playerIcon]);
    this.player.setDepth(3000);
  }

  update(_time, deltaMs) {
    const state = this.bridge.getState();
    const mission = state.character.missions[state.missionIndex];
    if (!mission) return;

    const playerIcon = state.playerCharacter?.icon ?? state.character.icon;
    if (this.playerIcon.text !== playerIcon) {
      this.playerIcon.setText(playerIcon);
    }

    const target = findPlaceForMission(mission);
    this.questMarker.setPosition(target.x, target.y - target.w * 0.58);

    if (mission.id !== this.lastMissionId) {
      this.lastMissionId = mission.id;
      this.lastNear = false;
      this.bridge.onNearChange(false);
    }

    this.movePlayer(deltaMs);
    this.player.setDepth(this.player.y + 50);

    const near = Phaser.Math.Distance.Between(this.player.x, this.player.y, target.x, target.y) < WORLD.interactionRadius;
    if (near !== this.lastNear) {
      this.lastNear = near;
      this.bridge.onNearChange(near);
    }
    if (near && Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
      this.bridge.onInteract();
    }
  }

  movePlayer(deltaMs) {
    let dx = 0;
    let dy = 0;
    if (this.keys.up.isDown || this.keys.arrowUp.isDown || touchInput.up) dy -= 1;
    if (this.keys.down.isDown || this.keys.arrowDown.isDown || touchInput.down) dy += 1;
    if (this.keys.left.isDown || this.keys.arrowLeft.isDown || touchInput.left) dx -= 1;
    if (this.keys.right.isDown || this.keys.arrowRight.isDown || touchInput.right) dx += 1;
    if (!dx && !dy) return;

    const length = Math.hypot(dx, dy);
    const speed = WORLD.playerSpeed * (deltaMs / 1000);
    const nextX = Phaser.Math.Clamp(this.player.x + (dx / length) * speed, 48, WORLD.width - 48);
    const nextY = Phaser.Math.Clamp(this.player.y + (dy / length) * speed, 64, WORLD.height - 48);

    if (!this.collides(nextX, nextY)) {
      this.player.setPosition(nextX, nextY);
    }
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
