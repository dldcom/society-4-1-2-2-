import { useCallback, useEffect, useMemo, useState } from "react";
import { getConsumptionsAtPlace, getJobsAtPlace } from "../data/alba.js";
import { getMiniAsset, getMiniAssetForPart, getMiniAssetForToken, getMiniAssetForWire } from "../data/minigameAssets.js";

export function ActivityOverlay({ place, progress, onClose, onCompleteJob, onBuyConsumption }) {
  const jobs = useMemo(() => getJobsAtPlace(place.id), [place.id]);
  const consumptions = useMemo(() => getConsumptionsAtPlace(place.id), [place.id]);
  const [activeJob, setActiveJob] = useState(null);
  const [mode, setMode] = useState("talk");
  const [message, setMessage] = useState("");
  const [dialogComplete, setDialogComplete] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(0);
  const npc = place.npc ?? { name: `${place.name} 주인`, role: "동네 주민", portrait: "🙂", greeting: "어서 와. 무슨 일로 들렀어?" };

  const askJob = useCallback(() => {
    setMode("jobs");
    setMessage(jobs.length ? npc.jobLine ?? "마침 부탁할 일이 하나 있어. 해 볼래?" : npc.noJobLine ?? "오늘은 맡길 일이 없네. 다른 가게도 한번 들러 봐.");
  }, [jobs.length, npc.jobLine, npc.noJobLine]);

  const askShop = useCallback(() => {
    setMode("shop");
    setMessage(consumptions.length ? npc.shopLine ?? "좋아. 천천히 둘러보고 마음에 드는 걸 골라 봐." : npc.noShopLine ?? "지금은 팔 만한 게 없어. 그래도 들러 줘서 고마워.");
  }, [consumptions.length, npc.noShopLine, npc.shopLine]);

  const choices = useMemo(() => [
    { label: "알바를 하고 싶어요", variant: "primary", action: askJob },
    { label: "물건을 사고 싶어요", variant: "secondary", action: askShop },
    { label: "아무 일도 아니에요", variant: "ghost", action: onClose }
  ], [askJob, askShop, onClose]);

  const runSelectedChoice = useCallback(() => {
    choices[selectedChoice]?.action();
  }, [choices, selectedChoice]);

  const buy = (item) => {
    const queued = onBuyConsumption(item);
    if (queued) onClose();
    else setMessage("앗, 코인이 조금 모자라. 알바를 하나 하고 다시 와 볼래?");
  };

  const line = message || npc.greeting || "어서 와. 무슨 일로 들렀어?";
  const dialogLines = useMemo(() => splitDialogLines(line), [line]);

  useEffect(() => {
    setDialogComplete(false);
    setSelectedChoice(0);
  }, [dialogLines]);

  useEffect(() => {
    if (mode !== "talk" || !dialogComplete) return undefined;
    const onKeyDown = (event) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Space"].includes(event.code)) return;
      event.preventDefault();
      if (event.code === "Enter" || event.code === "Space") {
        runSelectedChoice();
        return;
      }
      const dir = event.code === "ArrowUp" || event.code === "ArrowLeft" ? -1 : 1;
      setSelectedChoice((index) => (index + dir + choices.length) % choices.length);
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [choices.length, dialogComplete, mode, runSelectedChoice]);

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

  return (
    <div className="overlay npc-rpg-overlay">
      <div className="npc-rpg-layer">
        <button className="icon-button npc-close-button" onClick={onClose}>X</button>

        {mode === "talk" && dialogComplete && (
          <div className="npc-choice-panel npc-choice-compact">
            {place.id === "board" && <div className="board-note npc-board-note"><b>오늘의 목표</b><span>알바로 생산 활동을 경험하고, 번 코인으로 소비 활동도 해 봐요.</span></div>}
            {choices.map((choice, index) => (
              <button
                className={`${choice.variant} ${selectedChoice === index ? "selected" : ""}`}
                key={choice.label}
                onClick={choice.action}
                onMouseEnter={() => setSelectedChoice(index)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        )}

        {mode === "jobs" && dialogComplete && (
          <div className="npc-choice-panel npc-activity-panel">
            <ActivityList
              jobs={jobs}
              consumptions={[]}
              progress={progress}
              title="알바할 거리"
              onBack={() => setMode("talk")}
              onStartJob={setActiveJob}
              onBuy={buy}
            />
          </div>
        )}

        {mode === "shop" && dialogComplete && (
          <div className="npc-choice-panel npc-activity-panel">
            <ActivityList
              jobs={[]}
              consumptions={consumptions}
              progress={progress}
              title="살 수 있는 것"
              onBack={() => setMode("talk")}
              onStartJob={setActiveJob}
              onBuy={buy}
            />
          </div>
        )}

        <section className="npc-bottom-dialog" aria-label={`${npc.name} 대화`}>
          <div className="npc-portrait-card rpg-portrait">
            <span>{npc.portrait ?? place.icon ?? "🙂"}</span>
          </div>
          <div className="npc-dialog-text">
            <div className="npc-nameplate"><b>{npc.name}</b><span>{npc.role}</span></div>
            <TypewriterDialog lines={dialogLines} onCompleteChange={setDialogComplete} />
          </div>
        </section>
      </div>
    </div>
  );
}

function splitDialogLines(line) {
  if (Array.isArray(line)) return line.filter(Boolean);
  return String(line ?? "")
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function TypewriterDialog({ lines, onCompleteChange }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const currentLine = lines[lineIndex] ?? "";
  const isTyping = visibleCount < currentLine.length;

  useEffect(() => {
    setLineIndex(0);
    setVisibleCount(0);
    onCompleteChange?.(false);
  }, [lines, onCompleteChange]);

  useEffect(() => {
    onCompleteChange?.(!isTyping && lineIndex >= lines.length - 1);
  }, [isTyping, lineIndex, lines.length, onCompleteChange]);

  useEffect(() => {
    if (!currentLine || !isTyping) return undefined;
    const timer = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(currentLine.length, count + 1));
    }, 24);
    return () => window.clearTimeout(timer);
  }, [currentLine, isTyping, visibleCount]);

  const advance = () => {
    if (isTyping) {
      setVisibleCount(currentLine.length);
      return;
    }
    if (lineIndex < lines.length - 1) {
      setLineIndex((index) => index + 1);
      setVisibleCount(0);
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code !== "Space") return;
      const overlay = document.querySelector(".npc-rpg-overlay");
      if (!overlay) return;
      if (!isTyping && lineIndex >= lines.length - 1) return;
      event.preventDefault();
      advance();
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  });

  return (
    <p className="typewriter-line" onClick={advance}>
      {currentLine.slice(0, visibleCount)}
      {isTyping && <span className="typewriter-caret" aria-hidden="true">▌</span>}
    </p>
  );
}
function ActivityList({ jobs, consumptions, progress, title, onBack, onStartJob, onBuy }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const entries = useMemo(() => [
    { id: "back", type: "back", label: "돌아가기", action: onBack, disabled: false },
    ...jobs.map((job) => ({
      id: job.id,
      type: "job",
      job,
      disabled: progress.completedJobs.includes(job.id) || progress.energy < job.energyCost,
      action: () => onStartJob(job)
    })),
    ...consumptions.map((item) => ({
      id: item.id,
      type: "consumption",
      item,
      disabled: progress.completedConsumptions.includes(item.id) || progress.coins < item.costCoins,
      action: () => onBuy(item)
    }))
  ], [consumptions, jobs, onBack, onBuy, onStartJob, progress.coins, progress.completedConsumptions, progress.completedJobs, progress.energy]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [entries.length]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Space"].includes(event.code)) return;
      event.preventDefault();
      if (event.code === "Enter" || event.code === "Space") {
        const selected = entries[selectedIndex];
        if (selected && !selected.disabled) selected.action();
        return;
      }
      const dir = event.code === "ArrowUp" || event.code === "ArrowLeft" ? -1 : 1;
      setSelectedIndex((index) => (index + dir + entries.length) % entries.length);
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [entries, selectedIndex]);

  return <div className="activity-list">
    <div className="npc-panel-head">
      <b>{title}</b>
      <button
        className={`ghost ${selectedIndex === 0 ? "selected" : ""}`}
        onClick={onBack}
        onMouseEnter={() => setSelectedIndex(0)}
      >
        돌아가기
      </button>
    </div>
    {jobs.map((job) => {
      const done = progress.completedJobs.includes(job.id);
      const tired = progress.energy < job.energyCost;
      const entryIndex = entries.findIndex((entry) => entry.type === "job" && entry.id === job.id);
      return <article className={`activity-option production ${selectedIndex === entryIndex ? "selected" : ""}`} key={job.id} onMouseEnter={() => setSelectedIndex(entryIndex)}>
        <div className="activity-icon">{job.icon}</div>
        <div><p className="eyebrow">알바 · 생산 활동</p><h3>{job.title}</h3><p>{job.goal}</p><small>보상 {job.rewardCoins}코인 · 체력 -{job.energyCost}</small></div>
        <button className="primary" disabled={done || tired} onClick={() => onStartJob(job)}>{done ? "완료" : tired ? "체력 부족" : "알바 시작"}</button>
      </article>;
    })}
    {consumptions.map((item) => {
      const bought = progress.completedConsumptions.includes(item.id);
      const poor = progress.coins < item.costCoins;
      const entryIndex = entries.findIndex((entry) => entry.type === "consumption" && entry.id === item.id);
      return <article className={`activity-option consumption ${selectedIndex === entryIndex ? "selected" : ""}`} key={item.id} onMouseEnter={() => setSelectedIndex(entryIndex)}>
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

function MiniAssetIcon({ id, token, jobId, alt = "", className = "" }) {
  const assetId = id ?? getMiniAssetForToken(token, jobId);
  const source = assetId ? getMiniAsset(assetId) : null;
  if (!source) return <span className={className}>{token}</span>;
  return <img className={`mini-asset-icon ${className}`.trim()} src={source} alt={alt || assetId} draggable="false" />;
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
      <div className="order-card"><b>주문</b><span className="order-icons">{revealed || wrong || done ? order.map((token, index) => <MiniAssetIcon key={`${token}-${index}`} token={token} jobId={job.id} />) : "? ? ?"}</span><button className="secondary" onClick={() => setRevealed(true)}>잠깐 보기</button></div>
      <div className="pizza-canvas"><MiniAssetIcon token={job.config.base} jobId={job.id} className="base-item" /><i>{picked.map((token, index) => <MiniAssetIcon key={`${token}-${index}`} token={token} jobId={job.id} />)}</i></div>
      <div className="ingredient-tray">{job.config.choices.map((choice) => <button key={choice} onClick={() => choose(choice)}><MiniAssetIcon token={choice} jobId={job.id} /></button>)}<button onClick={() => setPicked([])}>초기화</button></div>
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
      {pets.map((pet) => <div className="pet-card" key={pet.id}><MiniAssetIcon token={pet.icon} className="pet-icon" /><b>{pet.name}</b><em>{scores[pet.id] >= pet.needs.length ? "만족" : currentNeed(pet)}</em><div className="tool-tray compact-tools">{job.config.tools.map((tool) => <button key={tool.id} onClick={() => useTool(tool, pet)}><MiniAssetIcon id={getMiniAssetForPart(tool)} /><small>{tool.label}</small></button>)}</div></div>)}
    </div>
  </MiniFrame>;
}

function WirePuzzleGame({ job, onComplete }) {
  const [activeColor, setActiveColor] = useState(null);
  const [paths, setPaths] = useState({});
  const [parts, setParts] = useState([]);
  const gridSize = job.config.gridSize ?? 5;
  const cellKey = (cell) => cell.join(",");
  const endpointByKey = useMemo(() => Object.fromEntries(job.config.wires.flatMap((wire) => [
    [cellKey(wire.start), { ...wire, kind: "start" }],
    [cellKey(wire.end), { ...wire, kind: "end" }]
  ])), [job.config.wires]);
  const completedColors = job.config.wires.filter((wire) => cellKey(paths[wire.color]?.at(-1) ?? []) === cellKey(wire.end)).map((wire) => wire.color);
  const occupied = useMemo(() => {
    const map = {};
    Object.entries(paths).forEach(([color, path]) => {
      path.forEach((cell) => { map[cellKey(cell)] = color; });
    });
    return map;
  }, [paths]);
  const totalSteps = job.config.wires.length + job.config.parts.length;
  const doneSteps = completedColors.length + parts.length;
  const done = doneSteps >= totalSteps;
  const getWire = (color) => job.config.wires.find((wire) => wire.color === color);
  const isAdjacent = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
  const resetWire = (color) => {
    setPaths((value) => {
      const next = { ...value };
      delete next[color];
      return next;
    });
    setActiveColor(color);
  };
  const chooseCell = (cell) => {
    const key = cellKey(cell);
    const endpoint = endpointByKey[key];
    if (endpoint?.kind === "start") {
      resetWire(endpoint.color);
      setPaths((value) => ({ ...value, [endpoint.color]: [endpoint.start] }));
      return;
    }
    if (!activeColor || completedColors.includes(activeColor)) return;
    const wire = getWire(activeColor);
    const path = paths[activeColor] ?? [wire.start];
    const last = path[path.length - 1];
    if (!isAdjacent(last, cell)) return;
    if (endpoint && endpoint.color !== activeColor) return;
    if (occupied[key] && occupied[key] !== activeColor) return;
    const previousIndex = path.findIndex((item) => cellKey(item) === key);
    if (previousIndex >= 0) {
      setPaths((value) => ({ ...value, [activeColor]: path.slice(0, previousIndex + 1) }));
      return;
    }
    const nextPath = [...path, cell];
    setPaths((value) => ({ ...value, [activeColor]: nextPath }));
    if (cellKey(cell) === cellKey(wire.end)) setActiveColor(null);
  };
  const clearBoard = () => {
    setActiveColor(null);
    setPaths({});
  };
  return <MiniFrame job={job} progress={(doneSteps / totalSteps) * 100} done={done} onComplete={onComplete} message={done ? "게임기가 다시 켜졌어요!" : "시작 단자를 누른 뒤 인접한 칸으로 전선을 이어요. 전선은 겹칠 수 없어요."}>
    <div className="repair-zone wire-zone">
      <div className="machine-face"><MiniAssetIcon id={done ? "arcade-fixed" : "arcade-broken"} /></div>
      <div className="wire-puzzle-head">
        <b>{completedColors.length}/{job.config.wires.length} 연결</b>
        <button className="secondary" onClick={clearBoard}>회로 초기화</button>
      </div>
      <div className="wire-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const cell = [index % gridSize, Math.floor(index / gridSize)];
          const key = cellKey(cell);
          const endpoint = endpointByKey[key];
          const color = endpoint?.color ?? occupied[key];
          const isActive = activeColor && color === activeColor;
          const isComplete = color && completedColors.includes(color);
          return <button
            key={key}
            className={`wire-cell ${color ?? ""} ${endpoint ? "terminal" : ""} ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
            onClick={() => chooseCell(cell)}
          >
            {color && <MiniAssetIcon id={getMiniAssetForWire(color)} />}
            {endpoint && <small>{endpoint.kind === "start" ? "S" : "E"}</small>}
          </button>;
        })}
      </div>
      <div className="part-tray">{job.config.parts.map((part) => <button key={part.id} className={parts.includes(part.id) ? "filled" : ""} onClick={() => setParts((value) => value.includes(part.id) ? value : [...value, part.id])}><MiniAssetIcon id={getMiniAssetForPart(part)} /><small>{part.label}</small></button>)}</div>
    </div>
  </MiniFrame>;
}

function RoleRhythmGame({ job, onComplete }) {
  const roles = job.config.roles;
  const beatMs = job.config.beatMs ?? 760;
  const travelMs = job.config.travelMs ?? 1800;
  const hitWindowMs = job.config.hitWindowMs ?? 260;
  const targetHits = job.config.targetHits ?? Math.ceil(job.config.notes.length * 0.72);
  const chart = useMemo(() => job.config.notes.map((token, index) => {
    const lane = roles.findIndex((role) => role.icon === token);
    const hitAt = 900 + index * beatMs;
    return { id: `${token}-${index}`, token, lane: Math.max(0, lane), spawnAt: hitAt - travelMs, hitAt };
  }), [beatMs, job.config.notes, roles, travelMs]);
  const [startedAt, setStartedAt] = useState(() => performance.now());
  const [elapsed, setElapsed] = useState(0);
  const [judgements, setJudgements] = useState({});
  const [score, setScore] = useState(0);
  const [miss, setMiss] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastJudge, setLastJudge] = useState("준비");
  const finished = elapsed > chart[chart.length - 1].hitAt + 700;
  const done = finished && score >= targetHits;
  const progress = Math.min(100, (score / targetHits) * 100);
  const reset = () => {
    setStartedAt(performance.now());
    setElapsed(0);
    setJudgements({});
    setScore(0);
    setMiss(0);
    setCombo(0);
    setLastJudge("준비");
  };
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setElapsed(performance.now() - startedAt);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [startedAt]);
  useEffect(() => {
    chart.forEach((note) => {
      if (judgements[note.id] || elapsed <= note.hitAt + hitWindowMs) return;
      setJudgements((value) => value[note.id] ? value : { ...value, [note.id]: "miss" });
      setMiss((value) => value + 1);
      setCombo(0);
      setLastJudge("Miss");
    });
  }, [chart, elapsed, hitWindowMs, judgements]);
  const hitLane = useCallback((lane) => {
    if (done || finished) return;
    const note = chart
      .filter((item) => item.lane === lane && !judgements[item.id])
      .map((item) => ({ ...item, diff: Math.abs(elapsed - item.hitAt) }))
      .filter((item) => item.diff <= hitWindowMs)
      .sort((a, b) => a.diff - b.diff)[0];
    if (!note) {
      setMiss((value) => value + 1);
      setCombo(0);
      setLastJudge("Too early");
      return;
    }
    const grade = note.diff < 90 ? "Perfect" : note.diff < 170 ? "Good" : "Ok";
    setJudgements((value) => ({ ...value, [note.id]: grade.toLowerCase() }));
    setScore((value) => value + 1);
    setCombo((value) => value + 1);
    setLastJudge(grade);
  }, [chart, done, elapsed, finished, hitWindowMs, judgements]);
  useEffect(() => {
    const onKeyDown = (event) => {
      const lane = roles.findIndex((role) => role.keys?.includes(event.code));
      if (lane < 0) return;
      event.preventDefault();
      hitLane(lane);
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [hitLane, roles]);
  const activeNotes = chart.filter((note) => elapsed >= note.spawnAt && elapsed <= note.hitAt + hitWindowMs && !judgements[note.id]);
  return <MiniFrame job={job} progress={progress} done={done} onComplete={onComplete} message={done ? "무대 준비 성공! 타이밍이 좋아요." : finished ? `성공 ${score}/${targetHits}. 조금 더 맞춰야 해요.` : `${targetHits}개 이상 맞춰요. 성공 ${score} · 실수 ${miss} · 콤보 ${combo}`}>
    <div className="rhythm-stage alba-rhythm role-rhythm rhythm-runner">
      <div className="rhythm-scoreboard"><b>{lastJudge}</b><span>{score}/{targetHits}</span></div>
      <div className="rhythm-lanes">
        {roles.map((role, lane) => <div className="rhythm-lane" key={role.icon}>
          {activeNotes.filter((note) => note.lane === lane).map((note) => {
            const y = Math.min(96, Math.max(0, ((elapsed - note.spawnAt) / travelMs) * 88));
            return <div className="falling-note" key={note.id} style={{ top: `${y}%` }}><MiniAssetIcon token={note.token} /></div>;
          })}
          <div className="rhythm-hit-line" />
        </div>)}
      </div>
      <div className="role-buttons">{roles.map((role, lane) => <button key={role.icon} onClick={() => hitLane(lane)}><MiniAssetIcon token={role.icon} /><small>{role.key} · {role.label}</small></button>)}</div>
      {finished && !done && <button className="secondary" onClick={reset}>다시 도전</button>}
    </div>
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
    <div className="photo-zone"><div className="photo-frame"><MiniAssetIcon id="photo-frame" className="photo-frame-prop" /><MiniAssetIcon token={pose} className="photo-subject" /></div><button className="primary" onClick={() => setShots((value) => [...value, good])}><MiniAssetIcon id="shutter-button" />찰칵!</button><div className="shot-strip">{shots.map((shot, i) => <i key={i}><MiniAssetIcon id={shot ? "smile-target" : "camera"} /></i>)}</div></div>
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
    <div className="delivery-zone"><div className="delivery-grid" style={{ gridTemplateColumns: `repeat(${job.config.cols}, 1fr)` }}>{Array.from({ length: job.config.cols * job.config.rows }).map((_, i) => { const cell = [i % job.config.cols, Math.floor(i / job.config.cols)]; const isBlock = blocks.has(key(cell)); const isGoal = key(cell) === key(job.config.goal); const isPlayer = key(cell) === key(pos); const iconId = isPlayer ? "delivery-bag" : isGoal ? "goal-flag" : isBlock ? "obstacle-cone" : null; return <span key={i} className={isBlock ? "block" : isGoal ? "goal" : isPlayer ? "runner-cell" : ""}>{iconId && <MiniAssetIcon id={iconId} />}</span>; })}</div><div className="mini-controls"><button onClick={() => move(0, -1)}>↑</button><button onClick={() => move(-1, 0)}>←</button><button onClick={() => move(0, 1)}>↓</button><button onClick={() => move(1, 0)}>→</button></div></div>
  </MiniFrame>;
}

function SequenceBuildGame({ job, onComplete }) {
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState(0);
  const done = step >= job.config.steps.length;
  return <MiniFrame job={job} progress={(step / job.config.steps.length) * 100} done={done} onComplete={onComplete} message={done ? "로봇이 켜졌어요!" : `순서대로 조립해요. 실수 ${wrong}번`}>
    <div className="sequence-build-zone"><div className="robot-preview">{job.config.steps.slice(0, step).map((part) => <MiniAssetIcon key={part.id} id={getMiniAssetForPart(part)} />)}{step === 0 && <MiniAssetIcon id="circuit-panel" />}</div><div className="part-tray">{job.config.steps.map((part, index) => <button key={part.id} className={index < step ? "filled" : ""} onClick={() => { if (index === step) setStep((value) => value + 1); else setWrong((value) => value + 1); }}><MiniAssetIcon id={getMiniAssetForPart(part)} /><small>{part.label}</small></button>)}</div></div>
  </MiniFrame>;
}



