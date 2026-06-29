const characters = [
  {
    id: "milk",
    name: "우유 급식 도우미",
    icon: "🥛",
    palette: ["#f6fbff", "#74b6d9"],
    role: "학교 급식실에 우유가 안전하게 도착하도록 도와요.",
    npc: "급식 선생님",
    intro: "우유가 도착했어요. 학생들이 안전하게 마실 수 있도록 도와줄래요?",
    item: "우유 모자와 냉장 가방",
    learningPoint: "운반은 물건을 새로 만드는 일은 아니지만, 사람들이 사용할 수 있는 상태로 만들어 주는 일이에요.",
    missions: [
      mission("milk_check", "우유 검사하기", "우유가 안전한지 확인했어요.", "production", "inspection", "우유 보급소", "우유가 안전한지 확인하는 것도 생산 활동이에요.", ["검사 배지", "🔍"]),
      mission("milk_pack", "우유 포장하기", "우유를 상자에 담고 포장했어요.", "production", "packing", "포장실", "포장은 사람들이 편리하게 사용할 수 있도록 준비하는 생산 활동이에요.", ["포장 배지", "📦"]),
      mission("milk_move", "우유 학교까지 운반하기", "우유를 냉장 트럭에 실어 학교까지 옮겼어요.", "production", "delivery", "학교 급식실", "운반은 사람들이 사용할 수 있는 상태로 만들어 주는 생산 활동이에요.", ["운반 배지", "🚚"]),
      mission("milk_drink", "학생들이 우유 마시기", "학생들이 급식 시간에 우유를 마셨어요.", "consumption", "scene", "급식실", "생산된 우유를 마시는 것은 소비 활동이에요.", ["소비 카드", "😊"])
    ]
  },
  {
    id: "stationery",
    name: "문구점 준비왕",
    icon: "✏️",
    palette: ["#fff8d9", "#e0a33a"],
    role: "학생들이 필요한 준비물을 쉽게 살 수 있게 정리해요.",
    npc: "문구점 주인",
    intro: "내일 미술 시간이래요. 학생들이 쉽게 고를 수 있도록 문구점을 준비해 줄래요?",
    item: "연필 왕관과 색종이 망토",
    learningPoint: "물건을 사람들이 쉽게 살 수 있도록 준비하는 일도 생산 활동에 들어가요.",
    missions: [
      mission("paper_box", "색종이 묶음 받기", "문구점에 놓을 색종이 묶음을 받았어요.", "production", "find", "문구 창고", "필요한 물건을 준비하는 것도 생산 활동이에요.", ["준비 배지", "🎒"]),
      mission("paper_sort", "색종이 정리하기", "학생들이 고르기 쉽게 색종이를 정리했어요.", "production", "sorting", "정리대", "정리와 진열은 사람들이 쉽게 살 수 있도록 돕는 생산 활동이에요.", ["정리 배지", "🧺"]),
      mission("paper_shelf", "문구점에 진열하기", "색종이를 문구점 진열대에 놓았어요.", "production", "shelf", "문구점", "진열은 물건을 사용할 수 있는 상태로 준비하는 생산 활동이에요.", ["진열 배지", "🏪"]),
      mission("paper_buy", "학생들이 색종이 사기", "학생들이 미술 시간에 쓸 색종이를 샀어요.", "consumption", "scene", "문구점 계산대", "생산된 물건을 사는 것은 소비 활동이에요.", ["소비 카드", "🛍️"])
    ]
  },
  {
    id: "bakery",
    name: "빵집 꼬마 셰프",
    icon: "🥐",
    palette: ["#fff2dc", "#d87d3d"],
    role: "따뜻한 빵을 만들고 손님이 가져가기 쉽게 포장해요.",
    npc: "빵집 주인",
    intro: "아침 손님들이 따뜻한 빵을 기다리고 있어요. 빵을 준비해 볼까요?",
    item: "빵 모자와 오븐 장갑",
    learningPoint: "생활에 필요한 물건을 만드는 것은 생산 활동이에요.",
    missions: [
      mission("flour_ready", "밀가루 준비하기", "빵을 만들 밀가루를 준비했어요.", "production", "find", "재료대", "재료를 준비하는 일도 생산 과정이에요.", ["재료 배지", "🌾"]),
      mission("bread_bake", "빵 굽기", "반죽을 오븐에 넣고 빵을 구웠어요.", "production", "making", "오븐", "생활에 필요한 물건을 만드는 것은 생산 활동이에요.", ["빵모자", "🍞"]),
      mission("bread_pack", "빵 포장하기", "손님이 가져가기 쉽게 빵을 포장했어요.", "production", "packing", "빵집 판매대", "포장은 손님이 편리하게 이용하도록 돕는 생산 활동이에요.", ["포장 배지", "🎀"]),
      mission("bread_eat", "손님이 빵 사 먹기", "손님이 빵을 사 먹었어요.", "consumption", "scene", "빵집 테이블", "빵을 사 먹는 것은 소비 활동이에요.", ["소비 카드", "😋"])
    ]
  },
  {
    id: "parcel",
    name: "택배 번개 기사",
    icon: "📦",
    palette: ["#edf5e4", "#6eaa56"],
    role: "택배를 확인하고 분류해서 주민의 집까지 배달해요.",
    npc: "택배센터 직원",
    intro: "택배가 많이 도착했어요. 주민들이 받을 수 있게 도와줄래요?",
    item: "택배 모자와 번개 스티커",
    learningPoint: "배달은 사람들이 물건을 받을 수 있는 상태로 만들어 주는 생산 활동이에요.",
    missions: [
      mission("address_check", "택배 주소 확인하기", "택배 상자에 적힌 주소를 확인했어요.", "production", "match", "택배센터", "주소를 확인하는 일은 배달을 위한 생산 과정이에요.", ["주소 배지", "🏠"]),
      mission("parcel_sort", "택배 분류하기", "동네별로 택배를 나누었어요.", "production", "sorting", "분류장", "분류는 사람들이 물건을 받을 수 있도록 준비하는 생산 활동이에요.", ["분류 배지", "🧭"]),
      mission("parcel_deliver", "집까지 배달하기", "택배를 주민의 집까지 배달했어요.", "production", "delivery", "동네 골목", "배달도 생산 활동에 들어가요.", ["번개 배지", "⚡"]),
      mission("parcel_get", "주민이 택배 받기", "주민이 택배 서비스를 이용해 물건을 받았어요.", "consumption", "scene", "주민의 집", "택배 서비스를 이용하는 것은 소비 활동이에요.", ["소비 카드", "🙌"])
    ]
  },
  {
    id: "store",
    name: "편의점 진열 달인",
    icon: "🏪",
    palette: ["#e7fbff", "#4ba3a9"],
    role: "물건을 확인하고 손님이 쉽게 살 수 있게 진열해요.",
    npc: "편의점 주인",
    intro: "새 물건이 도착했어요. 손님들이 안전하고 편리하게 살 수 있게 준비해 주세요.",
    item: "편의점 조끼와 바코드 리더기",
    learningPoint: "손님이 안전하고 편리하게 살 수 있도록 물건을 준비하는 일도 생산 활동이에요.",
    missions: [
      mission("store_box", "물건 상자 받기", "편의점에 도착한 물건 상자를 받았어요.", "production", "find", "편의점 창고", "물건을 받는 일은 판매를 위한 생산 과정이에요.", ["입고 배지", "📋"]),
      mission("store_check", "물건 상태 확인하기", "손님이 안전하게 살 수 있도록 물건 상태를 확인했어요.", "production", "inspection", "확인대", "안전하게 살 수 있도록 확인하는 것도 생산 활동이에요.", ["확인 배지", "✅"]),
      mission("store_shelf", "진열대 채우기", "손님이 쉽게 고를 수 있도록 진열대에 물건을 놓았어요.", "production", "shelf", "진열대", "진열은 손님이 쉽게 살 수 있도록 돕는 생산 활동이에요.", ["진열 배지", "🥫"]),
      mission("store_buy", "손님이 물건 사기", "손님이 편의점에서 필요한 물건을 샀어요.", "consumption", "scene", "편의점 계산대", "생산된 물건을 사는 것은 소비 활동이에요.", ["소비 카드", "💳"])
    ]
  },
  {
    id: "bus",
    name: "버스 노선 대장",
    icon: "🚌",
    palette: ["#eef0ff", "#6677c9"],
    role: "주민들이 학교, 시장, 병원에 갈 수 있도록 버스를 운행해요.",
    npc: "버스 기사님",
    intro: "비가 와서 주민들이 이동하기 힘들어요. 버스 운행을 도와줄래요?",
    item: "운전 모자와 노선도",
    learningPoint: "물건을 만들지 않아도 사람들의 생활을 편리하게 해 주면 생산 활동이에요.",
    missions: [
      mission("bus_check", "버스 점검하기", "안전하게 운행할 수 있도록 버스를 점검했어요.", "production", "sequence", "버스 차고지", "버스를 안전하게 준비하는 것도 생산 활동이에요.", ["점검 배지", "🔧"]),
      mission("bus_stop", "정류장으로 이동하기", "주민들을 태우기 위해 정류장으로 갔어요.", "production", "match", "버스정류장", "사람들이 서비스를 이용할 수 있게 준비하는 일도 생산 활동이에요.", ["노선 배지", "🚏"]),
      mission("bus_drive", "버스 운행하기", "버스를 운행해 주민들이 이동할 수 있게 도왔어요.", "production", "timing", "학교/시장/병원", "버스 운행은 생활을 편리하게 해 주는 생산 활동이에요.", ["버스 배지", "🚌"]),
      mission("bus_use", "주민들이 버스 이용하기", "주민들이 버스를 타고 이동했어요.", "consumption", "scene", "정류장", "버스 서비스를 이용하는 것은 소비 활동이에요.", ["소비 카드", "☔"])
    ]
  },
  {
    id: "hair",
    name: "미용실 스타일 요정",
    icon: "✂️",
    palette: ["#fff0f8", "#c96f9e"],
    role: "손님의 머리를 다듬고 깔끔하게 생활하도록 도와요.",
    npc: "미용사",
    intro: "손님이 머리를 다듬으러 오셨어요. 깔끔해질 수 있도록 도와줄래요?",
    item: "가위 핀과 반짝 드라이기",
    learningPoint: "생활을 편리하고 깔끔하게 해 주는 서비스도 생산 활동이에요.",
    missions: [
      mission("hair_tools", "미용 도구 준비하기", "머리를 다듬기 위해 미용 도구를 준비했어요.", "production", "find", "미용실 입구", "서비스를 제공하기 위해 도구를 준비하는 것도 생산 활동이에요.", ["도구 배지", "💈"]),
      mission("hair_cut", "머리 다듬기", "손님의 머리를 깔끔하게 다듬었어요.", "production", "trace", "스타일 의자", "미용 서비스는 생활을 편리하고 깔끔하게 해 주는 생산 활동이에요.", ["스타일 배지", "✨"]),
      mission("hair_dry", "드라이하기", "손님의 머리를 보기 좋게 말렸어요.", "production", "clean", "거울 앞", "손님을 돕는 서비스도 생산 활동이에요.", ["드라이 배지", "💨"]),
      mission("hair_use", "손님이 미용 서비스 이용하기", "손님이 미용실에서 머리 손질을 받았어요.", "consumption", "scene", "미용실 거울", "미용 서비스를 이용하는 것은 소비 활동이에요.", ["소비 카드", "😊"])
    ]
  },
  {
    id: "stage",
    name: "공연 무대 스타",
    icon: "🎤",
    palette: ["#fff1e7", "#c76454"],
    role: "무대를 준비하고 공연해서 사람들을 즐겁게 해요.",
    npc: "공연장 매니저",
    intro: "곧 공연이 시작돼요. 사람들이 즐거운 시간을 보낼 수 있도록 준비해 주세요.",
    item: "마이크와 별 망토",
    learningPoint: "사람들을 즐겁게 해 주는 서비스도 생산 활동이에요.",
    missions: [
      mission("stage_ready", "무대 준비하기", "공연을 할 수 있도록 무대를 준비했어요.", "production", "shelf", "대기실", "공연을 준비하는 것도 생산 활동이에요.", ["무대 배지", "🎭"]),
      mission("stage_practice", "공연 연습하기", "멋진 공연을 보여 주기 위해 연습했어요.", "production", "sequence", "무대", "좋은 서비스를 위해 연습하는 과정도 생산 활동이에요.", ["연습 배지", "🎵"]),
      mission("stage_show", "공연하기", "무대에서 공연을 해서 사람들을 즐겁게 했어요.", "production", "rhythm", "공연장", "공연은 사람들을 즐겁게 해 주는 서비스라서 생산 활동이에요.", ["무대 스타 배지", "⭐"]),
      mission("stage_watch", "관객들이 공연 보기", "관객들이 공연을 보며 즐거운 시간을 보냈어요.", "consumption", "scene", "관객석", "공연 서비스를 이용하는 것은 소비 활동이에요.", ["소비 카드", "👏"])
    ]
  }
];

