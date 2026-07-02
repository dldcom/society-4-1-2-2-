import { assetUrls } from "../phaser/assets.js";

export function CharacterSelect({ characters, onBack, onPick }) {
  return (
    <section className="select-screen character-select-screen rpg-select-screen">
      <img className="select-map-backdrop" src={assetUrls.maps.baseTown} alt="" aria-hidden="true" />
      <div className="select-map-shade" aria-hidden="true" />

      <header className="screen-header rpg-select-header">
        <div>
          <p className="eyebrow">플레이어 선택</p>
          <h2>오늘 마을을 탐험할 캐릭터</h2>
        </div>
        <button className="ghost" onClick={onBack}>처음으로</button>
      </header>

      <div className="character-grid player-character-grid rpg-character-grid">
        {characters.map((character) => (
          <article className="character-card player-character-card rpg-character-card" key={character.id}>
            <div className="character-preview-stage">
              <SpritePreview character={character} />
            </div>
            <div className="character-card-copy">
              <span className="character-token">{character.icon}</span>
              <div>
                <h3>{character.name}</h3>
                <p>{character.role}</p>
              </div>
            </div>
            <div className="mini-row">{character.item}</div>
            <button className="primary" onClick={() => onPick(character.id)}>이 캐릭터로 시작</button>
          </article>
        ))}
      </div>

      <div className="select-system-dialog">
        <div className="system-portrait">SYS</div>
        <p>캐릭터마다 조작 방식은 같아요. 마음에 드는 모습으로 시작하면 됩니다.</p>
      </div>
    </section>
  );
}

function SpritePreview({ character }) {
  const sprite = character.sprite ?? {};
  const source = assetUrls.players?.[sprite.key];
  const frameWidth = sprite.frameWidth ?? 64;
  const frameHeight = sprite.frameHeight ?? 64;
  const scale = character.id === "cat" ? 0.62 : 1.65;

  if (!source) return <div className="avatar-badge">{character.icon}</div>;

  return (
    <div className="sprite-preview-window" style={{ "--frame-w": `${frameWidth}px`, "--frame-h": `${frameHeight}px`, "--sprite-scale": scale }}>
      <div
        className="sprite-preview-frame"
        style={{
          width: frameWidth,
          height: frameHeight,
          backgroundImage: `url(${source})`
        }}
      />
    </div>
  );
}
