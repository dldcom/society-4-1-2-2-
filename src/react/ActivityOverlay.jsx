import { useEffect, useMemo, useState } from "react";
import { getConsumptionsAtPlace, getJobsAtPlace } from "../data/alba.js";

export function ActivityOverlay({ place, progress, onClose, onCompleteJob, onBuyConsumption }) {
  const jobs = useMemo(() => getJobsAtPlace(place.id), [place.id]);
  const consumptions = useMemo(() => getConsumptionsAtPlace(place.id), [place.id]);
  const [activeJob, setActiveJob] = useState(null);
  const [mode, setMode] = useState("talk");
  const [message, setMessage] = useState("");
  const npc = place.npc ?? { name: `${place.name} 주인`, role: "동네 주민", portrait: "🙂", greeting: "어서 와. 무슨 일로 들렀어?" };

  if (activeJob) {
    return (
      <div className="overlay">
        <div className="modal game-modal">
          <div className="game-head">
            <div>
              <p className="eyebrow">{npc.name}의 부탁</p>
              <h2>{activeJob.icon} {activeJob.title}</h2>
            </div>
            <button className="icon-button" onClick={() => setActiveJob(null)}>X</button>
          </div>
          <div className="game-body">
            <MiniGame job={activeJob} onComplete={() => {
              onCompleteJob(activeJob);
              setActiveJob(null);
              onClose();
            }} />
          </div>
        </div>
      </div>
    );
  }

  const askJob = () => {
    setMode("jobs");
    setMessage(jobs.length ? npc.jobLine ?? "마침 부탁할 일이 하나 있어. 해 볼래?" : npc.noJobLine ?? "오늘은 맡길 일이 없네. 다른 가게도 한번 들러 봐.");
  };

  const askShop = () => {
    setMode("shop");
    setMessage(consumptions.length ? npc.shopLine ?? "좋아. 천천히 둘러보고 마음에 드는 걸 골라 봐." : npc.noShopLine ?? "지금은 팔 만한 게 없어. 그래도 들러 줘서 고마워.");
  };

  const buy = (item) => {
    const queued = onBuyConsumption(item);
    if (queued) onClose();
    else setMessage("앗, 코인이 조금 모자라. 알바를 하나 하고 다시 와 볼래?");
  };

  const line = message || npc.greeting || "어서 와. 무슨 일로 들렀어?";

  return (
    <div className="overlay npc-rpg-overlay">
      <div className="npc-rpg-layer">
        <button className="icon-button npc-close-button" onClick={onClose}>X</button>

        {mode === "talk" && (
          <div className="npc-choice-panel npc-choice-compact">
            {place.id === "board" && <div className="board-note npc-board-note"><b>오늘의 목표</b><span>알바로 생산 활동을 경험하고, 번 코인으로 소비 활동도 해 봐요.</span></div>}
            <button className="primary" onClick={askJob}>알바할 거리가 있나요?</button>
            <button className="secondary" onClick={askShop}>물건을 사러 왔어요</button>
          </div>
        )}

        {mode === "jobs" && (
          <div className="npc-choice-panel npc-activity-panel">
            <div className="npc-panel-head"><b>알바할 거리</b><button className="ghost" onClick={() => setMode("talk")}>돌아가기</button></div>
            <ActivityList jobs={jobs} consumptions={[]} progress={progress} onStartJob={setActiveJob} onBuy={buy} />
          </div>
        )}

        {mode === "shop" && (
          <div className="npc-choice-panel npc-activity-panel">
            <div className="npc-panel-head"><b>살 수 있는 것</b><button className="ghost" onClick={() => setMode("talk")}>돌아가기</button></div>
            <ActivityList jobs={[]} consumptions={consumptions} progress={progress} onStartJob={setActiveJob} onBuy={buy} />
          </div>
        )}

        <section className="npc-bottom-dialog" aria-label={`${npc.name} 대화`}>
          <div className="npc-portrait-card rpg-portrait">
            <span>{npc.portrait ?? place.icon ?? "🙂"}</span>
          </div>
          <div className="npc-dialog-text">
            <div className="npc-nameplate"><b>{npc.name}</b><span>{npc.role}</span></div>
            <p>{line}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function ActivityList({ jobs, consumptions, progress, onStartJob, onBuy }) {
  return <div className="activity-list">
    {jobs.map((job) => {
      const done = progress.completedJobs.includes(job.id);
      const tired = progress.energy < job.energyCost;
      return <article className="activity-option production" key={job.id}>
        <div className="activity-icon">{job.icon}</div>
        <div><p className="eyebrow">알바 · 생산 활동</p><h3>{job.title}</h3><p>{job.goal}</p><small>보상 {job.rewardCoins}코인 · 체력 -{job.energyCost}</small></div>
        <button className="primary" disabled={done || tired} onClick={() => onStartJob(job)}>{done ? "완료" : tired ? "체력 부족" : "알바 시작"}</button>
      </article>;
    })}
    {consumptions.map((item) => {
      const bought = progress.completedConsumptions.includes(item.id);
      const poor = progress.coins < item.costCoins;
      return <article className="activity-option consumption" key={item.id}>
        <div className="activity-icon">{item.icon}</div>
        <div><p className="eyebrow">소비 활동</p><h3>{item.title}</h3><p>{item.card.feedback}</p><small>{item.costCoins}코인 사용{item.energyGain ? ` · 체력 +${item.energyGain}` : ""}</small></div>
        <button className="secondary" disabled={bought || poor} onClick={() => onBuy(item)}>{bought ? "완료" : poor ? "코인 부족" : "소비하기"}</button>
      </article>;
    })}
    {!jobs.length && !consumptions.length && <div className="board-note"><b>아직 준비 중</b><span>이 장소의 활동은 다음 버전에 추가할게요.</span></div>}
  </div>;
}function MiniGame({ job, onComplete }) {
  if (job.engine === "careGauge") return <CareGaugeGame job={job} onComplete={onComplete} />;
  if (job.engine === "wirePuzzle") return <WirePuzzleGame job={job} onComplete={onComplete} />;
  if (job.engine === "roleRhythm") return <RoleRhythmGame job={job} onComplete={onComplete} />;
  if (job.engine === "photoTiming") return <PhotoTimingGame job={job} onComplete={onComplete} />;
  if (job.engine === "deliveryGrid") return <DeliveryGridGame job={job} onComplete={onComplete} />;
  if (job.engine === "sequenceBuild") return <SequenceBuildGame job={job} onComplete={onComplete} />;
  return <OrderCraftGame job={job} onComplete={onComplete} />;
}

function MiniFrame({ job, progress, children, message, onComplete, done }) {
  return <div className="phaser-like-minigame alba-minigame">
    <div className="game-instruction"><p>{job.goal}</p><b>{Math.min(100, Math.round(progress))}%</b></div>
    <div className="progress"><span style={{ width: `${Math.min(100, progress)}%` }} /></div>
    {children}
    <p className="game-message">{message || job.productionText}</p>
    {done && <button className="primary" onClick={onComplete}>알바 완료하고 카드 받기</button>}
  </div>;
}

function OrderCraftGame({ job, onComplete }) {
  const [picked, setPicked] = useState([]);
  const [revealed, setRevealed] = useState(true);
  const [mistakes, setMistakes] = useState(0);
  const order = job.config.order;
  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(false), job.config.revealMs ?? 2500);
    return () => window.clearTimeout(timer);
  }, [job.id, job.config.revealMs]);
  const done = picked.length === order.length && picked.every((item, index) => item === order[index]);
  const wrong = picked.length === order.length && !done;
  const choose = (choice) => {
    setPicked((value) => {
      const next = value.length >= order.length ? [choice] : [...value, choice];
      if (next.length === order.length && !next.every((item, index) => item === order[index])) setMistakes((count) => count + 1);
      return next;
    });
  };
  return <MiniFrame job={job} progress={(picked.length / order.length) * 100} done={done} onComplete={onComplete} message={wrong ? `주문이 달라요. 실수 ${mistakes}번, 다시 기억해 봐요.` : revealed ? "주문 카드를 외워요. 곧 가려집니다." : "기억한 순서대로 골라요."}>
    <div className="order-game-zone">
      <div className="order-card"><b>주문</b><span>{revealed || wrong || done ? order.join(" ") : "❔ ❔ ❔"}</span><button className="secondary" onClick={() => setRevealed(true)}>잠깐 보기</button></div>
      <div className="pizza-canvas"><span>{job.config.base}</span><i>{picked.join(" ")}</i></div>
      <div className="ingredient-tray">{job.config.choices.map((choice) => <button key={choice} onClick={() => choose(choice)}>{choice}</button>)}<button onClick={() => setPicked([])}>↺</button></div>
    </div>
  </MiniFrame>;
}

