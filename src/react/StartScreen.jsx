export function StartScreen({ onStart }) {
  return (
    <section className="start-screen alba-start-screen">
      <div className="pixel-sky"><span /><span /><span /></div>
      <div className="hero-town" aria-hidden="true">
        {["🍕", "🍦", "🐾", "🕹️", "🎤", "⭐", "📋"].map((icon, index) => (
          <i key={icon} style={{ "--i": index }}>{icon}</i>
        ))}
      </div>
      <div className="title-block">
        <p className="eyebrow">초등 사회 4학년 1학기 · 생산과 소비</p>
        <h1>내일은<br />알바왕!</h1>
        <p>우리 동네에 하루 동안 특별한 알바 게시판이 열렸어요. 알바로 코인을 벌고, 번 코인으로 먹거리와 꾸미기, 서비스를 소비해 봐요.</p>
        <button className="primary big" onClick={onStart}>하루 알바 시작</button>
      </div>
    </section>
  );
}