const places = [
  { name: "학교", x: 70, y: 20, w: 14, kind: "school", sprite: [0, 0] },
  { name: "급식실", x: 77, y: 37, w: 11, kind: "cafeteria", sprite: [1, 0] },
  { name: "문구점", x: 18, y: 20, w: 10, kind: "shop", sprite: [2, 0] },
  { name: "빵집", x: 38, y: 17, w: 10, kind: "bakery", sprite: [3, 0] },
  { name: "택배센터", x: 16, y: 56, w: 13, kind: "parcel", sprite: [4, 0] },
  { name: "편의점", x: 40, y: 68, w: 11, kind: "store", sprite: [0, 1] },
  { name: "버스정류장", x: 63, y: 66, w: 9, kind: "bus", sprite: [1, 1] },
  { name: "미용실", x: 83, y: 65, w: 10, kind: "hair", sprite: [2, 1] },
  { name: "공연장", x: 55, y: 37, w: 13, kind: "stage", sprite: [3, 1] },
  { name: "포장실", x: 30, y: 42, w: 10, kind: "pack", sprite: [4, 1] }
];

const WORLD = {
  width: 2240,
  height: 1260,
  playerSpeed: 250,
  interactionRadius: 120
};

const state = {
  screen: "start",
  character: null,
  missionIndex: 0,
  cards: [],
  player: { x: WORLD.width * 0.48, y: WORLD.height * 0.5 },
  overlay: null,
  selectedQuizCard: null,
  quizBins: { production: [], consumption: [] },
  quizMessage: "",
  lastAward: null,
  assets: {
    buildingSheetReady: false
  }
};