function CareGaugeGame({ job, onComplete }) {
  const pets = job.config.pets;
  const [scores, setScores] = useState(Object.fromEntries(pets.map((pet) => [pet.id, 0])));
  const [mistakes, setMistakes] = useState(0);
  const totalNeeds = pets.reduce((sum, pet) => sum + pet.needs.length, 0);
  const doneCount = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const done = doneCount >= totalNeeds;
  const currentNeed = (pet) => pet.needs[Math.min(scores[pet.id], pet.needs.length - 1)];
  const useTool = (tool, pet) => {
    if (done || scores[pet.id] >= pet.needs.length) return;
    if (tool.label === currentNeed(pet)) setScores((value) => ({ ...value, [pet.id]: value[pet.id] + 1 }));
    else setMistakes((value) => value + 1);
  };
  return <MiniFrame job={job} progress={(doneCount / totalNeeds) * 100} done={done} onComplete={onComplete} message={done ? "두 동물이 모두 만족했어요!" : `동물별 요구를 보고 맞는 도구를 골라요. 실수 ${mistakes}번`}>
    <div className="care-zone multi-care-zone">
      {pets.map((pet) => <div className="pet-card" key={pet.id}><span>{pet.icon}</span><b>{pet.name}</b><em>{scores[pet.id] >= pet.needs.length ? "💖 만족" : currentNeed(pet)}</em><div className="tool-tray compact-tools">{job.config.tools.map((tool) => <button key={tool.id} onClick={() => useTool(tool, pet)}>{tool.icon}<small>{tool.label}</small></button>)}</div></div>)}
    </div>
  </MiniFrame>;
}

