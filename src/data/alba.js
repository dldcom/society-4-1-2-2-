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
    engine: "orderCraft",
    rewardCoins: 300,
    energyCost: 1,
    goal: "주문 카드를 기억하고 토핑을 순서대로 올려요.",
    productionText: "피자를 만들어 손님이 먹을 수 있게 준비하는 일은 생산 활동이에요.",
    card: { id: "card-pizza-job", type: "production", badge: "🍕", title: "피자 만들기 알바", description: "주문에 맞게 피자를 만든 생산 활동", feedback: "사람들이 먹을 음식을 만드는 일은 생산 활동이에요." },
    config: { base: "🍕", revealMs: 2600, choices: ["🧀", "🍄", "🫒", "🌽", "🍅"], order: ["🧀", "🍄", "🫒", "🌽"] }
  },
  {
    id: "icecream-job",
    placeId: "icecream-shop",
    title: "아이스크림 가게 알바",
    shortTitle: "아이스크림 만들기",
    npc: "아이스크림 가게 주인",
    icon: "🍦",
    engine: "orderCraft",
    rewardCoins: 280,
    energyCost: 1,
    goal: "주문을 외워 콘, 맛, 토핑을 차례대로 골라요.",
    productionText: "손님이 먹을 아이스크림을 만드는 일은 생산 활동이에요.",
    card: { id: "card-icecream-job", type: "production", badge: "🍦", title: "아이스크림 만들기 알바", description: "주문에 맞게 아이스크림을 만든 생산 활동", feedback: "음식을 만들어 손님에게 제공하는 일은 생산 활동이에요." },
    config: { base: "🥄", revealMs: 2200, choices: ["🍦", "🍓", "🍫", "🍪", "🍒"], order: ["🍦", "🍓", "🍪"] }
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
    goal: "강아지와 고양이가 원하는 도구를 번갈아 골라 만족도를 채워요.",
    productionText: "손님과 동물이 편하게 지내도록 돕는 서비스도 생산 활동이에요.",
    card: { id: "card-pet-job", type: "production", badge: "🐾", title: "펫카페 돌봄 알바", description: "동물을 돌보고 손님을 돕는 생산 활동", feedback: "서비스를 제공해 사람들이 이용할 수 있게 하는 일도 생산 활동이에요." },
    config: {
      pets: [
        { id: "dog", icon: "🐕", name: "강아지", needs: ["간식", "물", "장난감"] },
        { id: "cat", icon: "🐈", name: "고양이", needs: ["빗", "간식", "물"] }
      ],
      tools: [
        { id: "snack", label: "간식", icon: "🦴" },
        { id: "water", label: "물", icon: "🥣" },
        { id: "brush", label: "빗", icon: "🪮" },
        { id: "toy", label: "장난감", icon: "🧸" }
      ]
    }
  },
  {
    id: "arcade-job",
    placeId: "game-center",
    title: "게임센터 스태프 알바",
    shortTitle: "전선 연결 수리",
    npc: "게임센터 사장님",
    icon: "🕹️",
    engine: "wirePuzzle",
    rewardCoins: 320,
    energyCost: 1,
    goal: "같은 색 단자를 연결하고 빠진 부품까지 끼워 게임기를 켜요.",
    productionText: "손님이 게임을 즐길 수 있도록 기계를 고치는 일은 생산 활동이에요.",
    card: { id: "card-arcade-job", type: "production", badge: "🕹️", title: "게임기 수리 알바", description: "고장 난 게임기를 고친 생산 활동", feedback: "서비스가 제대로 제공되도록 준비하고 고치는 일은 생산 활동이에요." },
    config: {
      gridSize: 5,
      wires: [
        { color: "red", start: [0, 0], end: [4, 4] },
        { color: "blue", start: [0, 4], end: [3, 1] },
        { color: "yellow", start: [1, 1], end: [2, 3] }
      ],
      parts: [{ id: "button", label: "버튼", icon: "🔴" }, { id: "lever", label: "레버", icon: "🕹️" }]
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
    id: "photo-job",
    placeId: "photo-studio",
    title: "사진관 촬영 알바",
    shortTitle: "사진 촬영",
    npc: "사진관 주인",
    icon: "📸",
    engine: "photoTiming",
    rewardCoins: 260,
    energyCost: 1,
    goal: "손님이 웃는 순간에 셔터를 눌러 선명한 사진을 찍어요.",
    productionText: "손님에게 사진 서비스를 제공하는 일은 생산 활동이에요.",
    card: { id: "card-photo-job", type: "production", badge: "📸", title: "사진 촬영 알바", description: "손님 사진을 찍어 준 생산 활동", feedback: "돈을 받고 사진 서비스를 제공하는 일은 생산 활동이에요." },
    config: { poses: ["🙂", "😐", "😁", "😉", "😁"] }
  },
  {
    id: "delivery-job",
    placeId: "bakery",
    title: "동네 배달 알바",
    shortTitle: "길찾기 배달",
    npc: "빵집 주인",
    icon: "🚲",
    engine: "deliveryGrid",
    rewardCoins: 280,
    energyCost: 1,
    goal: "장애물을 피해 목적지까지 가장 짧은 길로 배달해요.",
    productionText: "사람들이 물건을 받을 수 있게 배달하는 일은 생산 활동이에요.",
    card: { id: "card-delivery-job", type: "production", badge: "🚲", title: "동네 배달 알바", description: "물건을 목적지까지 배달한 생산 활동", feedback: "물건을 필요한 곳까지 옮기는 서비스도 생산 활동이에요." },
    config: { cols: 6, rows: 5, start: [0, 4], goal: [5, 0], blocks: [[2, 4], [2, 3], [2, 1], [4, 2], [1, 1]] }
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
    goal: "부품을 올바른 순서로 조립하고 전원을 켜요.",
    productionText: "배달 서비스에 쓰일 로봇을 고치는 일은 생산 활동이에요.",
    card: { id: "card-robot-job", type: "production", badge: "🤖", title: "배달 로봇 수리 알바", description: "배달 로봇을 고친 생산 활동", feedback: "사람들이 편리하게 서비스를 이용하도록 기계를 고치는 일은 생산 활동이에요." },
    config: { steps: [{ id: "body", icon: "⬛", label: "몸통" }, { id: "head", icon: "🤖", label: "머리" }, { id: "wheel", icon: "⚙️", label: "바퀴" }, { id: "power", icon: "🔋", label: "전원" }] }
  }
];