const input = {
  up: false,
  down: false,
  left: false,
  right: false
};

let movementLoopStarted = false;
let lastFrameTime = 0;

function mission(id, title, description, type, game, place, feedback, reward) {
  return { id, title, description, type, game, place, feedback, reward };
}

function $(selector) {
  return document.querySelector(selector);
}

function render() {
  const app = $("#app");
  app.innerHTML = "";
  app.appendChild(viewShell());
}

function preloadAssets() {
  const buildingSheet = new Image();
  buildingSheet.onload = () => {
    state.assets.buildingSheetReady = true;
    render();
  };
  buildingSheet.onerror = () => {
    state.assets.buildingSheetReady = false;
  };
  buildingSheet.src = "./src/assets/buildings/building-spritesheet.png";
}

function viewShell() {
  const root = el("main", "app-shell");
  if (state.screen === "start") root.appendChild(startScreen());
  if (state.screen === "select") root.appendChild(selectScreen());
  if (state.screen === "map") root.appendChild(mapScreen());
  if (state.screen === "quiz") root.appendChild(quizScreen());
  if (state.screen === "result") root.appendChild(resultScreen());
  return root;
}

function startScreen() {
  const screen = el("section", "start-screen");
  screen.innerHTML = `
    <div class="pixel-sky">
      <span></span><span></span><span></span>
    </div>
    <div class="hero-town" aria-hidden="true">
      ${places.slice(0, 7).map((p, i) => `<i style="--i:${i}">${placeIcon(p.kind)}</i>`).join("")}
    </div>
    <div class="title-block">
      <p class="eyebrow">초등 사회 4학년 1학기</p>
      <h1>우리 동네<br />생산·소비 탐험대</h1>
      <p>작은 마을을 돌아다니며 미션을 해결하고, 내가 한 생산 활동과 내가 본 소비 활동을 찾아봐요.</p>
      <button class="primary big" data-action="select">게임 시작하기</button>
    </div>
  `;
  screen.querySelector("[data-action='select']").addEventListener("click", () => {
    state.screen = "select";
    render();
  });
  return screen;
}

