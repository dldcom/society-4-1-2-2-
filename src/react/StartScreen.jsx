export function StartScreen({ onStart }) {
  return (
    <section className="start-screen">
      <div className="pixel-sky"><span /><span /><span /></div>
      <div className="hero-town" aria-hidden="true">
        {["🏫", "✏️", "🥐", "📦", "🏪", "🚏", "🎪"].map((icon, index) => (
          <i key={icon} style={{ "--i": index }}>{icon}</i>
        ))}
      </div>
      <div className="title-block">
        <p className="eyebrow">초등 사회 4학년 1학기</p>
        <h1>우리 동네<br />생산·소비 탐험대</h1>
        <p>큰 마을을 자유롭게 돌아다니며 미션을 해결하고, 생산 활동과 소비 활동을 찾아봐요.</p>
        <button className="primary big" onClick={onStart}>게임 시작하기</button>
      </div>
    </section>
  );
}
