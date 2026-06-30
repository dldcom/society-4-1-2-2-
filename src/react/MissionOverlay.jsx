import { useMemo, useState } from "react";

export function MissionOverlay({ mission, onClose, onComplete }) {
  return (
    <div className="overlay">
      <div className="modal game-modal">
        <div className="game-head">
          <div>
            <p className="eyebrow">{mission.place}</p>
            <h2>{mission.title}</h2>
          </div>
          <button className="icon-button" onClick={onClose}>X</button>
        </div>
        <div className="game-body">
          <MiniGame mission={mission} onComplete={onComplete} />
        </div>
      </div>
    </div>
  );
}

function MiniGame({ mission, onComplete }) {
  if (mission.game === "packing") return <PackingGame mission={mission} onComplete={onComplete} />;
  if (mission.game === "sorting" || mission.game === "match") return <SortingGame mission={mission} onComplete={onComplete} />;
  if (mission.game === "delivery") return <DeliveryGame mission={mission} onComplete={onComplete} />;
  if (mission.game === "sequence" || mission.game === "making") return <SequenceGame mission={mission} onComplete={onComplete} />;
  if (mission.game === "rhythm") return <RhythmGame mission={mission} onComplete={onComplete} />;
  if (mission.game === "trace" || mission.game === "clean") return <CleanGame mission={mission} onComplete={onComplete} />;
  if (mission.game === "scene") return <SceneGame mission={mission} onComplete={onComplete} />;
  return <InspectionGame mission={mission} onComplete={onComplete} />;
}

function CompleteButton({ mission, onComplete }) {
  return (
    <button className="primary" onClick={onComplete}>
      {mission.type === "production" ? "생산" : "소비"} 활동 카드 받기
    </button>
  );
}

function GameFrame({ help, goal, progress, children }) {
  return (
    <div className="phaser-like-minigame">
      <div className="game-instruction">
        <p>{help}</p>
        <b>{goal}</b>
      </div>
      <div className="progress"><span style={{ width: `${progress}%` }} /></div>
      {children}
    </div>
  );
}

function InspectionGame({ mission, onComplete }) {
  const badIndexes = useMemo(() => new Set([1, 4, 7, 10]), []);
  const [picked, setPicked] = useState([]);
  const done = picked.length >= 3;
  return (
    <GameFrame help="문제가 있는 물건을 찾아 눌러요." goal="3개 이상 찾기" progress={(picked.length / 3) * 100}>
      <div className="mini-stage conveyor-stage">
        {Array.from({ length: 12 }).map((_, index) => {
          const bad = badIndexes.has(index);
          const hit = picked.includes(index);
          return (
            <button
              key={index}
              className={`${bad ? "bad" : ""} ${hit ? "hit" : ""}`}
              onClick={() => {
                if (bad && !hit) setPicked((value) => [...value, index]);
              }}
            >
              {hit ? "OK" : bad ? ["!", "?", "!!", "*"][picked.length % 4] : mission.badge}
            </button>
          );
        })}
      </div>
      <p>{mission.feedback}</p>
      {done && <CompleteButton mission={mission} onComplete={onComplete} />}
    </GameFrame>
  );
}

function PackingGame({ mission, onComplete }) {
  const [packed, setPacked] = useState(0);
  const total = 9;
  return (
    <GameFrame help="물건을 상자에 차곡차곡 담아요." goal={`${total}개 포장하기`} progress={(packed / total) * 100}>
      <div className="packing-zone">
        <div className="item-tray">
          {Array.from({ length: total }).map((_, index) => (
            <button
              key={index}
              className="pack-item"
              disabled={index < packed}
              onClick={() => setPacked((value) => Math.min(total, value + 1))}
            >
              {mission.badge}
            </button>
          ))}
        </div>
        <div className="packing-box">
          <b>포장 상자</b>
          <span>{packed} / {total}</span>
          {Array.from({ length: packed }).map((_, index) => <i key={index} className="box-spark">{mission.badge}</i>)}
        </div>
      </div>
      <p>{mission.feedback}</p>
      {packed >= total && <CompleteButton mission={mission} onComplete={onComplete} />}
    </GameFrame>
  );
}

