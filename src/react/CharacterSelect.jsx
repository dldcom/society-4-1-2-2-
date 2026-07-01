export function CharacterSelect({ characters, onBack, onPick }) {
  return (
    <section className="select-screen character-select-screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">플레이어 선택</p>
          <h2>오늘 마을을 탐험할 캐릭터를 골라요</h2>
        </div>
        <button className="ghost" onClick={onBack}>처음으로</button>
      </header>

      <div className="character-grid player-character-grid">
        {characters.map((character) => (
          <article className="character-card player-character-card" key={character.id}>
            <div className="avatar-badge">{character.icon}</div>
            <div>
              <h3>{character.name}</h3>
              <p>{character.role}</p>
            </div>
            <div className="mini-row">{character.item}</div>
            <button className="primary" onClick={() => onPick(character.id)}>이 캐릭터로 시작</button>
          </article>
        ))}
      </div>
    </section>
  );
}
