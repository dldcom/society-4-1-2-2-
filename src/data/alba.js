export const playerCharacters = [
  {
    id: "cat",
    name: "고양이 알바생",
    icon: "😺",
    role: "가볍고 빠르게 마을을 누비는 고양이 캐릭터",
    item: "기존 고양이 스프라이트",
    sprite: {
      key: "player-cat",
      frameWidth: 192,
      frameHeight: 192,
      displayWidth: 104,
      displayHeight: 104,
      offsetY: -14,
      idle: { down: 0, left: 4, right: 8, up: 12 },
      walk: {
        down: [0, 3],
        left: [4, 7],
        right: [8, 11],
        up: [12, 15]
      }
    }
  },
  {
    id: "village-boy",
    name: "마을 소년",
    icon: "🧢",
    role: "초록 모자와 파란 재킷을 입은 픽셀아트 남자아이",
    item: "농장 RPG풍 남자 캐릭터",
    sprite: {
      key: "player-village-boy",
      frameWidth: 48,
      frameHeight: 64,
      displayWidth: 78,
      displayHeight: 104,
      offsetY: -18,
      idle: { down: 0, up: 6, right: 12, left: 18 },
      walk: {
        down: [0, 5],
        up: [6, 11],
        right: [12, 17],
        left: [18, 23]
      }
    }
  },
  {
    id: "farmer",
    name: "꼬마 농부",
    icon: "🌱",
    role: "밭일에도 마을 심부름에도 씩씩한 농부 캐릭터",
    item: "농부 캐릭터 스프라이트",
    sprite: {
      key: "player-farmer",
      frameWidth: 48,
      frameHeight: 64,
      displayWidth: 78,
      displayHeight: 104,
      offsetY: -18,
      idle: { down: 0, up: 6, right: 12, left: 18 },
      walk: {
        down: [0, 5],
        up: [6, 11],
        right: [12, 17],
        left: [18, 23]
      }
    }
  }
];

