import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jobs as allJobs, getConsumptionsAtPlace, getJobsAtPlace } from "../data/alba.js";
import { getMiniAsset, getMiniAssetForPart, getMiniAssetForToken, getMiniAssetForWire } from "../data/minigameAssets.js";
import npcSheetUrl from "../assets/characters/npc-town-spritesheet.png";
import npcSheet from "../assets/characters/npc-town-spritesheet.json";
import bakeryLabelUrl from "../assets/items/parcel-labels/split/bakery.png";
import schoolLabelUrl from "../assets/items/parcel-labels/split/school.png";
import stageLabelUrl from "../assets/items/parcel-labels/split/stage.png";
import storeLabelUrl from "../assets/items/parcel-labels/split/store.png";

const parcelLabelImages = {
  bakery: bakeryLabelUrl,
  school: schoolLabelUrl,
  stage: stageLabelUrl,
  store: storeLabelUrl
};

const boardJobAssets = {
  "pizza-job": "pizza-dough",
  "icecream-job": "icecream-cone",
  "pet-job": "pet-dog",
  "stage-job": "microphone",
  "delivery-job": "delivery-bag",
  "bread-job": "bread-box",
  "robot-job": "robot-head"
};

const boardJobDescriptions = {
  "pizza-job": "주문표를 보고 피자 토핑을 올려요.",
  "icecream-job": "손님 주문대로 아이스크림을 쌓아요.",
  "pet-job": "동물이 원하는 간식과 물건을 챙겨요.",
  "stage-job": "공연에 맞춰 조명과 마이크를 눌러요.",
  "delivery-job": "택배 상자를 맞는 곳으로 보내요.",
  "bread-job": "빵이 알맞게 구워졌을 때 꺼내요.",
  "robot-job": "로봇 부품을 알맞은 자리에 끼워요."
};

export function ActivityOverlay({ place, progress, onClose, onCompleteJob, onBuyConsumption }) {
  const jobs = useMemo(() => place.id === "board" ? allJobs : getJobsAtPlace(place.id), [place.id]);
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
    else setMessage("앗, 돈이 조금 모자라. 알바를 하나 하고 다시 와 볼래?");
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
    const immersive = ["conveyorSort", "roleRhythm", "pizzaCraft", "icecreamStack", "careGauge", "sequenceBuild", "breadBake"].includes(activeJob.engine);
    return (
      <div className="overlay">
        <div className={`modal game-modal ${immersive ? "immersive-game-modal" : ""}`}>
          {immersive ? (
            <button className="icon-button immersive-close-button" onClick={() => setActiveJob(null)}>X</button>
          ) : (
            <div className="game-head">
              <div>
                <p className="eyebrow">{npc.name}의 부탁</p>
                <h2>{activeJob.icon} {activeJob.title}</h2>
              </div>
              <button className="icon-button" onClick={() => setActiveJob(null)}>X</button>
            </div>
          )}
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

  if (place.id === "board") {
    return (
      <div className="overlay">
        <div className="modal board-job-modal">
          <div className="game-head">
            <div>
              <p className="eyebrow">알바 게시판</p>
              <h2>오늘 할 수 있는 알바</h2>
            </div>
            <button className="icon-button" onClick={onClose}>X</button>
          </div>
          <div className="board-job-body">
            <BoardJobList jobs={jobs} />
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
            {place.id === "board" && <div className="board-note npc-board-note"><b>오늘의 목표</b><span>생산 카드 5장과 소비 카드 2장을 모아 봐요.</span></div>}
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
            <NpcPortrait npc={npc} fallback={place.icon} talking={!dialogComplete} />
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

function NpcPortrait({ npc, fallback, talking }) {
  const frame = getNpcFrame(npc, talking);
  if (frame == null) return <span>{npc?.portrait ?? fallback ?? "🙂"}</span>;
  return (
    <div
      className="npc-sprite-portrait"
      aria-label={npc?.name ?? "NPC"}
      role="img"
      style={{
        "--npc-frame-w": `${npcSheet.frameWidth}px`,
        "--npc-frame-h": `${npcSheet.frameHeight}px`,
        "--npc-frame-x": `-${frame * npcSheet.frameWidth}px`,
        backgroundImage: `url(${npcSheetUrl})`
      }}
    />
  );
}

function getNpcFrame(npc, talking) {
  if (!Number.isFinite(npc?.sprite)) return null;
  const entry = npcSheet.frames?.find((item) => item.npc === npc.sprite);
  if (!entry) return null;
  return talking ? entry.talking : entry.idle;
}

function BoardJobList({ jobs }) {
  return (
    <div className="board-job-list">
      {jobs.map((job) => (
        <article className="board-job-row" key={job.id}>
          <div className="board-job-icon">
            <MiniAssetIcon id={boardJobAssets[job.id]} />
          </div>
          <div>
            <h3>{job.title}</h3>
            <p>{boardJobDescriptions[job.id] ?? job.goal}</p>
          </div>
        </article>
      ))}
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
      disabled: progress.completedJobs.includes(job.id),
      action: () => onStartJob(job)
    })),
    ...consumptions.map((item) => ({
      id: item.id,
      type: "consumption",
      item,
      disabled: progress.completedConsumptions.includes(item.id) || progress.coins < item.costCoins,
      action: () => onBuy(item)
    }))
  ], [consumptions, jobs, onBack, onBuy, onStartJob, progress.coins, progress.completedConsumptions, progress.completedJobs]);

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
      const entryIndex = entries.findIndex((entry) => entry.type === "job" && entry.id === job.id);
      return <article className={`activity-option production ${selectedIndex === entryIndex ? "selected" : ""}`} key={job.id} onMouseEnter={() => setSelectedIndex(entryIndex)}>
        <div className="activity-icon">{job.icon}</div>
        <div><p className="eyebrow">알바 · 생산 활동</p><h3>{job.title}</h3><p>{job.goal}</p><small>보상 {job.rewardCoins}원</small></div>
        <button className="primary" disabled={done} onClick={() => onStartJob(job)}>{done ? "완료" : "알바 시작"}</button>
      </article>;
    })}
    {consumptions.map((item) => {
      const bought = progress.completedConsumptions.includes(item.id);
      const poor = progress.coins < item.costCoins;
      const entryIndex = entries.findIndex((entry) => entry.type === "consumption" && entry.id === item.id);
      return <article className={`activity-option consumption ${selectedIndex === entryIndex ? "selected" : ""}`} key={item.id} onMouseEnter={() => setSelectedIndex(entryIndex)}>
        <div className="activity-icon">{item.icon}</div>
        <div><p className="eyebrow">소비 활동</p><h3>{item.title}</h3><p>{item.card.feedback}</p><small>{item.costCoins}원 사용</small></div>
        <button className="secondary" disabled={bought || poor} onClick={() => onBuy(item)}>{bought ? "완료" : poor ? "돈 부족" : "소비하기"}</button>
      </article>;
    })}
    {!jobs.length && !consumptions.length && <div className="board-note"><b>아직 준비 중</b><span>이 장소의 활동은 다음 버전에 추가할게요.</span></div>}
  </div>;
}function MiniGame({ job, onComplete }) {
  if (job.engine === "careGauge") return <CareGaugeGame job={job} onComplete={onComplete} />;
  if (job.engine === "pizzaCraft") return <PizzaCraftGame job={job} onComplete={onComplete} />;
  if (job.engine === "icecreamStack") return <IcecreamStackGame job={job} onComplete={onComplete} />;
  if (job.engine === "breadBake") return <BreadBakeGame job={job} onComplete={onComplete} />;
  if (job.engine === "wirePuzzle") return <WirePuzzleGame job={job} onComplete={onComplete} />;
  if (job.engine === "roleRhythm") return <RoleRhythmGame job={job} onComplete={onComplete} />;
  if (job.engine === "conveyorSort") return <ConveyorSortGame job={job} onComplete={onComplete} />;
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
  return <MiniFrame job={job} progress={(picked.length / order.length) * 100} done={done} onComplete={onComplete} message={wrong ? `실패! 힌트를 확인해보세요. 실수 ${mistakes}번` : revealed ? "주문 카드를 외워요. 곧 가려집니다." : "기억한 순서대로 골라요."}>
    <div className="order-game-zone">
      <div className="order-card"><b>주문</b><span className="order-icons">{revealed || wrong || done ? order.map((token, index) => <MiniAssetIcon key={`${token}-${index}`} token={token} jobId={job.id} />) : "? ? ?"}</span><button className="secondary" onClick={() => setRevealed(true)}>잠깐 보기</button></div>
      <div className="pizza-canvas"><MiniAssetIcon token={job.config.base} jobId={job.id} className="base-item" /><i>{picked.map((token, index) => <MiniAssetIcon key={`${token}-${index}`} token={token} jobId={job.id} />)}</i></div>
      <div className="ingredient-tray">{job.config.choices.map((choice) => <button key={choice} onClick={() => choose(choice)}><MiniAssetIcon token={choice} jobId={job.id} /></button>)}<button onClick={() => setPicked([])}>초기화</button></div>
    </div>
  </MiniFrame>;
}

