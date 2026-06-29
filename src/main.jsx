import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { characters } from "./data/characters.js";
import { GamePage } from "./react/GamePage.jsx";
import { CharacterSelect } from "./react/CharacterSelect.jsx";
import { MissionSelect } from "./react/MissionSelect.jsx";
import { StartScreen } from "./react/StartScreen.jsx";
import { QuizScreen } from "./react/QuizScreen.jsx";
import { ResultScreen } from "./react/ResultScreen.jsx";

function App() {
  const [screen, setScreen] = useState("start");
  const [characterId, setCharacterId] = useState(characters[0].id);
  const [missionPackId, setMissionPackId] = useState(characters[0].id);
  const [missionIndex, setMissionIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [completedMissionIds, setCompletedMissionIds] = useState([]);

  const playerCharacter = useMemo(
    () => characters.find((item) => item.id === characterId) ?? characters[0],
    [characterId]
  );
  const missionPack = useMemo(
    () => characters.find((item) => item.id === missionPackId) ?? characters[0],
    [missionPackId]
  );

  const chooseCharacter = (id) => {
    setCharacterId(id);
    setMissionPackId(characters[0].id);
    setMissionIndex(0);
    setCards([]);
    setCompletedMissionIds([]);
    setScreen("missions");
  };

  const chooseMissionPack = (id) => {
    setMissionPackId(id);
    setMissionIndex(0);
    setScreen("game");
  };

  const completeMission = (mission) => {
    setCards((prev) => (prev.some((card) => card.id === mission.id) ? prev : [...prev, mission]));
    const nextIndex = missionIndex + 1;
    if (nextIndex >= missionPack.missions.length) {
      setCompletedMissionIds((prev) => (prev.includes(missionPack.id) ? prev : [...prev, missionPack.id]));
      setMissionIndex(0);
      setScreen("missions");
      return;
    }
    setMissionIndex(nextIndex);
  };

  const goToQuiz = () => setScreen("quiz");

  return (
    <>
      {screen === "start" && <StartScreen onStart={() => setScreen("select")} />}
      {screen === "select" && (
        <CharacterSelect
          characters={characters}
          onBack={() => setScreen("start")}
          onPick={chooseCharacter}
        />
      )}
      {screen === "missions" && (
        <MissionSelect
          playerCharacter={playerCharacter}
          missions={characters}
          completedMissionIds={completedMissionIds}
          cards={cards}
          onBack={() => setScreen("select")}
          onPick={chooseMissionPack}
          onQuiz={goToQuiz}
        />
      )}
      {screen === "game" && (
        <GamePage
          playerCharacter={playerCharacter}
          character={missionPack}
          missionIndex={missionIndex}
          cards={cards}
          onMissionComplete={completeMission}
          onBackToMissions={() => setScreen("missions")}
        />
      )}
      {screen === "quiz" && (
        <QuizScreen
          cards={cards}
          onBack={() => setScreen("missions")}
          onComplete={() => setScreen("result")}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          character={playerCharacter}
          cards={cards}
          onRestart={() => setScreen("select")}
        />
      )}
    </>
  );
}

createRoot(document.getElementById("app")).render(<App />);
