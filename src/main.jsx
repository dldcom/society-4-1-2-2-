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
  energy: 5,
  maxEnergy: 5,
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
  const [toast, setToast] = useState("");
  const [pendingActivity, setPendingActivity] = useState(null);

  const completedJobCount = progress.completedJobs.length;
  const completedConsumptionCount = progress.completedConsumptions.length;
  const canFinish = progress.cards.length >= 5 && completedJobCount >= 3 && completedConsumptionCount >= 2;

  const resetDay = (character = selectedCharacter) => {
    setSelectedCharacter(character);
    setProgress(initialProgress);
    setToast("");
    setPendingActivity(null);
    setScreen("game");
  };

  const queueJobReward = (job) => {
    setPendingActivity({ kind: "job", activity: job });
  };

  const queueConsumptionReward = (item) => {
    if (progress.coins < item.costCoins) {
      setToast("코인이 부족해요. 알바를 먼저 해 볼까요?");
      return false;
    }
    setPendingActivity({ kind: "consumption", activity: item });
    return true;
  };

  const applyPendingActivity = () => {
    if (!pendingActivity) return;
    const { kind, activity } = pendingActivity;
    if (kind === "job") {
      setProgress((prev) => ({
        ...prev,
        coins: prev.coins + activity.rewardCoins,
        energy: Math.max(0, prev.energy - activity.energyCost),
        completedJobs: prev.completedJobs.includes(activity.id) ? prev.completedJobs : [...prev.completedJobs, activity.id],
        cards: uniqueCards([...prev.cards, activity.card])
      }));
      setToast(`${activity.title} 완료! 개념 퀴즈까지 통과해서 ${activity.rewardCoins}코인을 받았어요.`);
    } else {
      setProgress((prev) => ({
        ...prev,
        coins: prev.coins - activity.costCoins,
        energy: Math.min(prev.maxEnergy, prev.energy + (activity.energyGain ?? 0)),
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
      setToast(`${activity.title} 완료! 개념 퀴즈까지 통과해서 소비 카드를 얻었어요.`);
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
          inputLocked={Boolean(pendingActivity)}
          jobMap={jobMap}
          consumptionMap={consumptionMap}
          onCompleteJob={queueJobReward}
          onBuyConsumption={queueConsumptionReward}
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
      {toast && <div className="toast" onAnimationEnd={() => setToast("")}>{toast}</div>}
    </>
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

