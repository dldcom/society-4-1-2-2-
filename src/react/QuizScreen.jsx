import { useState } from "react";

export function QuizScreen({ cards, onBack, onComplete }) {
  const [bins, setBins] = useState({ production: [], consumption: [] });
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const unplaced = cards.filter((card) => !bins.production.includes(card.id) && !bins.consumption.includes(card.id));

  const move = (type) => {
    if (!selected) return;
    setBins((prev) => ({
      production: prev.production.filter((id) => id !== selected).concat(type === "production" ? [selected] : []),
      consumption: prev.consumption.filter((id) => id !== selected).concat(type === "consumption" ? [selected] : [])
    }));
    setSelected(null);
    setMessage("");
  };

  const submit = () => {
    if (bins.production.length + bins.consumption.length < cards.length) {
      setMessage("아직 놓지 않은 카드가 있어요.");
      return;
    }
    const wrong = cards.find((card) => !bins[card.type].includes(card.id));
    if (wrong) {
      setMessage(`틀렸습니다. '${wrong.title}'은 ${wrong.type === "production" ? "생산 활동" : "소비 활동"}이에요. ${wrong.feedback}`);
      return;
    }
    onComplete();
  };

  return (
    <section className="quiz-screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">마지막 퀴즈</p>
          <h2>내가 한 활동을 나누어 봐요</h2>
        </div>
        <button className="ghost" onClick={onBack}>마을 보기</button>
      </header>
      <div className="quiz-pool">
        {unplaced.map((card) => <Card key={card.id} card={card} selected={selected} onClick={setSelected} />)}
      </div>
      <div className="quiz-bins">
        <button className="quiz-bin production" onClick={() => move("production")}>
          <b>내가 한 생산 활동</b>
          {bins.production.map((id) => <Card key={id} card={cards.find((card) => card.id === id)} selected={selected} onClick={setSelected} />)}
        </button>
        <button className="quiz-bin consumption" onClick={() => move("consumption")}>
          <b>내가 본 소비 활동</b>
          {bins.consumption.map((id) => <Card key={id} card={cards.find((card) => card.id === id)} selected={selected} onClick={setSelected} />)}
        </button>
      </div>
      <div className="quiz-actions">
        <button className="secondary" onClick={() => setBins({ production: [], consumption: [] })}>다시 놓기</button>
        <button className="primary" onClick={submit}>답 제출</button>
      </div>
      <div className="quiz-message">{message}</div>
    </section>
  );
}

function Card({ card, selected, onClick }) {
  return (
    <span
      className={`activity-card ${card.type} ${selected === card.id ? "selected" : ""}`}
      onClick={(event) => {
        event.stopPropagation();
        onClick(card.id);
      }}
    >
      {card.badge} {card.title}
    </span>
  );
}