export const playerCharacter = playerCharacters[0];
export const jobs = [
  {
    id: "pizza-job",
    placeId: "pizza-shop",
    title: "피자집 토핑 알바",
    shortTitle: "피자 토핑",
    npc: "피자집 사장님",
    icon: "🍕",
    engine: "pizzaCraft",
    rewardCoins: 300,
    energyCost: 1,
    goal: "주문 카드를 기억하고 토핑을 순서대로 올려요.",
    productionText: "피자를 만들어 손님이 먹을 수 있게 준비하는 일은 생산 활동이에요.",
    card: { id: "card-pizza-job", type: "production", badge: "🍕", title: "피자 만들기 알바", description: "주문에 맞게 피자를 만든 생산 활동", feedback: "사람들이 먹을 음식을 만드는 일은 생산 활동이에요." },
    config: {
      base: "🍕",
      revealMs: 3000,
      choices: ["🧀", "🍄", "🫒", "🌽", "🍅", "🥓", "🌿", "🧅"],
      orders: [
        ["🧀", "🍄", "🍅", "🥓"],
        ["🌽", "🫒", "🧀", "🌿"],
        ["🍅", "🧅", "🍄", "🥓"]
      ]
    }
  },
  {
    id: "icecream-job",
    placeId: "icecream-shop",
    title: "아이스크림 가게 알바",
    shortTitle: "아이스크림 만들기",
    npc: "아이스크림 가게 주인",
    icon: "🍦",
    engine: "icecreamStack",
    rewardCoins: 280,
    energyCost: 1,
    goal: "손님 주문에 맞게 아이스크림을 차례대로 쌓아요.",
    productionText: "손님이 먹을 아이스크림을 만드는 일은 생산 활동이에요.",
    card: { id: "card-icecream-job", type: "production", badge: "🍦", title: "아이스크림 만들기 알바", description: "주문에 맞게 아이스크림을 만든 생산 활동", feedback: "음식을 만들어 손님에게 제공하는 일은 생산 활동이에요." },
    config: {
      choices: ["🍦", "🥄", "🍨", "🍓", "🍫", "🍪", "🍒", "🍯"],
      orders: [
        ["🍦", "🍨", "🍓", "🍒"],
        ["🥄", "🍫", "🍨", "🍪"],
        ["🍦", "🍓", "🍫", "🍯"]
      ]
    }
  },
  {
    id: "pet-job",
    placeId: "pet-cafe",
    title: "펫카페 도우미 알바",
    shortTitle: "펫카페 돌봄",
    npc: "펫카페 사장님",
    icon: "🐶",
    engine: "careGauge",
    rewardCoins: 260,
    energyCost: 1,
    goal: "동물 말풍선에 뜬 요구를 보고 알맞은 아이콘을 드래그해 돌봐요.",
    productionText: "손님과 동물이 편하게 지내도록 돕는 서비스도 생산 활동이에요.",
    card: { id: "card-pet-job", type: "production", badge: "🐾", title: "펫카페 돌봄 알바", description: "동물을 돌보고 손님을 돕는 생산 활동", feedback: "서비스를 제공해 사람들이 이용할 수 있게 하는 일도 생산 활동이에요." },
    config: {
      pets: [
        { id: "dog", asset: "pet-dog", icon: "🐕", name: "코기", needs: ["snack", "toy", "water"] },
        { id: "cat", asset: "pet-cat", icon: "🐈", name: "태비", needs: ["brush", "cuddle", "snack"] },
        { id: "rabbit", asset: "pet-rabbit", icon: "🐇", name: "토끼", needs: ["water", "bed", "cuddle"] },
        { id: "puppy", asset: "pet-puppy", icon: "🐶", name: "푸들", needs: ["bath", "toy", "photo"] }
      ],
      targetCare: 10,
      tools: [
        { id: "snack", label: "간식", icon: "🦴" },
        { id: "water", label: "물", icon: "🥣" },
        { id: "brush", label: "빗", icon: "🪮" },
        { id: "toy", label: "장난감", icon: "🧸" },
        { id: "cuddle", label: "쓰담", icon: "💗" },
        { id: "bath", label: "목욕", icon: "🫧" },
        { id: "bed", label: "휴식", icon: "🛏️" },
        { id: "photo", label: "사진", icon: "📷" }
      ]
    }
  },
  {
    id: "stage-job",
    placeId: "stage",
    title: "공연장 스태프 알바",
    shortTitle: "공연 준비",
    npc: "공연장 매니저",
    icon: "🎤",
    engine: "roleRhythm",
    rewardCoins: 350,
    energyCost: 1,
    goal: "노트에 맞는 역할 버튼을 눌러 무대 타이밍을 맞춰요.",
    productionText: "사람들이 공연을 즐길 수 있게 무대를 준비하는 일은 생산 활동이에요.",
    card: { id: "card-stage-job", type: "production", badge: "🎤", title: "공연장 준비 알바", description: "무대와 조명을 준비한 생산 활동", feedback: "즐길 수 있는 서비스를 준비하고 제공하는 일은 생산 활동이에요." },
    config: {
      notes: ["💡", "🎤", "👏", "💡", "👏", "🎤", "💡", "🎤", "👏", "👏", "💡", "🎤"],
      targetHits: 9,
      beatMs: 720,
      travelMs: 1800,
      hitWindowMs: 260,
      roles: [
        { icon: "💡", label: "조명", key: "A", keys: ["KeyA", "ArrowLeft"] },
        { icon: "🎤", label: "마이크", key: "S", keys: ["KeyS", "ArrowDown"] },
        { icon: "👏", label: "응원", key: "D", keys: ["KeyD", "ArrowRight"] }
      ]
    }
  },
  {
    id: "delivery-job",
    placeId: "game-center",
    title: "택배 분류 컨베이어 알바",
    shortTitle: "택배 분류",
    npc: "택배센터 직원",
    icon: "📦",
    engine: "conveyorSort",
    rewardCoins: 280,
    energyCost: 1,
    goal: "상자가 중앙 분기점에 올 때 목적지에 맞는 방향을 눌러 분류해요.",
    productionText: "택배를 주소에 맞게 분류하면 사람들이 물건을 받을 수 있어요. 분류와 운반을 돕는 일도 생산 활동이에요.",
    card: { id: "card-delivery-job", type: "production", badge: "📦", title: "택배 분류 알바", description: "주소에 맞게 택배를 분류한 생산 활동", feedback: "물건이 필요한 사람에게 도착하도록 나누고 보내는 일도 생산 활동이에요." },
    config: {
      targetHits: 8,
      beatMs: 1120,
      travelMs: 1800,
      hitWindowMs: 270,
      lanes: [
        { id: "school", label: "학교", icon: "🏫", direction: "up", key: "↑", keys: ["ArrowUp", "KeyW"] },
        { id: "stage", label: "공연장", icon: "🎤", direction: "left", key: "←", keys: ["ArrowLeft", "KeyA"] },
        { id: "bakery", label: "빵집", icon: "🥐", direction: "right", key: "→", keys: ["ArrowRight", "KeyD"] },
        { id: "store", label: "편의점", icon: "🏪", direction: "down", key: "↓", keys: ["ArrowDown", "KeyS"] }
      ],
      parcels: ["school", "bakery", "store", "stage", "school", "store", "bakery", "stage", "store", "school", "stage", "bakery"]
    }
  },
  {
    id: "bread-job",
    placeId: "bakery",
    title: "빵굽기 오븐 알바",
    shortTitle: "빵굽기",
    npc: "빵집 주인",
    icon: "🥐",
    engine: "breadBake",
    rewardCoins: 290,
    energyCost: 1,
    goal: "게이지가 초록색 구간에 들어오면 빵을 꺼내요.",
    productionText: "빵을 알맞게 구워 손님이 먹을 수 있게 만드는 일은 생산 활동이에요.",
    card: { id: "card-bread-job", type: "production", badge: "🥐", title: "빵굽기 알바", description: "빵을 알맞게 구운 생산 활동", feedback: "사람들이 먹을 음식을 만드는 일은 생산 활동이에요." },
    config: {
      targetBakes: 6,
      ovens: [
        { id: "croissant", label: "크루아상", icon: "🥐", bakeMs: 4000, perfectWindowMs: 1050 },
        { id: "bread", label: "식빵", icon: "🍞", bakeMs: 5600, perfectWindowMs: 1250 },
        { id: "cookie", label: "쿠키", icon: "🍪", bakeMs: 2600, perfectWindowMs: 900 }
      ]
    }
  },
  {
    id: "robot-job",
    placeId: "plaza",
    title: "배달 로봇 수리 알바",
    shortTitle: "로봇 조립",
    npc: "로봇 연구 박사",
    icon: "🤖",
    engine: "sequenceBuild",
    rewardCoins: 330,
    energyCost: 1,
    goal: "부품을 알맞은 위치에 드래그해서 배달 로봇을 조립해요.",
    productionText: "배달 서비스에 쓰일 로봇을 고치는 일은 생산 활동이에요.",
    card: { id: "card-robot-job", type: "production", badge: "🤖", title: "배달 로봇 수리 알바", description: "배달 로봇을 고친 생산 활동", feedback: "사람들이 편리하게 서비스를 이용하도록 기계를 고치는 일은 생산 활동이에요." },
    config: {
      slots: [
        { id: "body", label: "몸통", x: 50, y: 58 },
        { id: "head", label: "머리", x: 50, y: 31 },
        { id: "leftWheel", asset: "robot-wheel-left", label: "왼쪽 바퀴", x: 36, y: 77 },
        { id: "rightWheel", asset: "robot-wheel-right", label: "오른쪽 바퀴", x: 64, y: 77 },
        { id: "battery", label: "배터리", x: 39, y: 55 },
        { id: "antenna", label: "안테나", x: 50, y: 14 },
        { id: "circuit", asset: "circuit-panel", label: "회로판", x: 61, y: 55 }
      ],
      parts: [
        { id: "body", icon: "⬛", label: "몸통" },
        { id: "head", icon: "🤖", label: "머리" },
        { id: "leftWheel", asset: "robot-wheel-left", label: "왼쪽 바퀴" },
        { id: "rightWheel", asset: "robot-wheel-right", label: "오른쪽 바퀴" },
        { id: "battery", icon: "🔋", label: "배터리" },
        { id: "antenna", asset: "robot-antenna", label: "안테나" },
        { id: "circuit", asset: "circuit-panel", label: "회로판" }
      ],
      prefilled: ["body", "head"]
    }
  }
];

