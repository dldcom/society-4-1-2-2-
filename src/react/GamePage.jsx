import { useEffect, useMemo, useRef, useState } from "react";
import { createGame } from "../phaser/createGame.js";
import { PlacementEditor } from "./PlacementEditor.jsx";

export function GamePage({ playerCharacter, character, missionIndex, cards, onMissionComplete, onBackToMissions }) {
  const hostRef = useRef(null);
  const gameRef = useRef(null);
  const latestRef = useRef({ playerCharacter, character, missionIndex });
  const [near, setNear] = useState(false);
  const [activeMission, setActiveMission] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  latestRef.current = { playerCharacter, character, missionIndex };
  const mission = character.missions[missionIndex];

  useEffect(() => {
    if (!hostRef.current || gameRef.current) return;
    gameRef.current = createGame(hostRef.current, {
      getState: () => latestRef.current,
      onNearChange: setNear,
      onInteract: () => {
        const { character: c, missionIndex: i } = latestRef.current;
        setActiveMission(c.missions[i]);
      }
    });
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    setNear(false);
    setActiveMission(null);
  }, [missionIndex, character.id]);

  const progressText = useMemo(() => `${Math.min(missionIndex + 1, character.missions.length)} / ${character.missions.length}`, [missionIndex, character.missions.length]);

  return (
    <section className="game-shell">
      <div className="phaser-host" ref={hostRef} />
      <aside className="game-hud">
        <div className="hud-title">
          <div className="avatar-chip">{playerCharacter.icon}</div>
          <div>
            <p>{playerCharacter.name}의 미션</p>
            <strong>{mission?.title ?? "퀴즈로 이동"}</strong>
          </div>
        </div>
        <div className="mission-strip">
          {character.missions.map((item, index) => (
            <span key={item.id} className={index < missionIndex ? "done" : index === missionIndex ? "now" : ""}>{index + 1}</span>
          ))}
        </div>
        <p className="npc-line"><b>{character.npc}</b><br />{mission ? `다음 장소: ${mission.place}` : "활동을 정리해 볼까요?"}</p>
        <p className="npc-line"><b>선택 미션</b><br />{character.icon} {character.name}</p>
        <p className="npc-line">진행: {progressText}</p>
        <div className="card-stack">
          {cards.length ? cards.map((card) => <div className={`tiny-card ${card.type}`} key={card.id}>{card.badge} {card.title}</div>) : <div className="empty-note">아직 모은 카드가 없어요.</div>}
        </div>
        <button className="secondary" onClick={() => setEditorOpen(true)}>건물 위치 조정</button>
        <button className="ghost" onClick={onBackToMissions}>미션 선택</button>
      </aside>
      <div className="mission-prompt">
        {near ? <><b>{character.npc}</b> 도착했어요. 스페이스키나 시작 버튼을 눌러요.</> : <>반짝이는 느낌표가 있는 <b>{mission?.place}</b>로 이동해요.</>}
        <button className="primary" disabled={!near} onClick={() => setActiveMission(mission)}>미션 시작</button>
      </div>
      <TouchControls />
      {activeMission && (
        <MissionOverlay
          mission={activeMission}
          onClose={() => setActiveMission(null)}
          onComplete={() => {
            setActiveMission(null);
            onMissionComplete(activeMission);
          }}
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
    <div className="dpad" aria-label="이동 버튼">
      <button {...bind("up")}>▲</button>
      <button {...bind("left")}>◀</button>
      <button {...bind("down")}>▼</button>
      <button {...bind("right")}>▶</button>
    </div>
  );
}

function MissionOverlay({ mission, onClose, onComplete }) {
  const [progress, setProgress] = useState(0);
  const total = mission.game === "delivery" ? 8 : 6;
  const clickLabel = mission.game === "scene" ? "장면 확인하기" : mission.game === "delivery" ? "앞으로 이동하기" : "미션 수행하기";
  const done = progress >= total;

  return (
    <div className="overlay">
      <div className="modal game-modal">
        <div className="game-head">
          <div>
            <p className="eyebrow">{mission.place}</p>
            <h2>{mission.title}</h2>
          </div>
          <button className="icon-button" onClick={onClose}>×</button>
        </div>
        <div className="game-body">
          <div className={`phaser-like-minigame ${mission.game}`}>
            <div className="mini-stage">
              {Array.from({ length: total }).map((_, index) => (
                <button
                  key={index}
                  className={index < progress ? "hit" : ""}
                  onClick={() => setProgress((value) => Math.min(total, value + 1))}
                >
                  {mission.badge}
                </button>
              ))}
            </div>
            <div className="progress"><span style={{ width: `${(progress / total) * 100}%` }} /></div>
            <p>{mission.feedback}</p>
            {done ? (
              <button className="primary" onClick={onComplete}>{mission.type === "production" ? "생산" : "소비"} 활동 카드 받기</button>
            ) : (
              <button className="secondary" onClick={() => setProgress((value) => Math.min(total, value + 1))}>{clickLabel}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
