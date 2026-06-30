export function ResultScreen({ character, progress, onRestart }) {
  const productions = progress.cards.filter((card) => card.type === "production");
  const consumptions = progress.cards.filter((card) => card.type === "consumption");

  const save = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f7e8b8";
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "#8fd8f0";
    ctx.fillRect(0, 0, 1080, 320);
    ctx.fillStyle = "#78b26d";
    ctx.fillRect(0, 760, 1080, 320);
    ctx.fillStyle = "#3b2b24";
    ctx.textAlign = "center";
    ctx.font = "bold 58px sans-serif";
    ctx.fillText("오늘의 알바 인증샷", 540, 95);
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("내일은 알바왕!", 540, 155);
    ctx.font = "130px serif";
    ctx.fillText(character.icon, 540, 310);
    ctx.font = "42px serif";
    ctx.fillText(progress.stickers.join(" ") || "📋", 540, 390);
    ctx.textAlign = "left";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(`코인 ${progress.coins} · 체력 ${progress.energy}/${progress.maxEnergy}`, 90, 455);
    ctx.fillText("내가 한 생산 활동", 90, 535);
    ctx.font = "28px sans-serif";
    productions.slice(0, 5).forEach((card, index) => ctx.fillText(`${card.badge} ${card.title}`, 110, 585 + index * 42));
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("내가 한 소비 활동", 90, 805);
    ctx.font = "28px sans-serif";
    consumptions.slice(0, 5).forEach((card, index) => ctx.fillText(`${card.badge} ${card.title}`, 110, 855 + index * 42));
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(`꾸미기: ${progress.ownedItems.join(", ") || "아직 없음"}`, 90, 1010);
    const link = document.createElement("a");
    link.download = "alba-king-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="result-screen">
      <div className="result-card alba-result-card">
        <p className="eyebrow">오늘의 알바 인증샷</p>
        <h2>내일은 알바왕!</h2>
        <div className="result-avatar">{character.icon}</div>
        <div className="result-stickers">{progress.stickers.length ? progress.stickers.join(" ") : "📋"}</div>
        <div className="result-summary-line">코인 {progress.coins} · 체력 {progress.energy}/{progress.maxEnergy}</div>
        <div className="result-columns">
          <div>
            <h3>내가 한 생산 활동</h3>
            {productions.map((card) => <p key={card.id}>{card.badge} {card.title}</p>)}
          </div>
          <div>
            <h3>내가 한 소비 활동</h3>
            {consumptions.map((card) => <p key={card.id}>{card.badge} {card.title}</p>)}
          </div>
        </div>
        <div className="learning-point">알바로 물건이나 서비스를 준비한 일은 생산 활동, 번 코인으로 물건이나 서비스를 이용한 일은 소비 활동이에요.</div>
      </div>
      <div className="result-actions">
        <button className="primary" onClick={save}>이미지 저장하기</button>
        <button className="secondary" onClick={onRestart}>다시 하루 시작</button>
      </div>
    </section>
  );
}
