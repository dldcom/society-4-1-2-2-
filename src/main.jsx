import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { consumptions, jobs, playerCharacter, playerCharacters, uniqueCards } from "./data/alba.js";
import { GamePage } from "./react/GamePage.jsx";
import { StartScreen } from "./react/StartScreen.jsx";
import { CharacterSelect } from "./react/CharacterSelect.jsx";
import { QuizScreen } from "./react/QuizScreen.jsx";
import { ResultScreen } from "./react/ResultScreen.jsx";

const initialProgress = {
  coins: 0,
  mood: 0,
  completedJobs: [],
  completedConsumptions: [],
  ownedItems: [],
  stickers: [],
  cards: []
};

function App() {
  const [screen, setScreen] = useState("start");
  const [progress, setProgress] = useState(initialProgress);
  const [selectedCharacter, setSelectedCharacter] = useState(playerCharacter);
  const [pendingActivity, setPendingActivity] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const activeNotification = notifications[0] ?? null;

  const productionCardCount = progress.cards.filter((card) => card.type === "production").length;
  const consumptionCardCount = progress.cards.filter((card) => card.type === "consumption").length;
  const canFinish = productionCardCount >= 5 && consumptionCardCount >= 2;

  const resetDay = (character = selectedCharacter) => {
    setSelectedCharacter(character);
    setProgress(initialProgress);
    setPendingActivity(null);
    setNotifications([]);
    setScreen("game");
  };

  const notify = (notification) => {
    setNotifications((queue) => [...queue, { id: `${Date.now()}-${Math.random()}`, ...notification }]);
  };

  const closeNotification = () => {
    setNotifications((queue) => queue.slice(1));
  };

  const queueJobReward = (job) => {
    setPendingActivity({ kind: "job", activity: job });
  };

  const queueConsumptionReward = (item) => {
    if (progress.coins < item.costCoins) {
      notify({ title: "돈이 부족해요", message: "알바를 먼저 해서 돈을 벌어 볼까요?", icon: "💸" });
      return false;
    }
    setPendingActivity({ kind: "consumption", activity: item });
    return true;
  };

  const applyPendingActivity = () => {
    if (!pendingActivity) return;
    const { kind, activity } = pendingActivity;
    if (kind === "job") {
      const alreadyCompleted = progress.completedJobs.includes(activity.id);
      const alreadyHasCard = progress.cards.some((card) => card.id === activity.card.id);
      setProgress((prev) => ({
        ...prev,
        coins: prev.coins + activity.rewardCoins,
        completedJobs: prev.completedJobs.includes(activity.id) ? prev.completedJobs : [...prev.completedJobs, activity.id],
        cards: uniqueCards([...prev.cards, activity.card])
      }));
      if (!alreadyCompleted) notify({ title: "돈을 얻었어요", message: `${activity.rewardCoins}원을 받았어요.`, icon: "💰" });
      if (!alreadyHasCard) notify({ title: "카드를 얻었어요", message: `${activity.card.title} 카드를 얻었어요.`, icon: activity.card.badge });
    } else {
      const alreadyCompleted = progress.completedConsumptions.includes(activity.id);
      const alreadyHasCard = progress.cards.some((card) => card.id === activity.card.id);
      setProgress((prev) => ({
        ...prev,
        coins: prev.coins - activity.costCoins,
        mood: prev.mood + (activity.moodGain ?? 0),
        completedConsumptions: prev.completedConsumptions.includes(activity.id)
          ? prev.completedConsumptions
          : [...prev.completedConsumptions, activity.id],
        ownedItems: activity.equip && !prev.ownedItems.includes(activity.equip)
          ? [...prev.ownedItems, activity.equip]
          : prev.ownedItems,
        stickers: activity.resultSticker && !prev.stickers.includes(activity.resultSticker)
          ? [...prev.stickers, activity.resultSticker]
          : prev.stickers,
        cards: uniqueCards([...prev.cards, activity.card])
      }));
      if (!alreadyCompleted) notify({ title: "돈을 사용했어요", message: `${activity.costCoins}원을 사용했어요.`, icon: "🧾" });
      if (!alreadyHasCard) notify({ title: "카드를 얻었어요", message: `${activity.card.title} 카드를 얻었어요.`, icon: activity.card.badge });
    }
    setPendingActivity(null);
  };

  const jobMap = useMemo(() => Object.fromEntries(jobs.map((job) => [job.id, job])), []);
  const consumptionMap = useMemo(() => Object.fromEntries(consumptions.map((item) => [item.id, item])), []);

  return (
    <>
      {screen === "start" && <StartScreen onStart={() => setScreen("character")} />}
      {screen === "character" && (
        <CharacterSelect
          characters={playerCharacters}
          onBack={() => setScreen("start")}
          onPick={(characterId) => resetDay(playerCharacters.find((character) => character.id === characterId) ?? playerCharacter)}
        />
      )}
      {screen === "game" && (
        <GamePage
          playerCharacter={selectedCharacter}
          progress={progress}
          canFinish={canFinish}
          inputLocked={Boolean(pendingActivity) || Boolean(activeNotification)}
          jobMap={jobMap}
          consumptionMap={consumptionMap}
          onCompleteJob={queueJobReward}
          onBuyConsumption={queueConsumptionReward}
          onNotify={notify}
          onQuiz={() => setScreen("quiz")}
          onRestart={() => setScreen("start")}
        />
      )}
      {screen === "quiz" && (
        <QuizScreen
          cards={progress.cards}
          onBack={() => setScreen("game")}
          onComplete={() => setScreen("result")}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          character={selectedCharacter}
          progress={progress}
          jobMap={jobMap}
          consumptionMap={consumptionMap}
          onRestart={resetDay}
        />
      )}
      {pendingActivity && (
        <ConceptQuizOverlay
          entry={pendingActivity}
          onCancel={() => setPendingActivity(null)}
          onComplete={applyPendingActivity}
        />
      )}
      {activeNotification && <GameNotification notification={activeNotification} onClose={closeNotification} />}
    </>
  );
}