function selectScreen() {
  const screen = el("section", "select-screen");
  screen.innerHTML = `
    <header class="screen-header">
      <div>
        <p class="eyebrow">탐험 캐릭터 선택</p>
        <h2>오늘 맡을 일을 골라요</h2>
      </div>
      <button class="ghost" data-action="back">처음으로</button>
    </header>
    <div class="character-grid">
      ${characters.map((c) => `
        <article class="character-card" style="--soft:${c.palette[0]}; --strong:${c.palette[1]}">
          <div class="avatar-badge">${c.icon}</div>
          <h3>${c.name}</h3>
          <p>${c.role}</p>
          <div class="mini-row"><span>${c.item}</span></div>
          <button class="secondary" data-pick="${c.id}">이 캐릭터로 시작하기</button>
        </article>
      `).join("")}
    </div>
  `;
  screen.querySelector("[data-action='back']").addEventListener("click", () => {
    state.screen = "start";
    render();
  });
  screen.querySelectorAll("[data-pick]").forEach((button) => {
    button.addEventListener("click", () => chooseCharacter(button.dataset.pick));
  });
  return screen;
}

function chooseCharacter(id) {
  state.character = characters.find((c) => c.id === id);
  state.missionIndex = 0;
  state.cards = [];
  state.player = { x: WORLD.width * 0.48, y: WORLD.height * 0.5 };
  state.overlay = "intro";
  state.lastAward = null;
  state.quizBins = { production: [], consumption: [] };
  state.quizMessage = "";
  state.screen = "map";
  render();
}

function mapScreen() {
  const c = state.character;
  const current = c.missions[state.missionIndex];
  const target = getTargetPlace(current);
  const near = isNear(state.player, target);
  const screen = el("section", "map-layout");
  screen.innerHTML = `
    <aside class="hud">
      <div class="hud-title">
        <div class="avatar-chip">${c.icon}</div>
        <div>
          <p>${c.name}</p>
          <strong>${current ? current.title : "퀴즈로 이동"}</strong>
        </div>
      </div>
      <div class="mission-strip">
        ${c.missions.map((m, i) => `<span class="${i < state.missionIndex ? "done" : i === state.missionIndex ? "now" : ""}">${i + 1}</span>`).join("")}
      </div>
      <p class="npc-line"><b>${c.npc}</b><br />${current ? `다음 장소는 ${current.place}예요.` : "활동을 정리해 볼까요?"}</p>
      <div class="card-stack">
        ${state.cards.map((card) => `<div class="tiny-card ${card.type}">${card.reward[1]} ${card.title}</div>`).join("") || "<div class='empty-note'>아직 모은 카드가 없어요.</div>"}
      </div>
    </aside>
    <div class="town-wrap">
      <div class="town-viewport" tabindex="0" aria-label="마을 지도">
        <div class="town-world" style="width:${WORLD.width}px; height:${WORLD.height}px;">
          <img class="map-base-image" src="./src/assets/maps/base-town-map.png" alt="" onerror="this.hidden=true" />
          <div class="fallback-map-art" aria-hidden="true">
            <div class="tile road h1"></div><div class="tile road h2"></div><div class="tile road v1"></div><div class="tile road v2"></div>
            <div class="pond"></div><div class="field"></div><div class="trees"></div>
          </div>
          ${places.map((p) => placeNode(p, current, target)).join("")}
          <div class="player" style="left:${state.player.x}px; top:${state.player.y}px;">
            <img src="./src/assets/characters/${c.id}-idle.png" alt="" onerror="this.hidden=true" />
            <span>${c.icon}</span>
          </div>
        </div>
      </div>
      <div class="map-footer">
        <div class="dialog-bubble">
          ${near ? `<b>${c.npc}</b> ${current.game === "scene" ? "이제 소비 장면을 살펴봐요." : "도착했어요. 일을 시작해 볼까요?"}` : `반짝이는 느낌표가 있는 <b>${current.place}</b>로 이동해요.`}
        </div>
        <button class="primary" ${near ? "" : "disabled"} data-start-mission>${current.game === "scene" ? "소비 장면 보기" : "미니게임 시작하기"}</button>
      </div>
      <div class="dpad" aria-label="이동 버튼">
        <button data-move="up">▲</button>
        <button data-move="left">◀</button>
        <button data-move="down">▼</button>
        <button data-move="right">▶</button>
      </div>
      <button class="action-button" ${near ? "" : "disabled"} data-action-button>A</button>
    </div>
  `;
  bindMovement(screen);
  const startButton = screen.querySelector("[data-start-mission]");
  startButton?.addEventListener("click", () => {
    state.overlay = current.game;
    render();
  });
  screen.querySelector("[data-action-button]")?.addEventListener("click", () => {
    if (!isNear(state.player, target)) return;
    state.overlay = current.game;
    render();
  });
  if (state.overlay === "intro") screen.appendChild(introOverlay());
  if (state.overlay && state.overlay !== "intro") screen.appendChild(gameOverlay(current));
  return screen;
}

function introOverlay() {
  const c = state.character;
  const modal = el("div", "overlay");
  modal.innerHTML = `
    <div class="modal story-modal">
      <div class="portrait">${c.icon}</div>
      <p class="eyebrow">${c.npc}</p>
      <h2>${c.name}</h2>
      <p>${c.intro}</p>
      <button class="primary" data-close>마을로 가기</button>
    </div>
  `;
  modal.querySelector("[data-close]").addEventListener("click", () => {
    state.overlay = null;
    render();
  });
  return modal;
}

function gameOverlay(missionData) {
  const modal = el("div", "overlay game-shade");
  const content = el("div", "modal game-modal");
  content.innerHTML = `
    <div class="game-head">
      <div>
        <p class="eyebrow">${missionData.place}</p>
        <h2>${missionData.title}</h2>
      </div>
      <button class="icon-button" data-close aria-label="닫기">×</button>
    </div>
    <div class="game-body"></div>
  `;
  content.querySelector("[data-close]").addEventListener("click", () => {
    state.overlay = null;
    render();
  });
  content.querySelector(".game-body").appendChild(minigame(missionData));
  modal.appendChild(content);
  return modal;
}

