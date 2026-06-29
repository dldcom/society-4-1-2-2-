export const WORLD = {
  width: 3200,
  height: 1800,
  playerSpeed: 230,
  interactionRadius: 135
};

export const PLACE_OVERRIDE_KEY = "society-town-place-overrides-v1";
export const BLOCKED_AREA_KEY = "society-town-blocked-areas-v1";

export const defaultPlaces = [
  // Coordinates are building foot anchors, not image centers.
  // Buildings use origin (0.5, 1), so the sprite bottom center sits on the dirt pad.
  { id: "stationery", name: "문구점", x: 990, y: 680, w: 300, building: "stationery-shop" },
  { id: "school", name: "학교", x: 1600, y: 705, w: 330, building: "school" },
  { id: "bakery", name: "빵집", x: 2485, y: 695, w: 300, building: "bakery" },
  { id: "parcel", name: "택배센터", x: 820, y: 1190, w: 330, building: "parcel-center" },
  { id: "stage", name: "공연장", x: 2360, y: 1210, w: 330, building: "theater" },
  { id: "store", name: "편의점", x: 805, y: 1660, w: 310, building: "convenience-store" },
  { id: "hair", name: "미용실", x: 1575, y: 1625, w: 305, building: "hair-salon" },
  { id: "cafeteria", name: "급식실", x: 2415, y: 1650, w: 305, building: "cafeteria" },
  { id: "bus", name: "버스정류장", x: 3000, y: 1085, w: 185, building: "bus-stop" },
  { id: "pack", name: "포장실", x: 1600, y: 1020, w: 240, building: "packing-room" }
];

export const defaultBlockedAreas = [];

export function loadPlaceOverrides() {
  if (typeof window === "undefined") return {};
  try {
    const saved = window.localStorage.getItem(PLACE_OVERRIDE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function applyPlaceOverrides(list = defaultPlaces, overrides = loadPlaceOverrides()) {
  return list.map((place) => {
    const override = overrides[place.id];
    if (!override) return place;
    return {
      ...place,
      x: Number.isFinite(override.x) ? override.x : place.x,
      y: Number.isFinite(override.y) ? override.y : place.y,
      w: Number.isFinite(override.w) ? override.w : place.w
    };
  });
}

export function loadBlockedAreas() {
  if (typeof window === "undefined") return defaultBlockedAreas;
  try {
    const saved = window.localStorage.getItem(BLOCKED_AREA_KEY);
    if (!saved) return defaultBlockedAreas;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return defaultBlockedAreas;
    return parsed.filter((area) => (
      area &&
      typeof area.id === "string" &&
      Number.isFinite(area.x) &&
      Number.isFinite(area.y) &&
      Number.isFinite(area.w) &&
      Number.isFinite(area.h)
    ));
  } catch {
    return defaultBlockedAreas;
  }
}

export const places = applyPlaceOverrides();
export const blockedAreas = loadBlockedAreas();

export function buildCollisions(placeList = places) {
  return placeList.map((place) => ({
    id: place.id,
    x: place.x,
    y: place.y - 26,
    w: place.w * 0.72,
    h: 62
  }));
}

export const collisions = [
  ...buildCollisions(),
  ...blockedAreas.map((area) => ({ ...area, id: `blocked-${area.id}` }))
];

export function findPlaceForMission(mission, placeList = places) {
  const direct = placeList.find((place) => mission.place.includes(place.name) || place.name.includes(mission.place));
  if (direct) return direct;
  if (mission.place.includes("포장")) return placeList.find((place) => place.id === "pack");
  if (mission.place.includes("무대") || mission.place.includes("공연")) return placeList.find((place) => place.id === "stage");
  if (mission.place.includes("미용")) return placeList.find((place) => place.id === "hair");
  if (mission.place.includes("버스") || mission.place.includes("정류장")) return placeList.find((place) => place.id === "bus");
  if (mission.place.includes("편의점")) return placeList.find((place) => place.id === "store");
  if (mission.place.includes("택배") || mission.place.includes("골목") || mission.place.includes("집")) return placeList.find((place) => place.id === "parcel");
  if (mission.place.includes("빵") || mission.place.includes("오븐") || mission.place.includes("재료")) return placeList.find((place) => place.id === "bakery");
  if (mission.place.includes("문구") || mission.place.includes("정리")) return placeList.find((place) => place.id === "stationery");
  if (mission.place.includes("급식") || mission.place.includes("우유")) return placeList.find((place) => place.id === "cafeteria");
  return placeList[0];
}
