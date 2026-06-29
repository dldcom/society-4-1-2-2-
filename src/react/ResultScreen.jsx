export function ResultScreen({ character, cards, onRestart }) {
  const productions = cards.filter((card) => card.type === "production");
  const consumptions = cards.filter((card) => card.type === "consumption");

  const save = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f6e8bd";
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "#78b26d";
    ctx.fillRect(0, 700, 1080, 380);
    ctx.fillStyle = "#3b2b24";
    ctx.textAlign = "center";
    ctx.font = "bold 56px sans-serif";
    ctx.fillText("오늘의 생산·소비 인증샷", 540, 110);
    ctx.font = "bold 44px sans-serif";
    ctx.fillText(character.name, 540, 180);
    ctx.font = "150px serif";
    ctx.fillText(character.icon, 540, 360);
    ctx.textAlign = "left";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("내가 한 생산 활동", 95, 500);
    productions.forEach((card, index) => {
      ctx.font = "30px sans-serif";
      ctx.fillText(`${card.badge} ${card.description}`, 95, 555 + index * 54);
    });
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("내가 본 소비 활동", 95, 760);
    consumptions.forEach((card, index) => {
      ctx.font = "30px sans-serif";
      ctx.fillText(`${card.badge} ${card.description}`, 95, 815 + index * 54);
    });
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(character.learningPoint, 95, 940);
    const link = document.createElement("a");
    link.download = `production-consumption-${character.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="result-screen">
      <div className="result-card">
        <p className="eyebrow">오늘의 생산·소비 인증샷</p>
        <h2>{character.name}</h2>
        <div className="result-avatar">{character.icon}</div>
        <div className="result-columns">
          <div>
            <h3>내가 한 생산 활동</h3>
            {productions.map((card) => <p key={card.id}>{card.badge} {card.description}</p>)}
          </div>
          <div>
            <h3>내가 본 소비 활동</h3>
            {consumptions.map((card) => <p key={card.id}>{card.badge} {card.description}</p>)}
          </div>
        </div>
        <div className="learning-point">{character.learningPoint}</div>
      </div>
      <div className="result-actions">
        <button className="primary" onClick={save}>이미지 저장하기</button>
        <button className="secondary" onClick={onRestart}>다른 캐릭터로 다시 하기</button>
      </div>
    </section>
  );
}