function minigame(m) {
  if (m.game === "scene") return sceneGame(m);
  if (m.game === "delivery") return deliveryGame(m);
  if (m.game === "making" || m.game === "sequence") return sequenceGame(m);
  if (m.game === "rhythm" || m.game === "timing") return rhythmGame(m);
  if (m.game === "packing") return packingGame(m);
  if (m.game === "sorting" || m.game === "shelf" || m.game === "match") return sortingGame(m);
  if (m.game === "trace" || m.game === "clean") return tapCleanGame(m);
  return inspectionGame(m);
}

function inspectionGame(m) {
  const wrap = gameFrame("문제가 있는 물건을 찾아 눌러요.", "목표 4개 중 3개 이상 찾기");
  const bad = new Set([1, 4, 7, 10]);
  let found = 0;
  const belt = el("div", "conveyor");
  Array.from({ length: 12 }).forEach((_, i) => {
    const item = el("button", `belt-item ${bad.has(i) ? "bad" : ""}`);
    item.textContent = bad.has(i) ? ["❗", "⚠️", "⌛", "💥"][found % 4] : itemIcon(m);
    item.addEventListener("click", () => {
      if (bad.has(i) && !item.classList.contains("picked")) {
        found += 1;
        item.classList.add("picked");
        updateMeter(wrap, found, 4);
        if (found >= 3) completeMission(m, 3);
      } else {
        pulseMessage(wrap, "다시 살펴봐요!");
      }
    });
    belt.appendChild(item);
  });
  wrap.querySelector(".play-zone").appendChild(belt);
  return wrap;
}

function packingGame(m) {
  const wrap = gameFrame("물건을 알맞은 상자에 담아요.", "9개 포장하기");
  let placed = 0;
  const zone = el("div", "packing-zone");
  const box = el("div", "packing-box");
  box.innerHTML = "<b>포장 상자</b><span>0 / 9</span>";
  const tray = el("div", "item-tray");
  Array.from({ length: 9 }).forEach((_, i) => {
    const item = el("button", "pack-item");
    item.textContent = itemIcon(m);
    item.addEventListener("click", () => {
      if (item.disabled) return;
      item.disabled = true;
      placed += 1;
      box.querySelector("span").textContent = `${placed} / 9`;
      box.appendChild(el("i", "box-spark", itemIcon(m)));
      updateMeter(wrap, placed, 9);
      if (placed === 9) completeMission(m, 3);
    });
    tray.appendChild(item);
  });
  zone.append(tray, box);
  wrap.querySelector(".play-zone").appendChild(zone);
  return wrap;
}

function sortingGame(m) {
  const wrap = gameFrame("카드를 누르고 맞는 칸을 눌러요.", "모두 알맞게 정리하기");
  const categories = ["준비", "정리", "전달"];
  const data = [
    { label: itemIcon(m), cat: "준비" },
    { label: "📋", cat: "준비" },
    { label: "🧺", cat: "정리" },
    { label: "🏷️", cat: "정리" },
    { label: "🚚", cat: "전달" },
    { label: "🏠", cat: "전달" }
  ];
  let selected = null;
  let done = 0;
  const zone = el("div", "sorting-zone");
  const items = el("div", "sort-items");
  data.forEach((entry, i) => {
    const button = el("button", "sort-card");
    button.textContent = entry.label;
    button.dataset.cat = entry.cat;
    button.addEventListener("click", () => {
      selected?.classList.remove("selected");
      selected = button;
      button.classList.add("selected");
    });
    items.appendChild(button);
  });
  const bins = el("div", "sort-bins");
  categories.forEach((cat) => {
    const bin = el("button", "sort-bin");
    bin.innerHTML = `<b>${cat}</b><span></span>`;
    bin.addEventListener("click", () => {
      if (!selected) return pulseMessage(wrap, "먼저 물건을 골라요.");
      if (selected.dataset.cat === cat) {
        done += 1;
        bin.querySelector("span").textContent += selected.textContent;
        selected.remove();
        selected = null;
        updateMeter(wrap, done, data.length);
        if (done === data.length) completeMission(m, 3);
      } else {
        pulseMessage(wrap, "알맞은 칸을 다시 생각해 봐요.");
      }
    });
    bins.appendChild(bin);
  });
  zone.append(items, bins);
  wrap.querySelector(".play-zone").appendChild(zone);
  return wrap;
}

function deliveryGame(m) {
  const wrap = gameFrame("작은 길을 지나 목적지까지 이동해요.", "목적지 도착하기");
  const board = el("div", "mini-road");
  const runner = el("div", "runner", itemIcon(m));
  const goal = el("div", "goal-flag", "🏁");
  let x = 8;
  let y = 60;
  runner.style.left = `${x}%`;
  runner.style.top = `${y}%`;
  board.append(runner, goal);
  ["💧", "🚧", "🛑"].forEach((o, i) => {
    const obs = el("div", "obstacle", o);
    obs.style.left = `${32 + i * 17}%`;
    obs.style.top = `${52 - i * 10}%`;
    board.appendChild(obs);
  });
  const controls = el("div", "mini-controls");
  [["up", "▲"], ["left", "◀"], ["down", "▼"], ["right", "▶"]].forEach(([dir, text]) => {
    const button = el("button", "", text);
    button.addEventListener("click", () => {
      if (dir === "up") y -= 9;
      if (dir === "down") y += 9;
      if (dir === "left") x -= 9;
      if (dir === "right") x += 9;
      x = clamp(x, 5, 86);
      y = clamp(y, 12, 76);
      runner.style.left = `${x}%`;
      runner.style.top = `${y}%`;
      updateMeter(wrap, Math.round(x), 86);
      if (x > 76 && y < 28) completeMission(m, 2);
    });
    controls.appendChild(button);
  });
  wrap.querySelector(".play-zone").append(board, controls);
  return wrap;
}

