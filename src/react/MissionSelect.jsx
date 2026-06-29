export function MissionSelect({ playerCharacter, missions, completedMissionIds, cards, onBack, onPick, onQuiz }) {
  const completedCount = completedMissionIds.length;
  const allDone = completedCount >= missions.length;

  return (
    <section className="select-screen mission-select-screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">미션 선택</p>
          <h2>{playerCharacter.icon} {playerCharacter.name}와 오늘 할 일을 골라요</h2>
        </div>
        <button className="ghost" onClick={onBack}>캐릭터 다시 선택</button>
      </header>

      <div className="mission-summary">
        <strong>{completedCount} / {missions.length}</strong>
        <span>완료한 미션</span>
        <span>{cards.length}장의 활동 카드 수집</span>
        <button className="primary" disabled={!cards.length} onClick={onQuiz}>
          {allDone ? "마지막 퀴즈 풀기" : "지금까지 카드 정리하기"}
        </button>
      </div>

      <div className="character-grid mission-grid">
        {missions.map((mission) => {
          const done = completedMissionIds.includes(mission.id);
          return (
            <article className={`character-card mission-card ${done ? "completed" : ""}`} key={mission.id}>
              <div className="avatar-badge">{mission.icon}</div>
              <p className="eyebrow">{done ? "완료" : "선택 가능"}</p>
              <h3>{mission.name}</h3>
              <p>{mission.role}</p>
              <div className="mini-row">{mission.npc} · {mission.missions.length}단계</div>
              <button className={done ? "ghost" : "secondary"} onClick={() => onPick(mission.id)}>
                {done ? "다시 해보기" : "이 미션 시작"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
