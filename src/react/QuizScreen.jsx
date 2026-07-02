import { useState } from "react";

export function QuizScreen({ cards, onBack, onComplete }) {
  const [bins, setBins] = useState({ production: [], consumption: [] });
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const unplaced = cards.filter((card) => !bins.production.includes(card.id) && !bins.consumption.includes(card.id));

  const placeCard = (cardId, type) => {
    if (!cardId) return;
    setBins((prev) => ({
      production: prev.production.filter((id) => id !== cardId).concat(type === "production" ? [cardId] : []),
      consumption: prev.consumption.filter((id) => id !== cardId).concat(type === "consumption" ? [cardId] : [])
    }));
    setSelected(null);
    setMessage("");
  };

  const move = (type) => placeCard(selected, type);

  const returnCard = (cardId) => {
    if (!cardId) return;
    setBins((prev) => ({
      production: prev.production.filter((id) => id !== cardId),
      consumption: prev.consumption.filter((id) => id !== cardId)
    }));
    setSelected(null);
    setMessage("");
  };

  const allowDrop = (event) => event.preventDefault();

  const dropOnBin = (type) => (event) => {
    event.preventDefault();
    placeCard(event.dataTransfer.getData("text/plain"), type);
  };

  const dropOnPool = (event) => {
    event.preventDefault();
    returnCard(event.dataTransfer.getData("text/plain"));
  };

  const submit = () => {
    if (bins.production.length + bins.consumption.length < cards.length) {
      setMessage("\uC544\uC9C1 \uBD84\uB958\uD558\uC9C0 \uC54A\uC740 \uCE74\uB4DC\uAC00 \uC788\uC5B4\uC694.");
      return;
    }
    const wrong = cards.find((card) => !bins[card.type].includes(card.id));
    if (wrong) {
      setMessage("'" + wrong.title + "' \uCE74\uB4DC\uB294 " + (wrong.type === "production" ? "\uC0DD\uC0B0 \uD65C\uB3D9" : "\uC18C\uBE44 \uD65C\uB3D9") + "\uC774\uC5D0\uC694. " + wrong.feedback);
      return;
    }
    onComplete();
  };

  return (
    <section className="quiz-screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">{"\uB9C8\uC9C0\uB9C9 \uD034\uC988"}</p>
          <h2>{"\uC0DD\uC0B0 \uC18C\uBE44 \uAD6C\uBD84\uD558\uAE30"}</h2>
        </div>
        <button className="ghost" onClick={onBack}>{"\uB9C8\uC744\uB85C \uB3CC\uC544\uAC00\uAE30"}</button>
      </header>
      <div className="quiz-pool" onDragOver={allowDrop} onDrop={dropOnPool}>
        {unplaced.map((card) => <Card key={card.id} card={card} selected={selected} onClick={setSelected} />)}
      </div>
      <div className="quiz-bins">
        <div className="quiz-bin production" role="button" tabIndex={0} onClick={() => move("production")} onDragOver={allowDrop} onDrop={dropOnBin("production")}>
          <b>{"\uC0DD\uC0B0 \uD65C\uB3D9"}</b>
          {bins.production.map((id) => <Card key={id} card={cards.find((card) => card.id === id)} selected={selected} onClick={setSelected} />)}
        </div>
        <div className="quiz-bin consumption" role="button" tabIndex={0} onClick={() => move("consumption")} onDragOver={allowDrop} onDrop={dropOnBin("consumption")}>
          <b>{"\uC18C\uBE44 \uD65C\uB3D9"}</b>
          {bins.consumption.map((id) => <Card key={id} card={cards.find((card) => card.id === id)} selected={selected} onClick={setSelected} />)}
        </div>
      </div>
      <div className="quiz-actions">
        <button className="secondary" onClick={() => setBins({ production: [], consumption: [] })}>{"\uB2E4\uC2DC \uBD84\uB958"}</button>
        <button className="primary" onClick={submit}>{"\uC815\uB2F5 \uD655\uC778"}</button>
      </div>
      {message && <div className="quiz-message">{message}</div>}
    </section>
  );
}

function Card({ card, selected, onClick }) {
  if (!card) return null;
  return (
    <span
      className={`activity-card ${selected === card.id ? "selected" : ""}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", card.id);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick(card.id);
      }}
    >
      {card.badge} {card.title}
    </span>
  );
}
