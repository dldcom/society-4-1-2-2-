import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { consumptions, jobs, playerCharacter, uniqueCards } from "./data/alba.js";
import { GamePage } from "./react/GamePage.jsx";
import { StartScreen } from "./react/StartScreen.jsx";
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
  const [toast, setToast] = useState("");

  const completedJobCount = progress.completedJobs.length;
  const completedConsumptionCount = progress.completedConsumptions.length;
  const canFinish = progress.cards.length >= 5 && completedJobCount >= 3 && completedConsumptionCount >= 2;

  const resetDay = () => {
    setProgress(initialProgress);
    setToast("");
    setScreen("game");
  };

  const addCard = (card) => {
    setProgress((prev) => ({
      ...prev,
      cards: uniqueCards([...prev.cards, card])
    }));
  };

  const completeJob = (job) => {
    setProgress((prev) => ({
      ...prev,
      coins: prev.coins + job.rewardCoins,
      energy: Math.max(0, prev.energy - job.energyCost),
      completedJobs: prev.completedJobs.includes(job.id) ? prev.completedJobs : [...prev.completedJobs, job.id],
      cards: uniqueCards([...prev.cards, job.card])
    }));
    setToast(`${job.title} 완료! ${job.rewardCoins}코인을 벌고 생산 카드를 얻었어요.`);
  };

  const buyConsumption = (item) => {
    setProgress((prev) => {
      if (prev.coins < item.costCoins) return prev;
      return {
        ...prev,
        coins: prev.coins - item.costCoins,
        energy: Math.min(prev.maxEnergy, prev.energy + (item.energyGain ?? 0)),
        mood: prev.mood + (item.moodGain ?? 0),
        completedConsumptions: prev.completedConsumptions.includes(item.id)
          ? prev.completedConsumptions
          : [...prev.completedConsumptions, item.id],
        ownedItems: item.equip && !prev.ownedItems.includes(item.equip)
          ? [...prev.ownedItems, item.equip]
          : prev.ownedItems,
        stickers: item.resultSticker && !prev.stickers.includes(item.resultSticker)
          ? [...prev.stickers, item.resultSticker]
          : prev.stickers,
        cards: uniqueCards([...prev.cards, item.card])
      };
    });
    addCard(item.card);
    setToast(`${item.title} 완료! 소비 카드를 얻었어요.`);
  };

  const jobMap = useMemo(() => Object.fromEntries(jobs.map((job) => [job.id, job])), []);
  const consumptionMap = useMemo(() => Object.fromEntries(consumptions.map((item) => [item.id, item])), []);

  return (
    <>
      {screen === "start" && <StartScreen onStart={resetDay} />}
      {screen === "game" && (
        <GamePage
          playerCharacter={playerCharacter}
          progress={progress}
          canFinish={canFinish}
          jobMap={jobMap}
          consumptionMap={consumptionMap}
          onCompleteJob={completeJob}
          onBuyConsumption={buyConsumption}
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
          character={playerCharacter}
          progress={progress}
          jobMap={jobMap}
          consumptionMap={consumptionMap}
          onRestart={resetDay}
        />
      )}
      {toast && <div className="toast" onAnimationEnd={() => setToast("")}>{toast}</div>}
    </>
  );
}

createRoot(document.getElementById("app")).render(<App />);

