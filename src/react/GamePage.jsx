import { useEffect, useMemo, useRef, useState } from "react";
import { activityPlaces, consumptions, jobs } from "../data/alba.js";
import { createGame } from "../phaser/createGame.js";
import { ActivityOverlay } from "./ActivityOverlay.jsx";
import { PlacementEditor } from "./PlacementEditor.jsx";

export function GamePage({ playerCharacter, progress, canFinish, inputLocked = false, onCompleteJob, onBuyConsumption, onNotify, onQuiz, onRestart }) {
  const hostRef = useRef(null);
  const gameRef = useRef(null);
  const latestRef = useRef({ playerCharacter, progress });
  const [nearPlace, setNearPlace] = useState(null);
  const [activePlace, setActivePlace] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [cardBookOpen, setCardBookOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(true);
  const [boardVisited, setBoardVisited] = useState(false);
  const previousQuestStageRef = useRef(null);

  latestRef.current = {
    playerCharacter,
    progress,
    actionPlaceIds: activityPlaces.map((place) => place.id),
    activePlaceId: activePlace?.id ?? null,
    inputLocked: inputLocked || Boolean(activePlace) || editorOpen || cardBookOpen || tutorialOpen
  };

  useEffect(() => {
    if (!hostRef.current || gameRef.current) return;
    gameRef.current = createGame(hostRef.current, {
      getState: () => latestRef.current,
      onNearChange: setNearPlace,
      onInteract: (place) => setActivePlace(place)
    });
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const todoText = useMemo(() => {
    const productionCount = progress.cards.filter((card) => card.type === "production").length;
    const consumptionCount = progress.cards.filter((card) => card.type === "consumption").length;
    return `생산 ${productionCount}/5 · 소비 ${consumptionCount}/2`;
  }, [progress.cards]);
  const questText = useMemo(() => {
    const productionCount = progress.cards.filter((card) => card.type === "production").length;
    const consumptionCount = progress.cards.filter((card) => card.type === "consumption").length;
    if (!boardVisited) return "퀘스트 1. 알바 게시판 찾아가기";
    if (progress.completedJobs.length < 1) return "퀘스트 2. 생산 알바 1개 완료하기";
    if (progress.completedConsumptions.length < 1) return "퀘스트 3. 번 돈으로 소비 1개 하기";
    if (productionCount < 5 || consumptionCount < 2) return "퀘스트 4. 생산 5장, 소비 2장 모으기";
    return "마지막. 퀴즈 버튼으로 하루 마무리하기";
  }, [boardVisited, progress.cards, progress.completedConsumptions.length, progress.completedJobs.length]);
  const questStage = useMemo(() => {
    const productionCount = progress.cards.filter((card) => card.type === "production").length;
    const consumptionCount = progress.cards.filter((card) => card.type === "consumption").length;
    if (!boardVisited) return 0;
    if (progress.completedJobs.length < 1) return 1;
    if (progress.completedConsumptions.length < 1) return 2;
    if (productionCount < 5 || consumptionCount < 2) return 3;
    return 4;
  }, [boardVisited, progress.cards, progress.completedConsumptions.length, progress.completedJobs.length]);
  const promptText = useMemo(() => {
    if (nearPlace) return <><b>{nearPlace.icon ?? "📍"} {nearPlace.name}</b>에서 할 일을 볼 수 있어요.</>;
    if (!boardVisited) return <>먼저 <b>알바 게시판</b>을 찾아가서 오늘 할 수 있는 알바를 확인해요.</>;
    if (progress.completedJobs.length < 1) return <>가까운 가게에 들어가 <b>생산 알바</b>를 하나 해 봐요.</>;
    if (progress.completedConsumptions.length < 1) return <>번 돈으로 피자, 아이스크림, 공연 같은 <b>소비 활동</b>을 해 봐요.</>;
    const productionCount = progress.cards.filter((card) => card.type === "production").length;
    const consumptionCount = progress.cards.filter((card) => card.type === "consumption").length;
    if (productionCount < 5 || consumptionCount < 2) return <>목표까지 <b>생산 {Math.max(0, 5 - productionCount)}장</b>, <b>소비 {Math.max(0, 2 - consumptionCount)}장</b>이 더 필요해요.</>;
    return <>카드를 다 모았어요. 왼쪽의 <b>퀴즈</b> 버튼으로 하루를 마무리해요.</>;
  }, [boardVisited, nearPlace, progress.cards, progress.completedConsumptions.length, progress.completedJobs.length]);

  useEffect(() => {
    if (previousQuestStageRef.current === null) {
      previousQuestStageRef.current = questStage;
      return;
    }
    if (questStage <= previousQuestStageRef.current) return;
    previousQuestStageRef.current = questStage;
    const completedQuest = [
      "알바 게시판을 찾았어요.",
      "첫 생산 알바를 완료했어요.",
      "첫 소비 활동을 완료했어요.",
      "생산 카드 5장과 소비 카드 2장을 모았어요."
    ][questStage - 1];
    if (completedQuest) {
      onNotify?.({
        kicker: "퀘스트 완료",
        title: "퀘스트를 완료하였습니다",
        message: completedQuest,
        icon: "✅"
      });
    }
  }, [onNotify, questStage]);

  const recentCards = progress.cards.slice(-3);
  const productionCards = progress.cards.filter((card) => card.type === "production");
  const consumptionCards = progress.cards.filter((card) => card.type === "consumption");
  const closeActivityOverlay = () => {
    if (activePlace?.id === "board") setBoardVisited(true);
    setActivePlace(null);
  };

  return (
    <section className="game-shell indie-shell">
      <div className="phaser-host" ref={hostRef} />

      <aside className="game-hud alba-hud indie-hud" aria-label="상태창">
        <div className="indie-hud-top">
          <div className="avatar-chip indie-avatar">{playerCharacter.icon}</div>
          <div className="indie-title">
            <p>내일은 알바왕!</p>
            <strong>{todoText}</strong>
          </div>
        </div>

        <div className="status-grid indie-status-grid">
          <div><span>돈</span><b>{progress.coins}원</b></div>
          <button className="hud-card-button" onClick={() => setCardBookOpen(true)}>
            <span>카드</span><b>{progress.cards.length}</b>
          </button>
        </div>

        <div className="quest-guide">
          <span>지금 할 일</span>
          <b>{questText}</b>
        </div>

        <div className="indie-card-peek" aria-label="최근 활동 카드">
          {recentCards.length ? recentCards.map((card) => (
            <span className={`mini-card-dot ${card.type}`} key={card.id} title={card.title}>{card.badge}</span>
          )) : <span className="indie-empty">첫 알바를 찾아봐요</span>}
        </div>

        <div className="indie-actions">
          <button className="primary" disabled={!canFinish} onClick={onQuiz}>퀴즈</button>
          <button className="secondary" onClick={() => setEditorOpen(true)}>맵</button>
          <button className="ghost" onClick={onRestart}>처음</button>
        </div>
      </aside>

      <div className="mission-prompt alba-prompt indie-prompt">
        <span>{promptText}</span>
        <button className="primary" disabled={!nearPlace} onClick={() => setActivePlace(nearPlace)}>시작</button>
      </div>

      <TouchControls />
      {tutorialOpen && <SystemTutorial onClose={() => setTutorialOpen(false)} />}
      {cardBookOpen && (
        <CardBook
          productionCards={productionCards}
          consumptionCards={consumptionCards}
          onClose={() => setCardBookOpen(false)}
        />
      )}
      {activePlace && (
        <ActivityOverlay
          place={activePlace}
          progress={progress}
          onClose={closeActivityOverlay}
          onCompleteJob={onCompleteJob}
          onBuyConsumption={onBuyConsumption}
        />
      )}
      {editorOpen && <PlacementEditor onClose={() => setEditorOpen(false)} />}
    </section>
  );
}

function SystemTutorial({ onClose }) {
  const lines = [
    "안녕! 여기는 알바 마을이야. 오늘은 마을을 돌아다니며 알바를 해 볼 거야.",
    "먼저 알바 게시판을 찾아가 봐. 가까이 가면 아래에 시작 버튼이 나와.",
    "알바를 하면 돈을 벌 수 있어. 번 돈으로 피자나 아이스크림도 살 수 있어.",
    "오늘의 목표는 생산 카드 5장, 소비 카드 2장이야. 카드를 다 모으면 마지막 퀴즈에 도전해 보자!"
  ];
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const line = lines[index] ?? "";
  const isTyping = visibleCount < line.length;
  const last = index >= lines.length - 1;
  const next = () => {
    if (isTyping) {
      setVisibleCount(line.length);
      return;
    }
    if (last) onClose();
    else {
      setIndex((value) => value + 1);
      setVisibleCount(0);
    }
  };

  useEffect(() => {
    setVisibleCount(0);
  }, [index]);

  useEffect(() => {
    if (!isTyping) return undefined;
    const timer = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(line.length, count + 1));
    }, 24);
    return () => window.clearTimeout(timer);
  }, [isTyping, line.length, visibleCount]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!["Space", "Enter"].includes(event.code)) return;
      event.preventDefault();
      next();
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  });

  return (
    <div className="system-tutorial-layer" role="dialog" aria-modal="true" aria-label="시스템 튜토리얼">
      <section className="system-tutorial-dialog" onClick={next}>
        <div className="system-portrait">SYS</div>
        <div className="system-tutorial-copy">
          <div className="npc-nameplate"><b>시스템</b><span>{index + 1}/{lines.length}</span></div>
          <p>{line.slice(0, visibleCount)}{isTyping && <span className="typewriter-caret" aria-hidden="true">▌</span>}</p>
          <button className="primary" onClick={(event) => { event.stopPropagation(); next(); }}>{isTyping ? "넘기기" : last ? "시작하기" : "다음"}</button>
        </div>
      </section>
    </div>
  );
}

