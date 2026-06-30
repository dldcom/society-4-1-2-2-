export const WORLD = {
  width: 3200,
  height: 1792,
  playerSpeed: 230,
  interactionRadius: 150
};

export const PLACE_OVERRIDE_KEY = "alba-town-place-overrides-v1";
export const BLOCKED_AREA_KEY = "alba-town-blocked-areas-v1";

export const defaultPlaces = [
  { id: "board", name: "알바 게시판", x: 1600, y: 1030, w: 230, building: "packing-room", icon: "📋" },
  { id: "pizza-shop", name: "피자집", x: 2485, y: 695, w: 300, building: "bakery", icon: "🍕" },
  { id: "icecream-shop", name: "아이스크림", x: 2415, y: 1650, w: 305, building: "cafeteria", icon: "🍦" },
  { id: "pet-cafe", name: "펫카페", x: 990, y: 680, w: 300, building: "stationery-shop", icon: "🐾" },
  { id: "game-center", name: "게임센터", x: 805, y: 1660, w: 310, building: "convenience-store", icon: "🕹️" },
  { id: "stage", name: "공연장", x: 2360, y: 1210, w: 330, building: "theater", icon: "🎤" },
  { id: "outfit-shop", name: "옷가게", x: 1575, y: 1625, w: 305, building: "hair-salon", icon: "⭐" },
  { id: "bakery", name: "빵집", x: 820, y: 1190, w: 330, building: "parcel-center", icon: "🥐" },
  { id: "plaza", name: "광장", x: 1600, y: 705, w: 330, building: "school", icon: "🏛️" },
  { id: "photo-studio", name: "사진관", x: 3000, y: 1085, w: 185, building: "bus-stop", icon: "📸" }
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

export function findPlaceById(placeId, placeList = places) {
  return placeList.find((place) => place.id === placeId) ?? placeList[0];
}

export function findPlaceForMission(mission, placeList = places) {
  return findPlaceById(mission?.placeId, placeList);
}