function WirePuzzleGame({ job, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [wires, setWires] = useState([]);
  const [parts, setParts] = useState([]);
  const done = wires.length >= job.config.wires.length && parts.length >= job.config.parts.length;
  const chooseWire = (side, color) => {
    if (side === "left") return setSelected(color);
    if (selected === color && !wires.includes(color)) {
      setWires((value) => [...value, color]);
      setSelected(null);
    }
  };
  return <MiniFrame job={job} progress={((wires.length + parts.length) / (job.config.wires.length + job.config.parts.length)) * 100} done={done} onComplete={onComplete} message="같은 색 전선을 연결한 뒤 부품을 끼워요.">
    <div className="repair-zone wire-zone">
      <div className="machine-face"><span>{done ? "✨🕹️✨" : "⚠️🕹️⚠️"}</span></div>
      <div className="wire-board">
        <div>{job.config.wires.map((color) => <button key={color} className={`wire-pin ${color} ${selected === color ? "selected" : ""}`} onClick={() => chooseWire("left", color)}>{color}</button>)}</div>
        <div>{job.config.wires.map((color) => <button key={color} className={`wire-pin ${color} ${wires.includes(color) ? "filled" : ""}`} onClick={() => chooseWire("right", color)}>{wires.includes(color) ? "연결" : color}</button>)}</div>
      </div>
      <div className="part-tray">{job.config.parts.map((part) => <button key={part.id} className={parts.includes(part.id) ? "filled" : ""} onClick={() => setParts((value) => value.includes(part.id) ? value : [...value, part.id])}>{part.icon}<small>{part.label}</small></button>)}</div>
    </div>
  </MiniFrame>;
}

function RoleRhythmGame({ job, onComplete }) {
  const [index, setIndex] = useState(0);
  const [miss, setMiss] = useState(0);
  const target = job.config.notes[index];
  const done = index >= job.config.notes.length;
  const hit = (role) => {
    if (role.icon === target) setIndex((value) => value + 1);
    else setMiss((value) => value + 1);
  };
  return <MiniFrame job={job} progress={(index / job.config.notes.length) * 100} done={done} onComplete={onComplete} message={done ? "무대 준비 완료!" : `이번 신호는 ${target} 입니다. 실수 ${miss}번`}>
    <div className="rhythm-stage alba-rhythm role-rhythm"><div className="falling-note">{target}</div><div className="role-buttons">{job.config.roles.map((role) => <button key={role.icon} onClick={() => hit(role)}>{role.icon}<small>{role.label}</small></button>)}</div></div>
  </MiniFrame>;
}

function PhotoTimingGame({ job, onComplete }) {
  const [tick, setTick] = useState(0);
  const [shots, setShots] = useState([]);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 700);
    return () => window.clearInterval(timer);
  }, []);
  const pose = job.config.poses[tick % job.config.poses.length];
  const good = pose === "😁";
  const done = shots.filter(Boolean).length >= 2;
  return <MiniFrame job={job} progress={(shots.filter(Boolean).length / 2) * 100} done={done} onComplete={onComplete} message={done ? "선명한 사진을 골랐어요!" : "활짝 웃는 순간에 셔터를 눌러요."}>
    <div className="photo-zone"><div className="photo-frame"><span>{pose}</span></div><button className="primary" onClick={() => setShots((value) => [...value, good])}>찰칵!</button><div className="shot-strip">{shots.map((shot, i) => <i key={i}>{shot ? "🖼️" : "🌫️"}</i>)}</div></div>
  </MiniFrame>;
}

