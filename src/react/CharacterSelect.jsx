export function CharacterSelect({ characters, onBack, onPick }) {
  return (
    <section className="select-screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">탐험 캐릭터 선택</p>
          <h2>마을을 돌아다닐 캐릭터를 골라요</h2>
        </div>
        <button className="ghost" onClick={onBack}>처음으로</button>
      </header>
      <div className="character-grid">
        {characters.map((character) => (
          <article className="character-card" key={character.id}>
            <div className="avatar-badge">{character.icon}</div>
            <h3>{character.name}</h3>
            <p>{character.role}</p>
            <div className="mini-row">{character.item}</div>
            <button className="secondary" onClick={() => onPick(character.id)}>이 캐릭터 선택</button>
          </article>
        ))}
      </div>
    </section>
  );
}