function sequenceGame(m) {
  const steps = m.game === "making" ? ["🌾", "💧", "🥣", "🔥", "🍞"] : ["🔧", "🚪", "💡", "🪟", "🔔"];
  const wrap = gameFrame("순서대로 눌러 미션을 완성해요.", "5단계 완료하기");
  let step = 0;
  const seq = el("div", "sequence-zone");
  steps.forEach((s, i) => {
    const button = el("button", "seq-step", s);
    button.addEventListener("click", () => {
      if (i === step) {
        button.classList.add("done");
        step += 1;
        updateMeter(wrap, step, steps.length);
        if (step === steps.length) completeMission(m, 3);
      } else {
        pulseMessage(wrap, "순서를 다시 생각해 봐요.");
      }
    });
    seq.appendChild(button);
  });
  wrap.querySelector(".play-zone").appendChild(seq);
  return wrap;
}

function rhythmGame(m) {
  const wrap = gameFrame("음표가 원 안에 오면 눌러요.", "6번 성공하면 완료");
  let hits = 0;
  const stage = el("div", "rhythm-stage");
  const note = el("button", "note", "♪");
  note.addEventListener("click", () => {
    hits += 1;
    note.style.animation = "none";
    note.offsetHeight;
    note.style.animation = "";
    updateMeter(wrap, hits, 6);
    if (hits >= 6) completeMission(m, 3);
  });
  stage.appendChild(note);
  wrap.querySelector(".play-zone").appendChild(stage);
  return wrap;
}

function tapCleanGame(m) {
  const wrap = gameFrame("반짝이는 표시를 모두 눌러요.", "6개 정리하기");
  let count = 0;
  const area = el("div", "clean-zone");
  Array.from({ length: 6 }).forEach((_, i) => {
    const drop = el("button", "clean-dot", m.game === "clean" ? "💧" : "✂");
    drop.style.left = `${12 + (i * 14) % 72}%`;
    drop.style.top = `${20 + (i % 3) * 24}%`;
    drop.addEventListener("click", () => {
      drop.remove();
      count += 1;
      updateMeter(wrap, count, 6);
      if (count === 6) completeMission(m, 2);
    });
    area.appendChild(drop);
  });
  wrap.querySelector(".play-zone").appendChild(area);
  return wrap;
}

function sceneGame(m) {
  const wrap = gameFrame("소비 장면을 살펴봐요.", "장면 확인하기");
  const scene = el("div", "scene-card");
  scene.innerHTML = `
    <div class="scene-people"><span>🙂</span><span>${itemIcon(m)}</span><span>😊</span></div>
    <h3>${m.title}</h3>
    <p>${m.description}</p>
    <button class="primary" data-complete>소비 활동 카드 받기</button>
  `;
  scene.querySelector("[data-complete]").addEventListener("click", () => completeMission(m, 3));
  wrap.querySelector(".play-zone").appendChild(scene);
  return wrap;
}

function gameFrame(help, goal) {
  const frame = el("div", "game-frame");
  frame.innerHTML = `
    <div class="game-instruction">
      <p>${help}</p>
      <b>${goal}</b>
    </div>
    <div class="progress"><span style="width:0%"></span></div>
    <div class="play-zone"></div>
    <p class="game-message" aria-live="polite"></p>
  `;
  return frame;
}

function updateMeter(frame, value, total) {
  frame.querySelector(".progress span").style.width = `${Math.min(100, (value / total) * 100)}%`;
}

function pulseMessage(frame, text) {
  const msg = frame.querySelector(".game-message");
  msg.textContent = text;
  msg.classList.remove("pop");
  msg.offsetHeight;
  msg.classList.add("pop");
}

function completeMission(m, stars) {
  if (!state.cards.some((card) => card.id === m.id)) {
    state.cards.push({ ...m, stars });
  }
  state.lastAward = { ...m, stars };
  state.overlay = "award";
  awardThenContinue();
}

function awardThenContinue() {
  const current = state.character.missions[state.missionIndex];
  state.overlay = null;
  state.missionIndex += 1;
  if (state.missionIndex >= state.character.missions.length) {
    state.screen = "quiz";
  } else {
    const next = getTargetPlace(state.character.missions[state.missionIndex]);
    const pos = placePosition(next);
    state.player = {
      x: clamp(pos.x - 150, 70, WORLD.width - 70),
      y: clamp(pos.y + 180, 70, WORLD.height - 70)
    };
  }
  render();
  setTimeout(() => showToast(`${current.type === "production" ? "생산" : "소비"} 활동 카드 획득! ${current.reward[1]} ${current.title}`), 60);
}

function quizScreen() {
  const screen = el("section", "quiz-screen");
  const unplaced = state.cards.filter((card) => !state.quizBins.production.includes(card.id) && !state.quizBins.consumption.includes(card.id));
  screen.innerHTML = `
    <header class="screen-header">
      <div>
        <p class="eyebrow">마지막 퀴즈</p>
        <h2>내가 한 활동을 나누어 봐요</h2>
      </div>
      <button class="ghost" data-map>마을 보기</button>
    </header>
    <p class="quiz-help">카드를 누른 뒤 생산 활동 칸이나 소비 활동 칸을 누르세요. 정답 확인은 제출 버튼을 눌렀을 때만 해요.</p>
    <div class="quiz-pool">
      ${unplaced.map((card) => quizCard(card)).join("")}
    </div>
    <div class="quiz-bins">
      <button class="quiz-bin production" data-bin="production">
        <b>내가 한 생산 활동</b>
        ${state.quizBins.production.map((id) => quizCard(state.cards.find((c) => c.id === id))).join("")}
      </button>
      <button class="quiz-bin consumption" data-bin="consumption">
        <b>내가 본 소비 활동</b>
        ${state.quizBins.consumption.map((id) => quizCard(state.cards.find((c) => c.id === id))).join("")}
      </button>
    </div>
    <div class="quiz-actions">
      <button class="secondary" data-reset>다시 놓기</button>
      <button class="primary" data-submit>답 제출</button>
    </div>
    <div class="quiz-message">${state.quizMessage}</div>
  `;
  screen.querySelector("[data-map]").addEventListener("click", () => {
    state.screen = "map";
    state.missionIndex = state.character.missions.length - 1;
    render();
  });
  screen.querySelectorAll("[data-card]").forEach((card) => {
    card.addEventListener("click", (event) => {
      event.stopPropagation();
      state.selectedQuizCard = card.dataset.card;
      render();
    });
  });
  screen.querySelectorAll("[data-bin]").forEach((bin) => {
    bin.addEventListener("click", () => {
      if (!state.selectedQuizCard) return;
      state.quizBins.production = state.quizBins.production.filter((id) => id !== state.selectedQuizCard);
      state.quizBins.consumption = state.quizBins.consumption.filter((id) => id !== state.selectedQuizCard);
      state.quizBins[bin.dataset.bin].push(state.selectedQuizCard);
      state.selectedQuizCard = null;
      state.quizMessage = "";
      render();
    });
  });
  screen.querySelector("[data-reset]").addEventListener("click", () => {
    state.quizBins = { production: [], consumption: [] };
    state.quizMessage = "";
    render();
  });
  screen.querySelector("[data-submit]").addEventListener("click", submitQuiz);
  return screen;
}

