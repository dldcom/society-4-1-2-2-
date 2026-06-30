export const WORLD = {
  width: 3200,
  height: 1792,
  playerSpeed: 230,
  interactionRadius: 150
};

export const PLACE_OVERRIDE_KEY = "alba-town-place-overrides-v1";
export const BLOCKED_AREA_KEY = "alba-town-blocked-areas-v1";

export const defaultPlaces = [
  { id: "board", name: "알바 게시판", x: 1600, y: 1030, w: 230, building: "packing-room", icon: "📋", npc: { name: "게시판 지기", role: "마을 안내원", portrait: "📋", sprite: 0, greeting: "왔구나! 오늘만 열리는 특별 알바 게시판이야. 어디부터 가 볼지 같이 골라 보자.", jobLine: "여기 붙은 일들은 전부 마을 사람들이 직접 부탁한 거야. 마음 가는 일부터 골라 봐.", shopLine: "무언가 사고 싶다면 가게 주인에게 말을 걸어 봐. 번 코인을 어디에 쓸지도 중요한 선택이거든." } },
  { id: "pizza-shop", name: "피자집", x: 2485, y: 695, w: 300, building: "bakery", icon: "🍕", npc: { name: "루카 사장님", role: "피자집 사장", portrait: "👨‍🍳", sprite: 1, greeting: "어서 와! 마침 오븐이 쉬질 못하고 있어. 손 좀 빌려줄래?", jobLine: "주문표만 잘 보면 어렵지 않아. 도우 위에 토핑을 차례대로 올려 주면 돼.", shopLine: "일 끝나고 배고프면 한 조각 먹고 가. 따끈할 때가 제일 맛있거든." } },
  { id: "icecream-shop", name: "아이스크림", x: 2415, y: 1650, w: 305, building: "cafeteria", icon: "🍦", npc: { name: "소라 점장님", role: "아이스크림 가게", portrait: "🧁", sprite: 2, greeting: "어서 와! 냉동고 안에서 달콤한 냄새가 나는 것 같지 않아?", jobLine: "손님 주문을 잠깐 외워 뒀다가 그대로 담아 주면 돼. 자신 있지?", shopLine: "오늘은 기분이 좀 처질 때 딱 좋은 맛이 있어. 하나 골라 볼래?" } },
  { id: "pet-cafe", name: "펫카페", x: 990, y: 680, w: 300, building: "stationery-shop", icon: "🐾", npc: { name: "마루 사장님", role: "펫카페 사장", portrait: "🐶", sprite: 3, greeting: "쉿, 아이들이 낮잠에서 막 깼어. 같이 놀아 줄 사람이 필요했는데 잘 왔다.", jobLine: "간식, 물, 장난감만 잘 챙겨도 아이들 표정이 금방 밝아질 거야.", shopLine: "오늘은 물건을 팔기보다 아이들 돌보는 일이 먼저야. 그래도 구경은 얼마든지 해." } },
  { id: "game-center", name: "게임센터", x: 805, y: 1660, w: 310, building: "convenience-store", icon: "🕹️", npc: { name: "진우 사장님", role: "게임센터 사장", portrait: "🕹️", sprite: 4, greeting: "삐빅! 방금 또 한 대가 멈췄어. 이런 날엔 손 빠른 친구가 필요하지.", jobLine: "색깔 전선만 헷갈리지 않으면 돼. 연결하고 버튼까지 끼우면 다시 켜질 거야.", shopLine: "수리 말고 놀러 온 거라면 미니 오락기도 있어. 한 판 해 볼래?" } },
  { id: "stage", name: "공연장", x: 2360, y: 1210, w: 330, building: "theater", icon: "🎤", npc: { name: "하린 매니저", role: "공연장 매니저", portrait: "🎤", sprite: 5, greeting: "어서 와. 공연 전 무대 뒤는 늘 정신없어. 네가 와 줘서 다행이야.", jobLine: "조명은 번쩍, 마이크는 딱 맞게. 타이밍만 맞추면 공연이 훨씬 살아나.", shopLine: "오늘 무대 꽤 좋아. 일 말고 관객으로 보고 가도 후회 안 할걸." } },
  { id: "outfit-shop", name: "옷가게", x: 1575, y: 1625, w: 305, building: "hair-salon", icon: "⭐", npc: { name: "별이 점원", role: "옷가게 점원", portrait: "⭐", sprite: 6, greeting: "어서 와. 오늘따라 망토들이 반짝반짝해서 그냥 지나치기 어렵지?", jobLine: "가게 일은 내가 맡을게. 대신 마음에 드는 옷이 있으면 마음껏 둘러봐.", shopLine: "별 망토는 입는 순간 기분이 달라져. 오늘 번 코인으로 자신에게 선물해도 좋아." } },
  { id: "bakery", name: "빵집", x: 820, y: 1190, w: 330, building: "parcel-center", icon: "🥐", npc: { name: "단비 주인", role: "빵집 주인", portrait: "🥐", sprite: 7, greeting: "어서 와! 빵 냄새 따라 여기까지 온 거지? 마침 부탁할 일이 있어.", jobLine: "식기 전에 배달해야 해. 길만 잘 찾으면 손님이 정말 좋아할 거야.", shopLine: "지금은 배달이 밀려서 정신이 없어. 조금만 도와주면 정말 고맙겠다." } },
  { id: "plaza", name: "광장", x: 1600, y: 705, w: 330, building: "school", icon: "🏛️", npc: { name: "로봇 박사", role: "마을 연구자", portrait: "🤖", sprite: 8, greeting: "아, 잘 왔다! 배달 로봇이 광장 한가운데서 멈춰 버렸어.", jobLine: "몸통, 머리, 바퀴, 전원. 순서대로만 맞추면 다시 씩씩하게 움직일 거야.", shopLine: "광장엔 살 물건은 별로 없어도 들을 이야기는 많단다. 잠깐 쉬어 가도 좋아." } },
  { id: "photo-studio", name: "사진관", x: 3000, y: 1085, w: 185, building: "bus-stop", icon: "📸", npc: { name: "온유 작가", role: "사진관 주인", portrait: "📸", sprite: 9, greeting: "어서 와. 좋은 표정은 정말 한순간이라, 셔터 누를 사람이 늘 필요해.", jobLine: "손님이 활짝 웃을 때 찰칵! 그 순간을 놓치지 않는 게 제일 중요해.", shopLine: "사진은 나중에 보면 그날의 기분까지 떠오르거든. 한 장 남겨 볼래?" } }
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

