export const WORLD = {
  width: 3200,
  height: 1792,
  playerSpeed: 230,
  interactionRadius: 150
};

import committedLayout from "./worldLayout.json";

export const PLACE_OVERRIDE_KEY = "alba-town-place-overrides-v1";
export const BLOCKED_AREA_KEY = "alba-town-blocked-areas-v1";

export const defaultPlaces = [
  { id: "board", name: "알바 게시판", x: 1600, y: 1030, w: 230, building: "packing-room", icon: "📋", npc: { name: "게시판 지기", role: "마을 안내원", portrait: "📋", sprite: 0, greeting: "왔구나! 오늘 마을이 꽤 분주하지? 게시판 앞은 늘 새로운 소식이 모이는 곳이야.", jobLine: "여기 붙은 일들은 전부 마을 사람들이 직접 부탁한 거야. 마음 가는 일부터 골라 봐.", shopLine: "무언가 사고 싶다면 가게 주인에게 말을 걸어 봐. 번 돈을 어디에 쓸지도 중요한 선택이거든." } },
  { id: "pizza-shop", name: "피자집", x: 2485, y: 695, w: 300, building: "bakery", icon: "🍕", npc: { name: "루카 사장님", role: "피자집 사장", portrait: "👨‍🍳", sprite: 1, greeting: "어서 와! 오븐에서 막 나온 냄새가 가게 밖까지 퍼졌지?", jobLine: "마침 오븐이 쉬질 못하고 있어. 주문표만 잘 보면 어렵지 않아. 도우 위에 토핑을 차례대로 올려 주면 돼.", shopLine: "배고프면 한 조각 먹고 가. 따끈할 때가 제일 맛있거든." } },
  { id: "icecream-shop", name: "아이스크림", x: 2415, y: 1650, w: 305, building: "cafeteria", icon: "🍦", npc: { name: "소라 점장님", role: "아이스크림 가게", portrait: "🧁", sprite: 2, greeting: "어서 와! 냉동고 안에서 달콤한 냄새가 나는 것 같지 않아?", jobLine: "손님 주문을 잠깐 외워 뒀다가 그대로 담아 주면 돼. 자신 있지?", shopLine: "오늘은 기분이 좀 처질 때 딱 좋은 맛이 있어. 하나 골라 볼래?" } },
  { id: "pet-cafe", name: "펫카페", x: 990, y: 680, w: 300, building: "stationery-shop", icon: "🐾", npc: { name: "마루 사장님", role: "펫카페 사장", portrait: "🐶", sprite: 3, greeting: "쉿, 아이들이 낮잠에서 막 깼어. 천천히 둘러봐도 괜찮아.", jobLine: "같이 놀아 줄 사람이 필요했는데 잘 왔다. 간식, 물, 장난감만 잘 챙겨도 아이들 표정이 금방 밝아질 거야.", shopLine: "오늘은 물건을 팔기보다 아이들 돌보는 일이 먼저야. 그래도 구경은 얼마든지 해." } },
  { id: "game-center", name: "택배센터", x: 805, y: 1660, w: 310, building: "post-office", icon: "📦", npc: { name: "진우 센터장", role: "택배센터 센터장", portrait: "📦", sprite: 4, greeting: "어서 와! 오늘도 상자가 산처럼 들어왔어. 제대로 분류하면 마을 사람들이 제때 물건을 받을 수 있지.", jobLine: "컨베이어가 막 돌기 시작했어. 상자 라벨을 보고 맞는 방향으로 빠르게 보내 주면 돼.", shopLine: "배송 작업이 끝나면 잠깐 쉬어 가도 좋아. 여긴 늘 바쁘지만 사람 사는 냄새가 나거든." } },
  { id: "stage", name: "공연장", x: 2360, y: 1210, w: 330, building: "theater", icon: "🎤", npc: { name: "하린 매니저", role: "공연장 매니저", portrait: "🎤", sprite: 5, greeting: "어서 와. 무대 뒤는 늘 조금 시끄럽지만, 그게 공연장 맛이지.", jobLine: "공연 전이라 손이 조금 모자라. 조명은 번쩍, 마이크는 딱 맞게. 타이밍만 맞추면 공연이 훨씬 살아나.", shopLine: "오늘 무대 꽤 좋아. 일 말고 관객으로 보고 가도 후회 안 할걸." } },
  { id: "outfit-shop", name: "옷가게", x: 1575, y: 1625, w: 305, building: "hair-salon", icon: "⭐", npc: { name: "별이 점원", role: "옷가게 점원", portrait: "⭐", sprite: 6, greeting: "어서 와. 오늘따라 망토들이 반짝반짝해서 그냥 지나치기 어렵지?", jobLine: "가게 일은 내가 맡을게. 대신 마음에 드는 옷이 있으면 마음껏 둘러봐.", shopLine: "별 망토는 입는 순간 기분이 달라져. 오늘 번 돈으로 자신에게 선물해도 좋아." } },
  { id: "bakery", name: "빵집", x: 820, y: 1190, w: 330, building: "bakery", icon: "🥐", npc: { name: "단비 주인", role: "빵집 주인", portrait: "🥐", sprite: 7, greeting: "어서 와! 빵 냄새 따라 여기까지 온 거지? 오늘은 버터 향이 특히 좋아.", jobLine: "오븐에 빵이 들어가 있어. 노릇노릇한 순간에 꺼내야 제일 맛있어.", shopLine: "갓 구운 빵 냄새가 좋지? 오늘은 오븐 앞이 제일 바쁜 자리야." } },
  { id: "plaza", name: "광장", x: 1600, y: 705, w: 330, building: "school", icon: "🏛️", npc: { name: "로봇 박사", role: "마을 연구자", portrait: "🤖", sprite: 8, greeting: "아, 안녕. 광장은 늘 소란스럽지만 그래서 관찰할 게 많단다.", jobLine: "배달 로봇이 광장 한가운데서 멈춰 버렸어. 몸통, 머리, 바퀴, 전원. 순서대로만 맞추면 다시 씩씩하게 움직일 거야.", shopLine: "광장엔 살 물건은 별로 없어도 들을 이야기는 많단다. 잠깐 쉬어 가도 좋아." } }
];

const committedPlaceOverrides = normalizePlaceOverrides(committedLayout.places);
export const defaultBlockedAreas = normalizeBlockedAreas(committedLayout.blockedAreas);

export function loadPlaceOverrides() {
  const base = { ...committedPlaceOverrides };
  if (typeof window === "undefined") return base;
  try {
    const saved = window.localStorage.getItem(PLACE_OVERRIDE_KEY);
    return saved ? { ...base, ...normalizePlaceOverrides(JSON.parse(saved)) } : base;
  } catch {
    return base;
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
    return normalizeBlockedAreas(JSON.parse(saved));
  } catch {
    return defaultBlockedAreas;
  }
}

function normalizePlaceOverrides(overrides) {
  if (!overrides || typeof overrides !== "object" || Array.isArray(overrides)) return {};
  return Object.fromEntries(Object.entries(overrides).filter(([, value]) => (
    value &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.y) &&
    Number.isFinite(value.w)
  )));
}

function normalizeBlockedAreas(areas) {
  if (!Array.isArray(areas)) return [];
  return areas.filter((area) => (
    area &&
    typeof area.id === "string" &&
    Number.isFinite(area.x) &&
    Number.isFinite(area.y) &&
    Number.isFinite(area.w) &&
    Number.isFinite(area.h)
  ));
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