export const consumptions = [
  { id: "eat-pizza", placeId: "pizza-shop", title: "피자 한 조각 먹기", icon: "🍕", costCoins: 150, energyGain: 1, category: "recovery", resultSticker: "🍕", card: { id: "card-eat-pizza", type: "consumption", badge: "🍕", title: "피자 먹기", description: "번 코인으로 피자를 사 먹은 소비 활동", feedback: "돈을 내고 음식을 사 먹는 것은 소비 활동이에요." } },
  { id: "eat-icecream", placeId: "icecream-shop", title: "아이스크림 먹기", icon: "🍦", costCoins: 180, energyGain: 1, moodGain: 1, category: "recovery", resultSticker: "🍦", card: { id: "card-eat-icecream", type: "consumption", badge: "🍦", title: "아이스크림 먹기", description: "코인을 내고 간식을 산 소비 활동", feedback: "필요하거나 원하는 물건을 사는 것은 소비 활동이에요." } },
  { id: "buy-cape", placeId: "outfit-shop", title: "별 망토 사기", icon: "⭐", costCoins: 300, category: "outfit", equip: "별 망토", resultSticker: "⭐", card: { id: "card-buy-cape", type: "consumption", badge: "⭐", title: "별 망토 사기", description: "번 코인으로 꾸미기 물건을 산 소비 활동", feedback: "돈을 내고 물건을 사는 것도 소비 활동이에요." } },
  { id: "watch-show", placeId: "stage", title: "공연 보기", icon: "🎟️", costCoins: 250, category: "service", resultSticker: "🎟️", card: { id: "card-watch-show", type: "consumption", badge: "🎟️", title: "공연 보기", description: "코인을 내고 공연 서비스를 이용한 소비 활동", feedback: "돈을 내고 서비스를 이용하는 것도 소비 활동이에요." } },
  { id: "take-photo", placeId: "photo-studio", title: "기념사진 찍기", icon: "🖼️", costCoins: 200, category: "service", resultSticker: "🖼️", card: { id: "card-take-photo", type: "consumption", badge: "🖼️", title: "기념사진 찍기", description: "사진관 서비스를 이용한 소비 활동", feedback: "돈을 내고 사진 서비스를 이용하는 것은 소비 활동이에요." } },
  { id: "play-arcade", placeId: "game-center", title: "미니 오락기 하기", icon: "🎮", costCoins: 200, category: "service", resultSticker: "🎮", card: { id: "card-play-arcade", type: "consumption", badge: "🎮", title: "게임센터 이용하기", description: "코인을 내고 게임 서비스를 이용한 소비 활동", feedback: "돈을 내고 즐길 수 있는 서비스를 이용하는 것도 소비 활동이에요." } }
];

export const activityPlaces = [
  { id: "board", label: "알바 게시판", hint: "오늘 할 수 있는 알바를 확인해요." },
  ...jobs.map((job) => ({ id: job.placeId, label: job.shortTitle, hint: job.goal })),
  ...consumptions.map((item) => ({ id: item.placeId, label: item.title, hint: `${item.costCoins}코인 사용` }))
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