function GameNotification({ notification, onClose }) {
  return (
    <div className="reward-notification-overlay" role="dialog" aria-modal="true" aria-label={notification.title}>
      <section className="reward-notification-panel">
        <div className="reward-notification-icon">{notification.icon ?? "!"}</div>
        <div>
          <p className="eyebrow">{notification.kicker ?? "알림"}</p>
          <h2>{notification.title}</h2>
          <p>{notification.message}</p>
        </div>
        <button className="primary" onClick={onClose}>확인</button>
      </section>
    </div>
  );
}

function ConceptQuizOverlay({ entry, onCancel, onComplete }) {
  const [choice, setChoice] = useState(null);
  const [answered, setAnswered] = useState(false);
  const activity = entry.activity;
  const expected = activity.card.type;
  const actionText = activity.quiz?.action ?? activity.card.title;
  const intro = activity.quiz?.intro ?? `${actionText}${objectParticle(actionText)} 했습니다.`;
  const hint = activity.quiz?.hint ?? (expected === "production"
    ? "힌트: 돈을 받고 물건이나 서비스를 만들어 주거나 도와준 일인지 생각해요."
    : "힌트: 내가 돈을 내고 물건이나 서비스를 이용했는지 생각해요.");
  const explanation = activity.quiz?.explanation ?? activity.card.feedback;
  const isCorrect = choice === expected;

  const submit = () => {
    if (!choice) return;
    setAnswered(true);
  };

  return (
    <div className="overlay concept-quiz-overlay">
      <div className="modal concept-quiz-modal">
        <div className="game-head">
          <div>
            <p className="eyebrow">개념 확인</p>
            <h2>{activity.icon} {actionText}</h2>
          </div>
          <button className="icon-button" onClick={onCancel}>X</button>
        </div>
        <div className="concept-body">
          <p className="concept-question">{intro} 이것은 생산일까요, 소비일까요?</p>
          <div className="concept-choice-row">
            <button className={`concept-choice production ${choice === "production" ? "selected" : ""}`} onClick={() => setChoice("production")}>생산</button>
            <button className={`concept-choice consumption ${choice === "consumption" ? "selected" : ""}`} onClick={() => setChoice("consumption")}>소비</button>
          </div>
          {answered && !isCorrect && <div className="concept-feedback hint"><b>다시 생각해 봐요</b><span>{hint}</span></div>}
          {answered && isCorrect && <div className="concept-feedback correct"><b>정답!</b><span>{explanation}</span></div>}
          <div className="concept-actions">
            {!answered || !isCorrect ? <button className="primary" disabled={!choice} onClick={submit}>정답 확인</button> : <button className="primary" onClick={onComplete}>이해했어요</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function objectParticle(text) {
  const last = [...String(text).trim()].at(-1);
  if (!last) return "을";
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return "을";
  return (code - 0xac00) % 28 === 0 ? "를" : "을";
}

createRoot(document.getElementById("app")).render(<App />);

