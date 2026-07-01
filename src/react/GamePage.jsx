import { useEffect, useMemo, useRef, useState } from "react";
import { activityPlaces, consumptions, jobs } from "../data/alba.js";
import { createGame } from "../phaser/createGame.js";
import { ActivityOverlay } from "./ActivityOverlay.jsx";
import { PlacementEditor } from "./PlacementEditor.jsx";

export function GamePage({ playerCharacter, progress, canFinish, inputLocked = false, onCompleteJob, onBuyConsumption, onQuiz, onRestart }) {
  const hostRef = useRef(null);
  const gameRef = useRef(null);
  const latestRef = useRef({ playerCharacter, progress });
  const [nearPlace, setNearPlace] = useState(null);
  const [activePlace, setActivePlace] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [cardBookOpen, setCardBookOpen] = useState(false);

  latestRef.current = {
    playerCharacter,
    progress,
    actionPlaceIds: activityPlaces.map((place) => place.id),
    activePlaceId: activePlace?.id ?? null,
    inputLocked: inputLocked || Boolean(activePlace) || editorOpen || cardBookOpen
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
    const remainingJobs = jobs.length - progress.completedJobs.length;
    const remainingConsumptions = consumptions.length - progress.completedConsumptions.length;
    return `알바 ${remainingJobs} · 소비 ${remainingConsumptions}`;
  }, [progress.completedJobs.length, progress.completedConsumptions.length]);

  const recentCards = progress.cards.slice(-3);
  const productionCards = progress.cards.filter((card) => card.type === "production");
  const consumptionCards = progress.cards.filter((card) => card.type === "consumption");

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
          <div><span>코인</span><b>{progress.coins}</b></div>
          <div><span>체력</span><b>{progress.energy}/{progress.maxEnergy}</b></div>
          <button className="hud-card-button" onClick={() => setCardBookOpen(true)}>
            <span>카드</span><b>{progress.cards.length}</b>
          </button>
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
        <span>{nearPlace ? <><b>{nearPlace.icon ?? "📍"} {nearPlace.name}</b>에서 할 일을 볼 수 있어요.</> : <>반짝이는 장소 가까이 가 볼까요?</>}</span>
        <button className="primary" disabled={!nearPlace} onClick={() => setActivePlace(nearPlace)}>시작</button>
      </div>

      <TouchControls />
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
          onClose={() => setActivePlace(null)}
          onCompleteJob={onCompleteJob}
          onBuyConsumption={onBuyConsumption}
        />
      )}
      {editorOpen && <PlacementEditor onClose={() => setEditorOpen(false)} />}
    </section>
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
            hint="코인을 써서 물건이나 서비스를 이용한 활동"
            cards={consumptionCards}
            empty="아직 소비 카드가 없어요. 번 코인으로 물건이나 서비스를 이용해 봐요."
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