export const consumptions = [
  { id: "eat-pizza", placeId: "pizza-shop", title: "피자 한 조각 먹기", icon: "🍕", costCoins: 150, energyGain: 1, category: "recovery", resultSticker: "🍕", card: { id: "card-eat-pizza", type: "consumption", badge: "🍕", title: "피자 먹기", description: "번 돈으로 피자를 사 먹은 소비 활동", feedback: "돈을 내고 음식을 사 먹는 것은 소비 활동이에요." } },
  { id: "eat-icecream", placeId: "icecream-shop", title: "아이스크림 먹기", icon: "🍦", costCoins: 180, energyGain: 1, moodGain: 1, category: "recovery", resultSticker: "🍦", card: { id: "card-eat-icecream", type: "consumption", badge: "🍦", title: "아이스크림 먹기", description: "돈을 내고 간식을 산 소비 활동", feedback: "필요하거나 원하는 물건을 사는 것은 소비 활동이에요." } },
  { id: "buy-cape", placeId: "outfit-shop", title: "별 망토 사기", icon: "⭐", costCoins: 300, category: "outfit", equip: "별 망토", resultSticker: "⭐", card: { id: "card-buy-cape", type: "consumption", badge: "⭐", title: "별 망토 사기", description: "번 돈으로 꾸미기 물건을 산 소비 활동", feedback: "돈을 내고 물건을 사는 것도 소비 활동이에요." } },
  { id: "watch-show", placeId: "stage", title: "공연 보기", icon: "🎟️", costCoins: 250, category: "service", resultSticker: "🎟️", card: { id: "card-watch-show", type: "consumption", badge: "🎟️", title: "공연 보기", description: "돈을 내고 공연 서비스를 이용한 소비 활동", feedback: "돈을 내고 서비스를 이용하는 것도 소비 활동이에요." } }
];

export const activityPlaces = [
  { id: "board", label: "알바 게시판", hint: "오늘 할 수 있는 알바를 확인해요." },
  ...jobs.map((job) => ({ id: job.placeId, label: job.shortTitle, hint: job.goal })),
  ...consumptions.map((item) => ({ id: item.placeId, label: item.title, hint: `${item.costCoins}원 사용` }))
];

export function getJobsAtPlace(placeId) {
  return jobs.filter((job) => job.placeId === placeId);
}

export function getConsumptionsAtPlace(placeId) {
  return consumptions.filter((item) => item.placeId === placeId);
}

export function uniqueCards(cards) {
  return cards.filter((card, index, list) => list.findIndex((item) => item.id === card.id) === index);
}