function PizzaCraftGame({ job, onComplete }) {
  const makePizzaOrder = useCallback(() => {
    const choices = job.config.choices ?? [];
    if (choices.length < 4) return job.config.order ?? job.config.orders?.[0] ?? [];
    return [...choices]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [job.config.choices, job.config.order, job.config.orders]);
  const makePizzaOrders = useCallback(() => {
    if ((job.config.choices ?? []).length < 4) return job.config.orders ?? [job.config.order];
    return Array.from({ length: 3 }, makePizzaOrder);
  }, [job.config.choices, job.config.order, job.config.orders, makePizzaOrder]);
  const [orders, setOrders] = useState(() => job.config.orders ?? [job.config.order]);
  const [pizzaIndex, setPizzaIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const [picked, setPicked] = useState([]);
  const [completedPizzas, setCompletedPizzas] = useState(0);
  const [boardPhase, setBoardPhase] = useState("enter");
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const boardTimer = useRef(null);
  const order = orders[pizzaIndex] ?? orders[0];
  const done = completedPizzas >= orders.length;

  useEffect(() => {
    if (countdown === null) return undefined;
    if (countdown <= 0) {
      setCountdown(null);
      return undefined;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 760);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  useEffect(() => () => {
    if (boardTimer.current) window.clearTimeout(boardTimer.current);
  }, []);

  useEffect(() => {
    if (showGuide || countdown !== null || boardPhase !== "enter") return undefined;
    setBoardPhase("enter");
    const timer = window.setTimeout(() => setBoardPhase("idle"), 420);
    return () => window.clearTimeout(timer);
  }, [boardPhase, showGuide, countdown]);

  const retryCurrentPizza = () => {
    if (boardTimer.current) window.clearTimeout(boardTimer.current);
    setOrders((value) => value.map((item, index) => index === pizzaIndex ? makePizzaOrder() : item));
    setPicked([]);
    setBoardPhase("enter");
    setFeedback(null);
    setCountdown(3);
    setShowGuide(false);
  };

  const showHint = () => {
    if (showGuide || done || boardPhase === "exit") return;
    setFeedback({ id: `hint-${performance.now()}`, text: "힌트!", kind: "hit" });
    setCountdown(3);
  };

  const choose = (choice) => {
    if (showGuide || countdown !== null || done || boardPhase === "exit") return;
    const expected = order[picked.length];
    if (choice !== expected) {
      setMistakes((value) => value + 1);
      setPicked([]);
      setFeedback({ id: `wrong-${choice}-${performance.now()}`, text: "실패! 힌트를 확인해보세요", kind: "wrong" });
      return;
    }
    const nextPicked = [...picked, choice];
    if (nextPicked.length === order.length) {
      const nextPizzaIndex = pizzaIndex + 1;
      setPicked(nextPicked);
      setBoardPhase("exit");
      setFeedback({ id: `done-${choice}-${performance.now()}`, text: nextPizzaIndex >= orders.length ? "3판 완성!" : "피자 완성!", kind: "hit" });
      if (boardTimer.current) window.clearTimeout(boardTimer.current);
      boardTimer.current = window.setTimeout(() => {
        setCompletedPizzas(nextPizzaIndex);
        setPicked([]);
        if (nextPizzaIndex < orders.length) {
          setPizzaIndex(nextPizzaIndex);
          setBoardPhase("enter");
          setCountdown(3);
          setFeedback({ id: `next-${choice}-${performance.now()}`, text: "다음 주문!", kind: "hit" });
          boardTimer.current = window.setTimeout(() => setBoardPhase("idle"), 420);
        }
      }, 520);
      return;
    }
    setPicked(nextPicked);
    setFeedback({ id: `hit-${choice}-${performance.now()}`, text: "좋아!", kind: "hit" });
  };

  return <div className="phaser-like-minigame alba-minigame pizza-fullscreen-minigame">
    <div className="pizza-craft-zone">
      <div className="pizza-workbench">
        <div className="pizza-scoreboard"><b>피자 {completedPizzas}/{orders.length}</b><span>토핑 {picked.length}/{order.length}</span><span>실수 {mistakes}</span></div>
        {!showGuide && !done && countdown !== null && (
          <div className="pizza-live-order-card" key={`pizza-order-${pizzaIndex}`}>
            <b>주문 {pizzaIndex + 1}</b>
            <div>{order.map((token, index) => <MiniAssetIcon key={`${token}-${index}`} token={token} jobId={job.id} />)}</div>
          </div>
        )}
        {feedback && <div key={feedback.id} className={`sort-feedback-bubble ${feedback.kind}`}>{feedback.text}</div>}
        {showGuide && (
          <div className="sort-guide-dialog pizza-guide-dialog">
            <div className="guide-portrait">🍕</div>
            <div>
              <b>피자 토핑 방법</b>
              <p>주문표 순서를 기억하고, 피자 3판에 토핑 4개씩 차례대로 올려요.</p>
              <button
                className="primary"
                onClick={() => {
                  setOrders(job.config.orders ?? [job.config.order]);
                  setPicked([]);
                  setPizzaIndex(0);
                  setCompletedPizzas(0);
                  setBoardPhase("enter");
                  setFeedback(null);
                  setShowGuide(false);
                  setCountdown(3);
                }}
              >
                시작
              </button>
            </div>
          </div>
        )}
        {countdown !== null && <div key={`pizza-countdown-${countdown}`} className="sort-countdown">{countdown > 0 ? countdown : "START"}</div>}
        <div key={`pizza-board-${pizzaIndex}`} className={`pizza-board ${feedback?.kind === "wrong" ? "shake" : ""} ${boardPhase === "exit" ? "slide-out" : ""} ${boardPhase === "enter" ? "slide-in" : ""}`}>
          <MiniAssetIcon token={job.config.base} jobId={job.id} className="pizza-base-large" />
          <div className="pizza-topping-layer">
            {picked.map((token, index) => (
              <MiniAssetIcon
                key={`${token}-${index}`}
                token={token}
                jobId={job.id}
                className={`pizza-topping topping-${index}`}
              />
            ))}
          </div>
        </div>
        {done && <div className="sort-complete-panel"><b>피자 완성!</b><button className="primary" onClick={onComplete}>카드 받기</button></div>}
      </div>
      <div className="pizza-control-deck">
        <div className="pizza-ingredient-row">
          {job.config.choices.map((choice) => (
            <button key={choice} onClick={() => choose(choice)}>
              <MiniAssetIcon token={choice} jobId={job.id} />
            </button>
          ))}
        </div>
        <div className="pizza-action-row">
          <button className="secondary" onClick={showHint}>힌트</button>
          <button className="secondary" onClick={retryCurrentPizza}>다시</button>
        </div>
      </div>
    </div>
  </div>;
}

function IcecreamStackGame({ job, onComplete }) {
  const orders = job.config.orders;
  const [orderIndex, setOrderIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [picked, setPicked] = useState([]);
  const [completed, setCompleted] = useState(0);
  const [standPhase, setStandPhase] = useState("enter");
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const order = orders[orderIndex] ?? orders[0];
  const done = completed >= orders.length;

  useEffect(() => {
    if (countdown === null) return undefined;
    if (countdown <= 0) {
      setCountdown(null);
      return undefined;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 760);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const showHint = () => {
    if (done || standPhase === "exit") return;
    setFeedback({ id: `ice-hint-${performance.now()}`, text: "힌트!", kind: "hit" });
    setCountdown(3);
  };

  const retryCurrentOrder = () => {
    if (done || standPhase === "exit") return;
    setPicked([]);
    setStandPhase("enter");
    setFeedback({ id: `ice-retry-${performance.now()}`, text: "다시!", kind: "wrong" });
    setCountdown(3);
  };

  const choose = (choice) => {
    if (done || countdown !== null || standPhase === "exit") return;
    const expected = order[picked.length];
    if (choice !== expected) {
      setMistakes((value) => value + 1);
      setPicked([]);
      setFeedback({ id: `ice-wrong-${performance.now()}`, text: "실패! 힌트를 확인해보세요", kind: "wrong" });
      return;
    }
    const nextPicked = [...picked, choice];
    setPicked(nextPicked);
    if (nextPicked.length === order.length) {
      const nextCompleted = completed + 1;
      setStandPhase("exit");
      setFeedback({ id: `ice-done-${performance.now()}`, text: nextCompleted >= orders.length ? "완료!" : "손님 만족!", kind: "hit" });
      window.setTimeout(() => {
        setCompleted(nextCompleted);
        setPicked([]);
        if (nextCompleted < orders.length) {
          setOrderIndex((value) => value + 1);
          setStandPhase("enter");
          setCountdown(3);
        }
      }, 650);
      return;
    }
    setFeedback({ id: `ice-hit-${performance.now()}`, text: "좋아!", kind: "hit" });
  };

  return <div className="phaser-like-minigame alba-minigame icecream-stack-minigame">
    <div className="icecream-counter">
      <div className="icecream-scoreboard"><b>손님 {completed}/{orders.length}</b><span>실수 {mistakes}</span></div>
      {!done && countdown !== null && <div className="icecream-order-card">
        <b>주문 {orderIndex + 1}</b>
        <div>{order.map((token, index) => <MiniAssetIcon key={`${token}-${index}`} token={token} jobId={job.id} />)}</div>
      </div>}
      {countdown !== null && <div key={`ice-countdown-${countdown}`} className="sort-countdown">{countdown > 0 ? countdown : "START"}</div>}
      {feedback && <div key={feedback.id} className={`sort-feedback-bubble ${feedback.kind}`}>{feedback.text}</div>}
      <div key={`icecream-stand-${orderIndex}`} className={`icecream-build-stand ${standPhase === "exit" ? "slide-out" : ""} ${standPhase === "enter" ? "slide-in" : ""}`}>
        {picked.map((token, index) => (
          <MiniAssetIcon
            key={`${token}-${index}`}
            token={token}
            jobId={job.id}
            className={`icecream-stack-item icecream-layer-${index}`}
          />
        ))}
        {!picked.length && <MiniAssetIcon id="icecream-cone" className="icecream-ghost-base" />}
      </div>
      {!done && <div className="icecream-action-row">
        <button className="secondary" onClick={showHint}>힌트</button>
        <button className="secondary" onClick={retryCurrentOrder}>다시</button>
      </div>}
      {done && <div className="sort-complete-panel"><b>아이스크림 완성!</b><button className="primary" onClick={onComplete}>카드 받기</button></div>}
    </div>
    <div className="icecream-ingredient-row">
      {job.config.choices.map((choice) => (
        <button key={choice} onClick={() => choose(choice)}>
          <MiniAssetIcon token={choice} jobId={job.id} />
        </button>
      ))}
    </div>
  </div>;
}

function CareGaugeGame({ job, onComplete }) {
  const pets = job.config.pets;
  const tools = job.config.tools;
  const targetCare = job.config.targetCare ?? 10;
  const petSlots = useMemo(() => [
    { x: 26, y: 34 },
    { x: 72, y: 34 },
    { x: 26, y: 70 },
    { x: 72, y: 70 }
  ], []);
  const [needIndexes, setNeedIndexes] = useState(Object.fromEntries(pets.map((pet, index) => [pet.id, index % pet.needs.length])));
  const positions = useMemo(() => Object.fromEntries(pets.map((pet, index) => [
    pet.id,
    petSlots[index % petSlots.length]
  ])), [petSlots, pets]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [careCount, setCareCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const done = careCount >= targetCare;
  const currentNeed = (pet) => pet.needs[needIndexes[pet.id] % pet.needs.length];
  const toolById = useMemo(() => Object.fromEntries(tools.map((tool) => [tool.id, tool])), [tools]);

  const useTool = (toolId, pet) => {
    if (done) return;
    const tool = toolById[toolId];
    if (!tool) return;
    if (tool.id === currentNeed(pet)) {
      setCareCount((value) => value + 1);
      setNeedIndexes((value) => ({ ...value, [pet.id]: value[pet.id] + 1 }));
      setFeedback({ id: `pet-hit-${pet.id}-${performance.now()}`, text: `${pet.name} 만족!`, kind: "hit" });
    } else {
      setMistakes((value) => value + 1);
      setFeedback({ id: `pet-miss-${pet.id}-${performance.now()}`, text: "다른 걸 원해요", kind: "wrong" });
    }
    setSelectedTool(null);
  };

  return <div className="phaser-like-minigame alba-minigame pet-cafe-minigame">
    <div className="pet-cafe-stage">
      <div className="pet-cafe-scoreboard"><b>{careCount}/{targetCare}</b><span>실수 {mistakes}</span></div>
      {feedback && <div key={feedback.id} className={`sort-feedback-bubble ${feedback.kind}`}>{feedback.text}</div>}
      {pets.map((pet) => {
        const need = toolById[currentNeed(pet)];
        const position = positions[pet.id] ?? { x: 20, y: 20 };
        return <button
          key={pet.id}
          className="roaming-pet"
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
          onClick={() => selectedTool && useTool(selectedTool, pet)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            useTool(event.dataTransfer.getData("text/pet-tool"), pet);
          }}
        >
          <div className="pet-need-bubble">
            <MiniAssetIcon id={getMiniAssetForPart(need)} />
          </div>
          <MiniAssetIcon id={pet.asset} className="roaming-pet-sprite" />
          <small>{pet.name}</small>
        </button>;
      })}
      {done && <div className="sort-complete-panel"><b>펫카페 돌봄 완료!</b><button className="primary" onClick={onComplete}>카드 받기</button></div>}
    </div>
    <div className="pet-tool-dock">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={selectedTool === tool.id ? "selected" : ""}
          draggable
          onClick={() => setSelectedTool((value) => value === tool.id ? null : tool.id)}
          onDragStart={(event) => {
            event.dataTransfer.setData("text/pet-tool", tool.id);
            setSelectedTool(tool.id);
          }}
        >
          <MiniAssetIcon id={getMiniAssetForPart(tool)} />
          <small>{tool.label}</small>
        </button>
      ))}
    </div>
  </div>;
}

function createBakeSlots(ovens) {
  const now = performance.now();
  return ovens.map((oven, index) => ({
    ...oven,
    slot: index,
    startedAt: now - index * 420
  }));
}

const breadAssetIds = {
  croissant: {
    raw: "bread-croissant-raw",
    perfect: "bread-croissant-perfect",
    burnt: "bread-croissant-burnt"
  },
  bread: {
    raw: "bread-loaf-raw",
    perfect: "bread-loaf-perfect",
    burnt: "bread-loaf-burnt"
  },
  cookie: {
    raw: "bread-cookie-raw",
    perfect: "bread-cookie-perfect",
    burnt: "bread-cookie-burnt"
  }
};

function BreadBakeGame({ job, onComplete }) {
  const ovens = job.config.ovens ?? [];
  const targetBakes = job.config.targetBakes ?? 6;
  const [showGuide, setShowGuide] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const [ovenSlots, setOvenSlots] = useState(() => createBakeSlots(ovens));
  const [baked, setBaked] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [now, setNow] = useState(() => performance.now());
  const started = !showGuide && countdown === null;
  const done = baked >= targetBakes;

  useEffect(() => {
    if (!started || done) return undefined;
    const timer = window.setInterval(() => setNow(performance.now()), 120);
    return () => window.clearInterval(timer);
  }, [done, started]);

  useEffect(() => {
    if (countdown === null) return undefined;
    if (countdown <= 0) {
      setCountdown(null);
      setOvenSlots(createBakeSlots(ovens));
      return undefined;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 760);
    return () => window.clearTimeout(timer);
  }, [countdown, ovens]);

  const startGame = () => {
    setShowGuide(false);
    setCountdown(3);
    setBaked(0);
    setMistakes(0);
    setFeedback(null);
  };

  const resetSlot = (slotIndex) => {
    setOvenSlots((value) => value.map((slot, index) => index === slotIndex ? { ...slot, startedAt: performance.now() } : slot));
  };

  const pullBread = (slot, slotIndex) => {
    if (!started || done) return;
    const elapsed = now - slot.startedAt;
    const perfectStart = slot.bakeMs - slot.perfectWindowMs / 2;
    const perfectEnd = slot.bakeMs + slot.perfectWindowMs / 2;
    if (elapsed >= perfectStart && elapsed <= perfectEnd) {
      setBaked((value) => value + 1);
      setFeedback({ id: `bread-hit-${slot.id}-${performance.now()}`, text: "노릇!", kind: "hit" });
    } else {
      setMistakes((value) => value + 1);
      setFeedback({ id: `bread-miss-${slot.id}-${performance.now()}`, text: elapsed < perfectStart ? "아직 덜 익었어요" : "조금 탔어요", kind: "wrong" });
    }
    resetSlot(slotIndex);
  };

  return <div className="phaser-like-minigame alba-minigame bread-bake-minigame">
    <div className="bread-bakery-stage">
      <div className="bread-scoreboard"><b>{baked}/{targetBakes}</b><span>실수 {mistakes}</span></div>
      {feedback && <div key={feedback.id} className={`sort-feedback-bubble ${feedback.kind}`}>{feedback.text}</div>}
      {showGuide && (
        <div className="sort-guide-dialog bread-guide-dialog">
          <div className="guide-portrait">🥐</div>
          <div>
            <b>빵굽기 알바</b>
            <p>게이지가 초록색 구간에 들어오면 빵을 꺼내요. 빵마다 익는 시간이 달라서 빠르게 살펴봐야 해요.</p>
            <button className="primary" onClick={startGame}>시작</button>
          </div>
        </div>
      )}
      {countdown !== null && <div key={`bread-countdown-${countdown}`} className="sort-countdown">{countdown > 0 ? countdown : "START"}</div>}
      <div className="bread-oven-row">
        {ovenSlots.map((slot, index) => {
          const elapsed = started ? now - slot.startedAt : 0;
          const perfectStart = slot.bakeMs - slot.perfectWindowMs / 2;
          const perfectEnd = slot.bakeMs + slot.perfectWindowMs / 2;
          const meterEnd = perfectEnd + 1100;
          const progress = clamp((elapsed / meterEnd) * 100, 0, 100);
          const perfectLeft = clamp((perfectStart / meterEnd) * 100, 0, 100);
          const perfectWidth = clamp(((perfectEnd - perfectStart) / meterEnd) * 100, 0, 100);
          const status = elapsed < perfectStart ? "raw" : elapsed <= perfectEnd ? "perfect" : "burnt";
          return <button
            key={`${slot.id}-${index}`}
            className={`bread-oven ${status}`}
            onClick={() => pullBread(slot, index)}
            disabled={!started || done}
          >
            <span className="oven-heat" />
            <span className="bread-loaf">
              <MiniAssetIcon id={breadAssetIds[slot.id]?.[status] ?? "bread-loaf-perfect"} />
            </span>
            <b>{slot.label}</b>
            <span
              className="bake-meter"
              style={{ "--perfect-left": `${perfectLeft}%`, "--perfect-width": `${perfectWidth}%` }}
              aria-label={`${slot.label} 굽기 진행도`}
            >
              <span className="bake-target" />
              <i style={{ width: `${progress}%` }} />
            </span>
            <small>{status === "raw" ? "기다리기" : status === "perfect" ? "꺼내기!" : "탐"}</small>
          </button>;
        })}
      </div>
      <div className="bread-counter-tray">
        {Array.from({ length: targetBakes }).map((_, index) => <span key={index} className={index < baked ? "filled" : ""}>{index < baked ? <MiniAssetIcon id="bread-croissant-perfect" /> : ""}</span>)}
      </div>
      {done && <div className="sort-complete-panel bread-complete-panel">
        <MiniAssetIcon id="bread-box" />
        <b>갓 구운 빵 완성!</b>
        <button className="primary" onClick={onComplete}>카드 받기</button>
      </div>}
    </div>
  </div>;
}

const circuitDirections = ["N", "E", "S", "W"];
const circuitOpposite = { N: "S", E: "W", S: "N", W: "E" };
const circuitDelta = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
const circuitBaseSides = {
  line: ["N", "S"],
  corner: ["N", "E"],
  tee: ["N", "E", "S"],
  cross: ["N", "E", "S", "W"]
};

function circuitCellKey(cell) {
  return cell.join(",");
}

function rotateCircuitSides(type, rotation) {
  const base = circuitBaseSides[type] ?? circuitBaseSides.line;
  return base.map((side) => circuitDirections[(circuitDirections.indexOf(side) + rotation) % circuitDirections.length]);
}

function analyzeCircuit(job, rotations) {
  const { cols, rows, start, goal, tiles } = job.config;
  const startKey = circuitCellKey(start);
  const goalKey = circuitCellKey(goal);
  const queue = [start];
  const powered = new Set();

  const getSides = (x, y) => {
    const index = y * cols + x;
    const tile = tiles[index];
    if (!tile) return [];
    return rotateCircuitSides(tile.type, rotations[index] ?? tile.rot ?? 0);
  };

  if (!getSides(start[0], start[1]).includes("W")) {
    return { powered, connected: false };
  }

  powered.add(startKey);
  while (queue.length) {
    const [x, y] = queue.shift();
    const sides = getSides(x, y);
    for (const side of sides) {
      const [dx, dy] = circuitDelta[side];
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const nextSides = getSides(nx, ny);
      if (!nextSides.includes(circuitOpposite[side])) continue;
      const key = circuitCellKey([nx, ny]);
      if (powered.has(key)) continue;
      powered.add(key);
      queue.push([nx, ny]);
    }
  }

  const goalSides = getSides(goal[0], goal[1]);
  return { powered, connected: powered.has(goalKey) && goalSides.includes("E") };
}

function ArcadeCircuitGame({ job, onComplete }) {
  const { cols, rows, tiles, parMoves } = job.config;
  const [rotations, setRotations] = useState(() => tiles.map((tile) => tile.rot ?? 0));
  const [moves, setMoves] = useState(0);
  const [pulse, setPulse] = useState("");
  const result = useMemo(() => analyzeCircuit(job, rotations), [job, rotations]);
  const done = result.connected;
  const progress = done ? 100 : Math.min(92, Math.round((result.powered.size / tiles.length) * 120));

  useEffect(() => {
    if (!done) return undefined;
    setPulse("전원이 들어왔어요!");
    const timer = window.setTimeout(() => setPulse(""), 1300);
    return () => window.clearTimeout(timer);
  }, [done]);

  const rotateTile = (index) => {
    if (done) return;
    setRotations((value) => value.map((rotation, tileIndex) => tileIndex === index ? (rotation + 1) % 4 : rotation));
    setMoves((value) => value + 1);
  };

  const resetPuzzle = () => {
    setRotations(tiles.map((tile) => tile.rot ?? 0));
    setMoves(0);
    setPulse("");
  };

  return <div className="arcade-circuit-minigame">
    <div className="arcade-circuit-shell">
      <div className="arcade-circuit-top">
        <div className="arcade-machine-bay">
          <MiniAssetIcon id={done ? "arcade-fixed" : "arcade-broken"} />
        </div>
        <div className="arcade-circuit-meter">
          <span>MOVE</span>
          <b>{moves}</b>
          <small>기준 {parMoves}</small>
        </div>
        <div className="arcade-machine-bay arcade-control-bay">
          <MiniAssetIcon id={done ? "button-red" : "arcade-lever"} />
        </div>
      </div>

      <div className="arcade-circuit-board">
        <div className="circuit-port circuit-port-left"><MiniAssetIcon id="battery" /></div>
        <div className="circuit-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
          {tiles.map((tile, index) => {
            const x = index % cols;
            const y = Math.floor(index / cols);
            const key = circuitCellKey([x, y]);
            const sides = rotateCircuitSides(tile.type, rotations[index]);
            const powered = result.powered.has(key);
            return <button
              key={key}
              className={`circuit-tile ${powered ? "powered" : ""} ${done ? "solved" : ""}`}
              onClick={() => rotateTile(index)}
              aria-label={`회로 ${x + 1}, ${y + 1}`}
            >
              {sides.map((side) => <span key={side} className={`circuit-wire ${side}`} />)}
              <span className="circuit-core" />
            </button>;
          })}
        </div>
        <div className="circuit-port circuit-port-right"><MiniAssetIcon id={done ? "arcade-fixed" : "circuit-panel"} /></div>
      </div>

      <div className="arcade-circuit-controls">
        <button className="secondary" onClick={resetPuzzle}>다시</button>
        <div className="arcade-circuit-progress"><span style={{ width: `${progress}%` }} /></div>
      </div>

      {pulse && <div className="arcade-speech-bubble">{pulse}</div>}
      {done && <div className="arcade-complete-panel">
        <MiniAssetIcon id="arcade-fixed" />
        <b>오락기 수리 완료!</b>
        <button className="primary" onClick={onComplete}>카드 받기</button>
      </div>}
    </div>
  </div>;
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
  const [showGuide, setShowGuide] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const [startedAt, setStartedAt] = useState(() => performance.now());
  const [elapsed, setElapsed] = useState(0);
  const [judgements, setJudgements] = useState({});
  const [score, setScore] = useState(0);
  const [miss, setMiss] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const finished = elapsed > chart[chart.length - 1].hitAt + 700;
  const done = finished && score >= targetHits;
  const reset = () => {
    setStartedAt(performance.now());
    setElapsed(0);
    setJudgements({});
    setScore(0);
    setMiss(0);
    setCombo(0);
    setFeedback(null);
    setShowGuide(false);
    setCountdown(3);
  };
  useEffect(() => {
    if (showGuide || countdown !== null) return undefined;
    let frame = 0;
    const tick = () => {
      setElapsed(performance.now() - startedAt);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [countdown, showGuide, startedAt]);
  useEffect(() => {
    if (countdown === null) return undefined;
    if (countdown <= 0) {
      setStartedAt(performance.now());
      setElapsed(0);
      setCountdown(null);
      return undefined;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 760);
    return () => window.clearTimeout(timer);
  }, [countdown]);
  useEffect(() => {
    chart.forEach((note) => {
      if (showGuide || countdown !== null) return;
      if (judgements[note.id] || elapsed <= note.hitAt + hitWindowMs) return;
      setJudgements((value) => value[note.id] ? value : { ...value, [note.id]: "miss" });
      setMiss((value) => value + 1);
      setCombo(0);
      setFeedback({ id: `${note.id}-miss`, text: "Miss", kind: "miss" });
    });
  }, [chart, countdown, elapsed, hitWindowMs, judgements, showGuide]);
  const hitLane = useCallback((lane) => {
    if (showGuide || countdown !== null) return;
    if (done || finished) return;
    const note = chart
      .filter((item) => item.lane === lane && !judgements[item.id])
      .map((item) => ({ ...item, diff: Math.abs(elapsed - item.hitAt) }))
      .filter((item) => item.diff <= hitWindowMs)
      .sort((a, b) => a.diff - b.diff)[0];
    if (!note) {
      setMiss((value) => value + 1);
      setCombo(0);
      setFeedback({ id: `early-${elapsed}`, text: "Too early", kind: "miss" });
      return;
    }
    const grade = note.diff < 90 ? "Perfect" : note.diff < 170 ? "Good" : "Ok";
    setJudgements((value) => ({ ...value, [note.id]: grade.toLowerCase() }));
    setScore((value) => value + 1);
    setCombo((value) => value + 1);
    setFeedback({ id: `${note.id}-${grade}`, text: grade, kind: "hit" });
  }, [chart, countdown, done, elapsed, finished, hitWindowMs, judgements, showGuide]);
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
  return <div className="phaser-like-minigame alba-minigame rhythm-fullscreen-minigame">
    <div className="stage-rhythm-zone">
      <div className="stage-rhythm-arena">
        <div className="rhythm-scoreboard stage-scoreboard"><b>{score}/{targetHits}</b><span>Combo {combo}</span><small>Miss {miss}</small></div>
        {feedback && <div key={feedback.id} className={`sort-feedback-bubble ${feedback.kind}`}>{feedback.text}</div>}
        {showGuide && (
          <div className="sort-guide-dialog rhythm-guide-dialog">
            <div className="guide-portrait">🎤</div>
            <div>
              <b>공연 준비 방법</b>
              <p>노트가 아래 노란 판정선에 닿는 순간, 같은 역할 버튼이나 키를 눌러 무대 타이밍을 맞춰요.</p>
              <button
                className="primary"
                onClick={() => {
                  setElapsed(0);
                  setShowGuide(false);
                  setCountdown(3);
                }}
              >
                시작
              </button>
            </div>
          </div>
        )}
        {countdown !== null && <div key={`rhythm-countdown-${countdown}`} className="sort-countdown">{countdown > 0 ? countdown : "START"}</div>}
        <div className="stage-lights"><i /><i /><i /></div>
        <div className="rhythm-lanes stage-rhythm-lanes">
          {roles.map((role, lane) => <div className="rhythm-lane stage-rhythm-lane" key={role.icon}>
            {activeNotes.filter((note) => note.lane === lane).map((note) => {
              const y = Math.min(96, Math.max(0, ((elapsed - note.spawnAt) / travelMs) * 76));
              return <div className="falling-note stage-note" key={note.id} style={{ top: `${y}%` }}><MiniAssetIcon token={note.token} /></div>;
            })}
            <div className="rhythm-hit-line" />
          </div>)}
        </div>
        {done && <div className="sort-complete-panel"><b>공연 준비 완료!</b><button className="primary" onClick={onComplete}>카드 받기</button></div>}
      </div>
      <div className="role-buttons stage-role-buttons">{roles.map((role, lane) => <button key={role.icon} onClick={() => hitLane(lane)}><MiniAssetIcon token={role.icon} /><small>{role.key} · {role.label}</small></button>)}</div>
      {finished && !done && <button className="secondary" onClick={reset}>다시 도전</button>}
    </div>
  </div>;
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

function ConveyorSortGame({ job, onComplete }) {
  const lanes = job.config.lanes;
  const beatMs = job.config.beatMs ?? 1100;
  const travelMs = job.config.travelMs ?? 1800;
  const hitWindowMs = job.config.hitWindowMs ?? 270;
  const targetHits = job.config.targetHits ?? Math.ceil(job.config.parcels.length * 0.7);
  const chart = useMemo(() => job.config.parcels.map((laneId, index) => {
    const lane = Math.max(0, lanes.findIndex((item) => item.id === laneId));
    const hitAt = 900 + index * beatMs;
    return { id: `${laneId}-${index}`, lane, spawnAt: hitAt - travelMs, hitAt };
  }), [beatMs, job.config.parcels, lanes, travelMs]);
  const [showGuide, setShowGuide] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const [startedAt, setStartedAt] = useState(() => performance.now());
  const [elapsed, setElapsed] = useState(0);
  const [judgements, setJudgements] = useState({});
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const finished = elapsed > chart[chart.length - 1].hitAt + 760;
  const done = finished && hits >= targetHits;
  const reset = () => {
    setStartedAt(performance.now());
    setElapsed(0);
    setJudgements({});
    setHits(0);
    setMisses(0);
    setCombo(0);
    setFeedback(null);
    setCountdown(3);
    setShowGuide(false);
  };

  useEffect(() => {
    if (showGuide || countdown !== null) return undefined;
    let frame = 0;
    const tick = () => {
      setElapsed(performance.now() - startedAt);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [countdown, showGuide, startedAt]);

  useEffect(() => {
    if (countdown === null) return undefined;
    if (countdown <= 0) {
      setStartedAt(performance.now());
      setElapsed(0);
      setCountdown(null);
      return undefined;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 760);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    chart.forEach((parcel) => {
      if (judgements[parcel.id] || elapsed <= parcel.hitAt + hitWindowMs) return;
      setJudgements((value) => value[parcel.id] ? value : { ...value, [parcel.id]: "miss" });
      setMisses((value) => value + 1);
      setCombo(0);
      setFeedback({ id: `${parcel.id}-miss`, text: "Miss", kind: "miss" });
    });
  }, [chart, elapsed, hitWindowMs, judgements]);

  const hitLane = useCallback((lane) => {
    if (showGuide || countdown !== null) return;
    if (done || finished) return;
    const parcel = chart
      .filter((item) => !judgements[item.id])
      .map((item) => ({ ...item, diff: Math.abs(elapsed - item.hitAt) }))
      .filter((item) => item.diff <= hitWindowMs)
      .sort((a, b) => a.diff - b.diff)[0];
    if (!parcel) {
      setMisses((value) => value + 1);
      setCombo(0);
      setFeedback({ id: `early-${elapsed}`, text: "Too early", kind: "miss" });
      return;
    }
    if (parcel.lane !== lane) {
      setJudgements((value) => ({ ...value, [parcel.id]: "wrong" }));
      setMisses((value) => value + 1);
      setCombo(0);
      setFeedback({ id: `${parcel.id}-wrong`, text: "Wrong", kind: "wrong" });
      return;
    }
    const grade = parcel.diff < 90 ? "Perfect" : parcel.diff < 180 ? "Good" : "Ok";
    setJudgements((value) => ({ ...value, [parcel.id]: grade.toLowerCase() }));
    setHits((value) => value + 1);
    setCombo((value) => value + 1);
    setFeedback({ id: `${parcel.id}-${grade}`, text: grade, kind: "hit" });
  }, [chart, countdown, done, elapsed, finished, hitWindowMs, judgements, showGuide]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const lane = lanes.findIndex((item) => item.keys?.includes(event.code));
      if (lane < 0) return;
      event.preventDefault();
      hitLane(lane);
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [hitLane, lanes]);

  const activeParcels = chart.filter((parcel) => (
    elapsed >= parcel.spawnAt &&
    elapsed <= parcel.hitAt + hitWindowMs &&
    !judgements[parcel.id]
  ));

  return <div className="phaser-like-minigame alba-minigame conveyor-fullscreen-minigame">
    <div className="conveyor-sort-zone">
      <div className="conveyor-arena">
        <div className="conveyor-scoreboard">
          <b>{hits}/{targetHits}</b>
          <span>Combo {combo}</span>
          <small>Miss {misses}</small>
        </div>
        {feedback && <div key={feedback.id} className={`sort-feedback-bubble ${feedback.kind}`}>{feedback.text}</div>}
        {showGuide && (
          <div className="sort-guide-dialog">
            <div className="guide-portrait">📦</div>
            <div>
              <b>택배 분류 방법</b>
              <p>상자 위 목적지 표지를 보고, 상자가 노란 분기점에 닿는 순간 아래 버튼이나 방향키를 눌러요.</p>
              <button
                className="primary"
                onClick={() => {
                  setElapsed(0);
                  setShowGuide(false);
                  setCountdown(3);
                }}
              >
                시작
              </button>
            </div>
          </div>
        )}
        {countdown !== null && <div key={`countdown-${countdown}`} className="sort-countdown">{countdown > 0 ? countdown : "START"}</div>}
        <div className="lane-button-row">
          {lanes.map((lane, index) => (
            <button
              key={lane.id}
              className={`lane-hit-button ${lane.direction}`}
              onClick={() => hitLane(index)}
            >
              <b>{lane.key}</b>
              <img src={parcelLabelImages[lane.id]} alt="" draggable="false" />
              <small>{lane.label}</small>
            </button>
          ))}
        </div>
        <div className="conveyor-belt">
          {activeParcels.map((parcel) => {
            const lane = lanes[parcel.lane];
            const travel = clamp((elapsed - parcel.spawnAt) / travelMs, 0, 1);
            const left = 8 + travel * 42;
            const urgent = parcel.hitAt - elapsed < 420;
            return <div className={`parcel-box ${urgent ? "urgent" : ""}`} key={parcel.id} style={{ left: `${left}%` }}>
              <MiniAssetIcon id="delivery-bag" />
              <img className="parcel-destination-label" src={parcelLabelImages[lane.id]} alt={lane.label} draggable="false" />
            </div>;
          })}
          <div className="sort-gate"><span>분기점</span></div>
        </div>
        {done && <div className="sort-complete-panel"><b>분류 완료!</b><button className="primary" onClick={onComplete}>카드 받기</button></div>}
      </div>
      {finished && !done && <button className="secondary" onClick={reset}>다시 도전</button>}
    </div>
  </div>;
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
  const slots = job.config.slots;
  const parts = job.config.parts;
  const prefilledPlaced = useMemo(() => Object.fromEntries((job.config.prefilled ?? []).map((id) => [id, id])), [job.config.prefilled]);
  const [placed, setPlaced] = useState(prefilledPlaced);
  const [selectedPart, setSelectedPart] = useState(null);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const done = slots.every((slot) => placed[slot.id] === slot.id);
  const progress = Math.round((Object.keys(placed).length / slots.length) * 100);

  const placePart = (partId, slotId) => {
    if (done || placed[slotId]) return;
    if (partId === slotId) {
      setPlaced((value) => ({ ...value, [slotId]: partId }));
      setFeedback({ id: `robot-hit-${slotId}-${performance.now()}`, text: "장착!", kind: "hit" });
    } else {
      setWrong((value) => value + 1);
      setFeedback({ id: `robot-miss-${slotId}-${performance.now()}`, text: "위치가 달라요", kind: "wrong" });
    }
    setSelectedPart(null);
  };

  return <div className="phaser-like-minigame alba-minigame robot-assembly-minigame">
    <div className="robot-workbench">
      <div className="robot-scoreboard"><b>{progress}%</b><span>실수 {wrong}</span></div>
      {feedback && <div key={feedback.id} className={`sort-feedback-bubble ${feedback.kind}`}>{feedback.text}</div>}
      <div className={`robot-assembly-board ${done ? "complete" : ""}`}>
        <div className="robot-silhouette" />
        {slots.map((slot) => {
          const placedPart = parts.find((part) => part.id === placed[slot.id]);
          return <button
            key={slot.id}
            className={`robot-slot ${slot.id} ${placedPart ? "filled" : ""}`}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            onClick={() => selectedPart && placePart(selectedPart, slot.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              placePart(event.dataTransfer.getData("text/robot-part"), slot.id);
            }}
          >
            {placedPart ? <MiniAssetIcon id={getMiniAssetForPart(placedPart)} /> : <span>{slot.label}</span>}
          </button>;
        })}
        {done && <MiniAssetIcon id="spark-plug" className="robot-spark" />}
      </div>
      {done && <div className="sort-complete-panel"><b>로봇 조립 완료!</b><button className="primary" onClick={onComplete}>카드 받기</button></div>}
    </div>
    <div className="robot-part-dock">
      {parts.map((part) => {
        const used = Object.values(placed).includes(part.id);
        const prefilled = (job.config.prefilled ?? []).includes(part.id);
        return <button
          key={part.id}
          className={`${selectedPart === part.id ? "selected" : ""} ${used ? "used" : ""} ${prefilled ? "prefilled" : ""}`}
          disabled={used}
          draggable={!used}
          onClick={() => !used && setSelectedPart((value) => value === part.id ? null : part.id)}
          onDragStart={(event) => {
            event.dataTransfer.setData("text/robot-part", part.id);
            setSelectedPart(part.id);
          }}
        >
          <MiniAssetIcon id={getMiniAssetForPart(part)} />
          <small>{part.label}</small>
        </button>;
      })}
    </div>
  </div>;
}