function CardBook({ productionCards, consumptionCards, onClose }) {
  return (
    <div className="card-book-overlay" role="dialog" aria-modal="true" aria-label="활동 카드함">
      <section className="card-book-panel">
        <div className="card-book-head">
          <div>
            <p className="eyebrow">내가 모은 활동 카드</p>
            <h2>생산과 소비 기록</h2>
          </div>
          <button className="icon-button" onClick={onClose}>X</button>
        </div>

        <div className="card-book-columns">
          <CardBookColumn
            title="생산"
            count={productionCards.length}
            hint="알바를 해서 물건이나 서비스를 만들고 준비한 활동"
            cards={productionCards}
            empty="아직 생산 카드가 없어요. 알바를 해 보면 여기에 기록돼요."
          />
          <CardBookColumn
            title="소비"
            count={consumptionCards.length}
            hint="돈을 써서 물건이나 서비스를 이용한 활동"
            cards={consumptionCards}
            empty="아직 소비 카드가 없어요. 번 돈으로 물건이나 서비스를 이용해 봐요."
          />
        </div>
      </section>
    </div>
  );
}

function CardBookColumn({ title, count, hint, cards, empty }) {
  return (
    <article className={`card-book-column ${title === "소비" ? "consumption" : "production"}`}>
      <div className="card-book-column-head">
        <b>{title}</b>
        <span>{count}장</span>
      </div>
      <p>{hint}</p>
      <div className="card-book-list">
        {cards.length ? cards.map((card) => (
          <section className="learning-card" key={card.id}>
            <div className="learning-card-badge">{card.badge}</div>
            <div>
              <h3>{card.title}</h3>
              <strong>{card.description}</strong>
              <p>{card.feedback}</p>
            </div>
          </section>
        )) : <div className="card-book-empty">{empty}</div>}
      </div>
    </article>
  );
}

function TouchControls() {
  const send = (dir, pressed) => {
    window.dispatchEvent(new CustomEvent("town-control", { detail: { dir, pressed } }));
  };
  const bind = (dir) => ({
    onPointerDown: (event) => {
      event.preventDefault();
      send(dir, true);
    },
    onPointerUp: (event) => {
      event.preventDefault();
      send(dir, false);
    },
    onPointerCancel: () => send(dir, false),
    onPointerLeave: () => send(dir, false)
  });
  return (
    <div className="dpad indie-dpad" aria-label="이동 버튼">
      <button {...bind("up")}>↑</button>
      <button {...bind("left")}>←</button>
      <button {...bind("down")}>↓</button>
      <button {...bind("right")}>→</button>
    </div>
  );
}
