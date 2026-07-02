import { assetUrls } from "../phaser/assets.js";

export function StartScreen({ onStart }) {
  return (
    <section className="start-screen alba-start-screen">
      <img className="start-map-backdrop" src={assetUrls.maps.baseTown} alt="" aria-hidden="true" />
      <div className="start-map-shade" aria-hidden="true" />
      <div className="start-shell">
        <div className="start-title-panel">
          <p className="eyebrow">초등 사회 4학년 1학기 · 생산과 소비</p>
          <h1>내일은<br />알바왕!</h1>
          <p>마을을 돌아다니며 알바로 돈을 벌고, 번 돈으로 필요한 물건과 서비스를 이용해 봐요.</p>
          <button className="primary big" onClick={onStart}>게임 시작</button>
        </div>

        <div className="start-system-dialog" aria-label="시스템 안내">
          <div className="system-portrait">SYS</div>
          <div>
            <b>시스템</b>
            <p>오늘의 목표: 생산 카드 5장, 소비 카드 2장을 모아 하루를 마무리하세요.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