function quizCard(card) {
  const selected = state.selectedQuizCard === card.id ? "selected" : "";
  return `<span class="activity-card ${card.type} ${selected}" data-card="${card.id}">${card.reward[1]} ${card.title}</span>`;
}

function submitQuiz() {
  if (state.quizBins.production.length + state.quizBins.consumption.length < state.cards.length) {
    state.quizMessage = "아직 놓지 않은 카드가 있어요.";
    render();
    return;
  }
  const wrong = state.cards.find((card) => !state.quizBins[card.type].includes(card.id));
  if (!wrong) {
    state.quizMessage = "정답입니다! 생산 활동과 소비 활동을 잘 구분했어요.";
    state.screen = "result";
    render();
    return;
  }
  const right = wrong.type === "production" ? "생산 활동" : "소비 활동";
  state.quizMessage = `틀렸습니다. '${wrong.title}'은 ${right}이에요. ${wrong.feedback} 다시 한번 분류해 보세요.`;
  render();
}

function resultScreen() {
  const c = state.character;
  const productions = state.cards.filter((card) => card.type === "production");
  const consumptions = state.cards.filter((card) => card.type === "consumption");
  const screen = el("section", "result-screen");
  screen.innerHTML = `
    <div class="result-card" id="resultCard">
      <p class="eyebrow">오늘의 생산·소비 인증샷</p>
      <h2>${c.name}</h2>
      <div class="result-avatar">${c.icon}</div>
      <div class="result-columns">
        <div>
          <h3>내가 한 생산 활동</h3>
          ${productions.map((m) => `<p>${m.reward[1]} ${m.description}</p>`).join("")}
        </div>
        <div>
          <h3>내가 본 소비 활동</h3>
          ${consumptions.map((m) => `<p>${m.reward[1]} ${m.description}</p>`).join("")}
        </div>
      </div>
      <div class="learning-point">${c.learningPoint}</div>
    </div>
    <div class="result-actions">
      <button class="primary" data-save>이미지 저장하기</button>
      <button class="secondary" data-restart>다른 캐릭터로 다시 하기</button>
    </div>
  `;
  screen.querySelector("[data-save]").addEventListener("click", saveResultImage);
  screen.querySelector("[data-restart]").addEventListener("click", () => {
    state.screen = "select";
    render();
  });
  return screen;
}

function saveResultImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  const c = state.character;
  ctx.fillStyle = "#f6e8bd";
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = "#78b26d";
  ctx.fillRect(0, 680, 1080, 400);
  ctx.fillStyle = "#4b3427";
  ctx.textAlign = "center";
  ctx.font = "bold 56px sans-serif";
  ctx.fillText("오늘의 생산·소비 인증샷", 540, 110);
  ctx.font = "bold 46px sans-serif";
  ctx.fillText(c.name, 540, 185);
  ctx.font = "150px serif";
  ctx.fillText(c.icon, 540, 370);
  ctx.font = "bold 34px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("내가 한 생산 활동", 95, 510);
  state.cards.filter((m) => m.type === "production").forEach((m, i) => {
    ctx.font = "30px sans-serif";
    ctx.fillText(`${m.reward[1]} ${m.description}`, 95, 565 + i * 54);
  });
  ctx.font = "bold 34px sans-serif";
  ctx.fillText("내가 본 소비 활동", 95, 760);
  state.cards.filter((m) => m.type === "consumption").forEach((m, i) => {
    ctx.font = "30px sans-serif";
    ctx.fillText(`${m.reward[1]} ${m.description}`, 95, 815 + i * 54);
  });
  ctx.font = "bold 30px sans-serif";
  wrapCanvasText(ctx, c.learningPoint, 95, 930, 890, 42);
  const link = document.createElement("a");
  link.download = `production-consumption-${c.id}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("결과 이미지를 저장했어요. 패들렛에 올릴 준비 완료!");
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = "";
  text.split(" ").forEach((word) => {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, y);
      line = `${word} `;
      y += lineHeight;
    } else {
      line = test;
    }
  });
  ctx.fillText(line, x, y);
}

function getTargetPlace(m) {
  const byName = places.find((p) => m.place.includes(p.name) || p.name.includes(m.place));
  if (byName) return byName;
  if (m.place.includes("포장")) return places.find((p) => p.name === "포장실");
  if (m.place.includes("무대") || m.place.includes("공연")) return places.find((p) => p.name === "공연장");
  if (m.place.includes("미용")) return places.find((p) => p.name === "미용실");
  if (m.place.includes("버스") || m.place.includes("정류장")) return places.find((p) => p.name === "버스정류장");
  if (m.place.includes("편의점")) return places.find((p) => p.name === "편의점");
  if (m.place.includes("택배") || m.place.includes("골목") || m.place.includes("집")) return places.find((p) => p.name === "택배센터");
  if (m.place.includes("빵") || m.place.includes("오븐") || m.place.includes("재료")) return places.find((p) => p.name === "빵집");
  if (m.place.includes("문구") || m.place.includes("정리")) return places.find((p) => p.name === "문구점");
  return places[0];
}

function placeNode(p, current, target) {
  const active = target && p.name === target.name ? "active" : "";
  const sheetReady = state.assets.buildingSheetReady ? "sheet-ready" : "";
  const [sx, sy] = p.sprite;
  const pos = placePosition(p);
  return `
    <div class="place ${p.kind} ${active} ${sheetReady}" style="left:${pos.x}px; top:${pos.y}px; --place-w:${(p.w || 10) * 16}px; --sprite-x:${sx * 25}%; --sprite-y:${sy * 100}%;">
      <span class="building-sprite" aria-hidden="true"></span>
      <span class="roof">${placeIcon(p.kind)}</span>
      <b>${p.name}</b>
      ${active ? "<i class='quest'>!</i>" : ""}
    </div>
  `;
}

function placeIcon(kind) {
  return {
    school: "🏫",
    cafeteria: "🍽️",
    shop: "✏️",
    bakery: "🥐",
    parcel: "📦",
    store: "🏪",
    bus: "🚏",
    hair: "💈",
    stage: "🎪",
    pack: "📦"
  }[kind] || "🏠";
}

function itemIcon(m) {
  if (m.id.includes("milk")) return "🥛";
  if (m.id.includes("paper")) return "📘";
  if (m.id.includes("bread") || m.id.includes("flour")) return "🥐";
  if (m.id.includes("parcel") || m.id.includes("address")) return "📦";
  if (m.id.includes("store")) return "🥫";
  if (m.id.includes("bus")) return "🚌";
  if (m.id.includes("hair")) return "✂️";
  if (m.id.includes("stage")) return "🎤";
  return state.character?.icon || "⭐";
}

function bindMovement(screen) {
  screen.querySelectorAll("[data-move]").forEach((button) => {
    const dir = button.dataset.move;
    const press = (event) => {
      event.preventDefault();
      input[dir] = true;
    };
    const release = (event) => {
      event.preventDefault();
      input[dir] = false;
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });
}

function isNear(player, target) {
  const pos = placePosition(target);
  return Math.hypot(player.x - pos.x, player.y - pos.y) < WORLD.interactionRadius;
}

function placePosition(place) {
  return {
    x: (place.x / 100) * WORLD.width,
    y: (place.y / 100) * WORLD.height
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setupGlobalInput() {
  const keys = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    W: "up",
    s: "down",
    S: "down",
    a: "left",
    A: "left",
    d: "right",
    D: "right"
  };
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && state.screen === "map" && !state.overlay) {
      const current = state.character?.missions[state.missionIndex];
      if (current && isNear(state.player, getTargetPlace(current))) {
        event.preventDefault();
        state.overlay = current.game;
        render();
      }
      return;
    }
    const dir = keys[event.key];
    if (!dir || state.screen !== "map" || state.overlay) return;
    event.preventDefault();
    input[dir] = true;
  });
  window.addEventListener("keyup", (event) => {
    const dir = keys[event.key];
    if (!dir) return;
    event.preventDefault();
    input[dir] = false;
  });
}

function updateMapFrame(time = performance.now()) {
  if (!movementLoopStarted) {
    movementLoopStarted = true;
    lastFrameTime = time;
  }
  const delta = Math.min(0.05, (time - lastFrameTime) / 1000 || 0);
  lastFrameTime = time;

  if (state.screen === "map" && !state.overlay) {
    let dx = 0;
    let dy = 0;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (dx || dy) {
      const length = Math.hypot(dx, dy);
      state.player.x = clamp(state.player.x + (dx / length) * WORLD.playerSpeed * delta, 50, WORLD.width - 50);
      state.player.y = clamp(state.player.y + (dy / length) * WORLD.playerSpeed * delta, 70, WORLD.height - 50);
    }
    syncMapDom();
  }
  requestAnimationFrame(updateMapFrame);
}

function syncMapDom() {
  const viewport = $(".town-viewport");
  const world = $(".town-world");
  const player = $(".player");
  if (!viewport || !world || !player || !state.character) return;
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  const cameraX = clamp(state.player.x - vw / 2, 0, Math.max(0, WORLD.width - vw));
  const cameraY = clamp(state.player.y - vh / 2, 0, Math.max(0, WORLD.height - vh));
  world.style.transform = `translate(${-cameraX}px, ${-cameraY}px)`;
  player.style.left = `${state.player.x}px`;
  player.style.top = `${state.player.y}px`;

  const current = state.character.missions[state.missionIndex];
  if (!current) return;
  const near = isNear(state.player, getTargetPlace(current));
  const startButton = $("[data-start-mission]");
  const actionButton = $("[data-action-button]");
  const dialog = $(".dialog-bubble");
  if (startButton) startButton.disabled = !near;
  if (actionButton) actionButton.disabled = !near;
  if (dialog) {
    dialog.innerHTML = near
      ? `<b>${state.character.npc}</b> ${current.game === "scene" ? "이제 소비 장면을 살펴봐요." : "도착했어요. 일을 시작해 볼까요?"}`
      : `반짝이는 느낌표가 있는 <b>${current.place}</b>로 이동해요.`;
  }
}

function showToast(text) {
  const toast = el("div", "toast", text);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

function el(tag, className = "", text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

preloadAssets();
setupGlobalInput();
requestAnimationFrame(updateMapFrame);
render();
