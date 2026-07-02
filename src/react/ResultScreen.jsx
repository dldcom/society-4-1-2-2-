import { useRef } from "react";
import { toPng } from "html-to-image";
import { assetUrls } from "../phaser/assets.js";

const RESULT_FONT_FAMILY = "Galmuri11, 'Malgun Gothic', 'Apple SD Gothic Neo', system-ui, sans-serif";

export function ResultScreen({ character, progress, onRestart }) {
  const cardRef = useRef(null);
  const productions = progress.cards.filter((card) => card.type === "production");
  const consumptions = progress.cards.filter((card) => card.type === "consumption");
  const totalCards = productions.length + consumptions.length;

  const save = async () => {
    if (!cardRef.current) return;
    await saveResultAsPng(cardRef.current, "alba-king-result.png");
  };

  return (
    <section className="result-screen">
      <div className="result-card alba-result-card" ref={cardRef}>
        <div className="result-hero">
          <div className="result-copy">
            <p className="eyebrow">{"\uC624\uB298\uC758 \uC54C\uBC14\uC655"}</p>
            <h2>{"\uC0DD\uC0B0\u00B7\uC18C\uBE44 \uD65C\uB3D9 \uC778\uC99D\uC11C"}</h2>
          </div>
          <ResultCharacter character={character} />
        </div>

        <div className="result-summary-grid" aria-label={"\uACB0\uACFC \uC694\uC57D"}>
          <div className="result-stat">
            <span>{"\uBC88 \uB3C8"}</span>
            <b>{progress.coins}{"\uC6D0"}</b>
          </div>
          <div className="result-stat production">
            <span>{"\uC0DD\uC0B0 \uCE74\uB4DC"}</span>
            <b>{productions.length}{"\uAC1C"}</b>
          </div>
          <div className="result-stat consumption">
            <span>{"\uC18C\uBE44 \uCE74\uB4DC"}</span>
            <b>{consumptions.length}{"\uAC1C"}</b>
          </div>
          <div className="result-stat">
            <span>{"\uBAA8\uC740 \uCE74\uB4DC"}</span>
            <b>{totalCards}{"\uC7A5"}</b>
          </div>
        </div>

        <div className="result-columns">
          <section className="result-column">
            <div className="result-column-head">
              <h3>{"\uC0DD\uC0B0 \uD65C\uB3D9"}</h3>
              <span>{productions.length}{"\uAC1C"}</span>
            </div>
            <div className="result-chip-list">
              {productions.map((card) => <ResultChip key={card.id} card={card} />)}
            </div>
          </section>
          <section className="result-column">
            <div className="result-column-head">
              <h3>{"\uC18C\uBE44 \uD65C\uB3D9"}</h3>
              <span>{consumptions.length}{"\uAC1C"}</span>
            </div>
            <div className="result-chip-list">
              {consumptions.map((card) => <ResultChip key={card.id} card={card} />)}
            </div>
          </section>
        </div>
      </div>
      <div className="result-actions">
        <button className="primary" onClick={save}>{"\uC774\uBBF8\uC9C0 \uC800\uC7A5\uD558\uAE30"}</button>
        <button className="secondary" onClick={onRestart}>{"\uB2E4\uC2DC \uD558\uB8E8 \uC2DC\uC791"}</button>
      </div>
    </section>
  );
}

function ResultChip({ card }) {
  return (
    <span className={`result-chip ${card.type}`}>
      <span>{card.badge}</span>
      <b>{card.title}</b>
    </span>
  );
}

function ResultCharacter({ character }) {
  const sprite = character.sprite ?? {};
  const source = assetUrls.players?.[sprite.key];
  const frameWidth = sprite.frameWidth ?? 64;
  const frameHeight = sprite.frameHeight ?? 64;
  const frame = sprite.idle?.down ?? 0;
  const scale = character.id === "cat" ? 0.78 : 1.9;

  if (!source) return <div className="result-avatar result-character-fallback">{character.name}</div>;

  return (
    <div className="result-character-stage" aria-label={character.name}>
      <div className="result-sprite-window" style={{ "--frame-w": `${frameWidth}px`, "--frame-h": `${frameHeight}px`, "--sprite-scale": scale }}>
        <div
          className="result-sprite-frame"
          style={{
            width: frameWidth,
            height: frameHeight,
            backgroundImage: `url(${source})`,
            backgroundPosition: `-${frame * frameWidth}px 0px`
          }}
        />
      </div>
    </div>
  );
}

async function saveResultAsPng(node, filename) {
  await ensureResultFonts();

  const previous = {
    maxHeight: node.style.maxHeight,
    overflow: node.style.overflow,
    height: node.style.height
  };

  node.style.maxHeight = "none";
  node.style.overflow = "visible";
  node.style.height = "auto";

  try {
    const width = Math.ceil(node.scrollWidth);
    const height = Math.ceil(node.scrollHeight);
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: Math.max(2, Math.ceil(window.devicePixelRatio || 1)),
      backgroundColor: "#f4dfaa",
      width,
      height,
      style: {
        maxHeight: "none",
        overflow: "visible",
        height: `${height}px`
      }
    });
    downloadDataUrl(dataUrl, filename);
  } finally {
    node.style.maxHeight = previous.maxHeight;
    node.style.overflow = previous.overflow;
    node.style.height = previous.height;
  }
}

async function ensureResultFonts() {
  if (!document.fonts) return;
  await Promise.all([
    document.fonts.load(resultFont(700, 34), "\uC0DD\uC0B0\u00B7\uC18C\uBE44 \uD65C\uB3D9 \uC778\uC99D\uC11C"),
    document.fonts.load(resultFont(400, 17), "\uC624\uB298\uC758 \uC54C\uBC14\uC655")
  ]);
  await document.fonts.ready;
}

function resultFont(weight, size) {
  return `${weight} ${size}px ${RESULT_FONT_FAMILY}`;
}

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