function DeliveryGridGame({ job, onComplete }) {
  const [pos, setPos] = useState(job.config.start);
  const [steps, setSteps] = useState(0);
  const key = (cell) => cell.join(",");
  const blocks = new Set(job.config.blocks.map(key));
  const done = key(pos) === key(job.config.goal);
  const move = (dx, dy) => {
    const next = [Math.max(0, Math.min(job.config.cols - 1, pos[0] + dx)), Math.max(0, Math.min(job.config.rows - 1, pos[1] + dy))];
    if (blocks.has(key(next))) return;
    setPos(next);
    setSteps((value) => value + 1);
  };
  const distance = Math.abs(pos[0] - job.config.goal[0]) + Math.abs(pos[1] - job.config.goal[1]);
  return <MiniFrame job={job} progress={done ? 100 : Math.max(10, 100 - distance * 14)} done={done} onComplete={onComplete} message={done ? `배달 성공! 이동 ${steps}번` : "장애물을 피해 목적지까지 이동해요."}>
    <div className="delivery-zone"><div className="delivery-grid" style={{ gridTemplateColumns: `repeat(${job.config.cols}, 1fr)` }}>{Array.from({ length: job.config.cols * job.config.rows }).map((_, i) => { const cell = [i % job.config.cols, Math.floor(i / job.config.cols)]; const isBlock = blocks.has(key(cell)); const isGoal = key(cell) === key(job.config.goal); const isPlayer = key(cell) === key(pos); return <span key={i} className={isBlock ? "block" : isGoal ? "goal" : isPlayer ? "runner-cell" : ""}>{isPlayer ? "🚲" : isGoal ? "🏠" : isBlock ? "🚧" : ""}</span>; })}</div><div className="mini-controls"><button onClick={() => move(0, -1)}>↑</button><button onClick={() => move(-1, 0)}>←</button><button onClick={() => move(0, 1)}>↓</button><button onClick={() => move(1, 0)}>→</button></div></div>
  </MiniFrame>;
}

function SequenceBuildGame({ job, onComplete }) {
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState(0);
  const done = step >= job.config.steps.length;
  return <MiniFrame job={job} progress={(step / job.config.steps.length) * 100} done={done} onComplete={onComplete} message={done ? "로봇이 켜졌어요!" : `순서대로 조립해요. 실수 ${wrong}번`}>
    <div className="sequence-build-zone"><div className="robot-preview">{job.config.steps.slice(0, step).map((part) => part.icon).join(" ") || "🔧"}</div><div className="part-tray">{job.config.steps.map((part, index) => <button key={part.id} className={index < step ? "filled" : ""} onClick={() => { if (index === step) setStep((value) => value + 1); else setWrong((value) => value + 1); }}>{part.icon}<small>{part.label}</small></button>)}</div></div>
  </MiniFrame>;
}