function SortingGame({ mission, onComplete }) {
  const categories = ["준비", "정리", "전달"];
  const data = [
    { label: mission.badge, cat: "준비" },
    { label: "목록", cat: "준비" },
    { label: "바구니", cat: "정리" },
    { label: "표시", cat: "정리" },
    { label: "운반", cat: "전달" },
    { label: "도착", cat: "전달" }
  ];
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState([]);
  const placed = done.length;
  return (
    <GameFrame help="카드를 고른 뒤 알맞은 칸에 놓아요." goal="모두 정리하기" progress={(placed / data.length) * 100}>
      <div className="sorting-zone">
        <div className="sort-items">
          {data.map((item, index) => (
            done.includes(index) ? null : (
              <button
                key={index}
                className={`sort-card ${selected === index ? "selected" : ""}`}
                onClick={() => setSelected(index)}
              >
                {item.label}
              </button>
            )
          ))}
        </div>
        <div className="sort-bins">
          {categories.map((cat) => (
            <button
              key={cat}
              className="sort-bin"
              onClick={() => {
                if (selected === null) return;
                if (data[selected].cat === cat) {
                  setDone((value) => [...value, selected]);
                  setSelected(null);
                }
              }}
            >
              <b>{cat}</b>
              <span>{done.filter((index) => data[index].cat === cat).map((index) => data[index].label).join(" ")}</span>
            </button>
          ))}
        </div>
      </div>
      <p>{mission.feedback}</p>
      {placed === data.length && <CompleteButton mission={mission} onComplete={onComplete} />}
    </GameFrame>
  );
}

function DeliveryGame({ mission, onComplete }) {
  const [pos, setPos] = useState({ x: 8, y: 68 });
  const arrived = pos.x > 78 && pos.y < 30;
  const move = (dx, dy) => {
    setPos((value) => ({
      x: Math.max(5, Math.min(88, value.x + dx)),
      y: Math.max(14, Math.min(78, value.y + dy))
    }));
  };
  return (
    <GameFrame help="작은 길을 지나 목적지까지 이동해요." goal="깃발에 도착하기" progress={Math.min(100, ((pos.x - 8) / 70) * 70 + ((68 - pos.y) / 38) * 30)}>
      <div className="mini-road">
        <div className="runner" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>{mission.badge}</div>
        <div className="goal-flag">GO</div>
        <div className="obstacle" style={{ left: "34%", top: "58%" }}>물</div>
        <div className="obstacle" style={{ left: "56%", top: "45%" }}>공사</div>
      </div>
      <div className="mini-controls">
        <button onClick={() => move(0, -9)}>▲</button>
        <button onClick={() => move(-9, 0)}>◀</button>
        <button onClick={() => move(0, 9)}>▼</button>
        <button onClick={() => move(9, 0)}>▶</button>
      </div>
      <p>{mission.feedback}</p>
      {arrived && <CompleteButton mission={mission} onComplete={onComplete} />}
    </GameFrame>
  );
}

function SequenceGame({ mission, onComplete }) {
  const steps = mission.game === "making"
    ? ["재료", "준비", "만들기", "확인", "완성"]
    : ["점검", "준비", "이동", "확인", "완료"];
  const [step, setStep] = useState(0);
  return (
    <GameFrame help="순서대로 눌러 미션을 완성해요." goal="5단계 완료" progress={(step / steps.length) * 100}>
      <div className="sequence-zone">
        {steps.map((label, index) => (
          <button
            key={label}
            className={`seq-step ${index < step ? "done" : ""}`}
            onClick={() => {
              if (index === step) setStep((value) => value + 1);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <p>{mission.feedback}</p>
      {step >= steps.length && <CompleteButton mission={mission} onComplete={onComplete} />}
    </GameFrame>
  );
}

function RhythmGame({ mission, onComplete }) {
  const [hits, setHits] = useState(0);
  return (
    <GameFrame help="움직이는 표시를 타이밍에 맞춰 눌러요." goal="6번 성공" progress={(hits / 6) * 100}>
      <div className="rhythm-stage">
        <button className="note" onClick={() => setHits((value) => Math.min(6, value + 1))}>{mission.badge}</button>
      </div>
      <p>{mission.feedback}</p>
      {hits >= 6 && <CompleteButton mission={mission} onComplete={onComplete} />}
    </GameFrame>
  );
}

function CleanGame({ mission, onComplete }) {
  const [cleaned, setCleaned] = useState([]);
  return (
    <GameFrame help="반짝이는 표시를 모두 눌러 정리해요." goal="6개 정리하기" progress={(cleaned.length / 6) * 100}>
      <div className="clean-zone">
        {Array.from({ length: 6 }).map((_, index) => (
          cleaned.includes(index) ? null : (
            <button
              key={index}
              className="clean-dot"
              style={{ left: `${14 + (index * 15) % 72}%`, top: `${22 + (index % 3) * 24}%` }}
              onClick={() => setCleaned((value) => [...value, index])}
            >
              {mission.badge}
            </button>
          )
        ))}
      </div>
      <p>{mission.feedback}</p>
      {cleaned.length >= 6 && <CompleteButton mission={mission} onComplete={onComplete} />}
    </GameFrame>
  );
}

function SceneGame({ mission, onComplete }) {
  return (
    <GameFrame help="소비 장면을 살펴보고 카드를 받아요." goal="장면 확인" progress={100}>
      <div className="scene-card">
        <div className="scene-people"><span>사람</span><span>{mission.badge}</span><span>사용</span></div>
        <h3>{mission.title}</h3>
        <p>{mission.description}</p>
        <CompleteButton mission={mission} onComplete={onComplete} />
      </div>
    </GameFrame>
  );
}
