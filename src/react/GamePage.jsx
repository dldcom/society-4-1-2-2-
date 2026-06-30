import { useEffect, useMemo, useRef, useState } from "react";
import { activityPlaces, consumptions, jobs } from "../data/alba.js";
import { createGame } from "../phaser/createGame.js";
import { ActivityOverlay } from "./ActivityOverlay.jsx";
import { PlacementEditor } from "./PlacementEditor.jsx";

export function GamePage({ playerCharacter, progress, canFinish, onCompleteJob, onBuyConsumption, onQuiz, onRestart }) {
  const hostRef = useRef(null);
  const gameRef = useRef(null);
  const latestRef = useRef({ playerCharacter, progress });
  const [nearPlace, setNearPlace] = useState(null);
  const [activePlace, setActivePlace] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  latestRef.current = {
    playerCharacter,
    progress,
    actionPlaceIds: activityPlaces.map((place) => place.id)
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
          <div><span>카드</span><b>{progress.cards.length}</b></div>
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
