import { useMemo, useRef, useState } from "react";
import { assetUrls } from "../phaser/assets.js";
import {
  applyPlaceOverrides,
  BLOCKED_AREA_KEY,
  defaultBlockedAreas,
  defaultPlaces,
  loadBlockedAreas,
  loadPlaceOverrides,
  PLACE_OVERRIDE_KEY,
  WORLD
} from "../data/world.js";

function roundItem(item) {
  const rounded = { ...item };
  ["x", "y", "w", "h"].forEach((key) => {
    if (Number.isFinite(rounded[key])) rounded[key] = Math.round(rounded[key]);
  });
  return rounded;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const resizeHandles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const minBlockedSize = 40;

export function PlacementEditor({ onClose }) {
  const mapRef = useRef(null);
  const [mode, setMode] = useState("places");
  const [places, setPlaces] = useState(() => applyPlaceOverrides(defaultPlaces).map(roundItem));
  const [blockedAreas, setBlockedAreas] = useState(() => loadBlockedAreas().map(roundItem));
  const [selectedPlaceId, setSelectedPlaceId] = useState(defaultPlaces[0]?.id ?? "");
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [dragging, setDragging] = useState(null);
  const [message, setMessage] = useState("");

  const selectedPlace = useMemo(() => places.find((place) => place.id === selectedPlaceId) ?? places[0], [places, selectedPlaceId]);
  const selectedArea = useMemo(() => blockedAreas.find((area) => area.id === selectedAreaId) ?? blockedAreas[0], [blockedAreas, selectedAreaId]);

  const pointerToWorld = (event) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * WORLD.width, 0, WORLD.width),
      y: clamp(((event.clientY - rect.top) / rect.height) * WORLD.height, 0, WORLD.height)
    };
  };

  const updatePlace = (id, patch) => {
    setPlaces((current) => current.map((place) => (
      place.id === id ? roundItem({ ...place, ...patch }) : place
    )));
  };

  const updateArea = (id, patch) => {
    setBlockedAreas((current) => current.map((area) => (
      area.id === id ? roundItem({ ...area, ...patch }) : area
    )));
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;
    const point = pointerToWorld(event);
    if (!point) return;
    if (dragging.type === "place") {
      updatePlace(dragging.id, {
        x: point.x - dragging.offsetX,
        y: point.y - dragging.offsetY
      });
      return;
    }
    if (dragging.type === "area") {
      updateArea(dragging.id, {
        x: point.x - dragging.offsetX,
        y: point.y - dragging.offsetY
      });
      return;
    }
    if (dragging.type === "area-resize") {
      const start = dragging.startArea;
      let left = start.x - start.w / 2;
      let right = start.x + start.w / 2;
      let top = start.y - start.h / 2;
      let bottom = start.y + start.h / 2;

      if (dragging.handle.includes("w")) left = clamp(point.x, 0, right - minBlockedSize);
      if (dragging.handle.includes("e")) right = clamp(point.x, left + minBlockedSize, WORLD.width);
      if (dragging.handle.includes("n")) top = clamp(point.y, 0, bottom - minBlockedSize);
      if (dragging.handle.includes("s")) bottom = clamp(point.y, top + minBlockedSize, WORLD.height);

      updateArea(dragging.id, {
        x: (left + right) / 2,
        y: (top + bottom) / 2,
        w: right - left,
        h: bottom - top
      });
    }
  };

  const addBlockedArea = () => {
    const area = {
      id: `area-${Date.now()}`,
      name: `이동 금지 ${blockedAreas.length + 1}`,
      x: Math.round(WORLD.width * 0.5),
      y: Math.round(WORLD.height * 0.5),
      w: 220,
      h: 140
    };
    setBlockedAreas((current) => [...current, area]);
    setSelectedAreaId(area.id);
    setMode("blocked");
    setMessage("새 이동 금지 구역을 추가했어요. 맵에서 드래그해서 우물가에 맞춰주세요.");
  };

  const deleteBlockedArea = () => {
    if (!selectedArea) return;
    setBlockedAreas((current) => current.filter((area) => area.id !== selectedArea.id));
    setSelectedAreaId("");
  };

  const save = () => {
    const placeOverrides = Object.fromEntries(places.map(({ id, x, y, w }) => [id, { x, y, w }]));
    const blocked = blockedAreas.map(({ id, name, x, y, w, h }) => ({ id, name, x, y, w, h }));
    window.localStorage.setItem(PLACE_OVERRIDE_KEY, JSON.stringify(placeOverrides));
    window.localStorage.setItem(BLOCKED_AREA_KEY, JSON.stringify(blocked));
    setMessage("저장 완료. 새로고침하면 건물 위치와 이동 금지 구역이 게임에 적용돼요.");
  };

  const copyJson = async () => {
    const savedPlaces = loadPlaceOverrides();
    const fallbackPlaces = Object.fromEntries(places.map(({ id, x, y, w }) => [id, { x, y, w }]));
    const text = JSON.stringify({
      places: Object.keys(savedPlaces).length ? savedPlaces : fallbackPlaces,
      blockedAreas
    }, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setMessage("건물/이동 금지 JSON을 클립보드에 복사했어요.");
    } catch {
      setMessage(text);
    }
  };

  const resetSelected = () => {
    if (mode === "places" && selectedPlace) {
      const base = defaultPlaces.find((place) => place.id === selectedPlace.id);
      if (base) updatePlace(selectedPlace.id, base);
    }
    if (mode === "blocked") deleteBlockedArea();
  };

  const resetAll = () => {
    window.localStorage.removeItem(PLACE_OVERRIDE_KEY);
    window.localStorage.removeItem(BLOCKED_AREA_KEY);
    setPlaces(defaultPlaces.map(roundItem));
    setBlockedAreas(defaultBlockedAreas.map(roundItem));
    setSelectedAreaId("");
    setMessage("저장된 수동 배치와 이동 금지 구역을 지웠어요.");
  };

  return (
    <div className="placement-editor" role="dialog" aria-modal="true" aria-label="맵 편집">
      <div className="placement-map-wrap">
        <div
          ref={mapRef}
          className={`placement-map editing-${mode}`}
          onPointerMove={handlePointerMove}
          onPointerUp={() => setDragging(null)}
          onPointerLeave={() => setDragging(null)}
        >
          <img className="placement-map-image" src={assetUrls.map} alt="" draggable="false" />

          {blockedAreas.map((area) => (
            <button
              key={area.id}
              type="button"
              className={`placement-blocked ${area.id === selectedArea?.id ? "selected" : ""}`}
              style={{
                left: `${(area.x / WORLD.width) * 100}%`,
                top: `${(area.y / WORLD.height) * 100}%`,
                width: `${(area.w / WORLD.width) * 100}%`,
                height: `${(area.h / WORLD.height) * 100}%`
              }}
              onPointerDown={(event) => {
                event.preventDefault();
                const point = pointerToWorld(event);
                event.currentTarget.setPointerCapture(event.pointerId);
                setMode("blocked");
                setSelectedAreaId(area.id);
                setDragging({
                  type: "area",
                  id: area.id,
                  offsetX: point ? point.x - area.x : 0,
                  offsetY: point ? point.y - area.y : 0
                });
              }}
              onPointerUp={(event) => {
                event.currentTarget.releasePointerCapture(event.pointerId);
                setDragging(null);
              }}
              title={`${area.name ?? "이동 금지"} (${area.x}, ${area.y})`}
            >
              <span>{area.name ?? "이동 금지"}</span>
              {area.id === selectedArea?.id && resizeHandles.map((handle) => (
                <i
                  key={handle}
                  className={`resize-handle ${handle}`}
                  aria-hidden="true"
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setMode("blocked");
                    setSelectedAreaId(area.id);
                    setDragging({
                      type: "area-resize",
                      id: area.id,
                      handle,
                      startArea: { ...area }
                    });
                  }}
                  onPointerUp={(event) => {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                    setDragging(null);
                  }}
                />
              ))}
            </button>
          ))}

          {places.map((place) => (
            <button
              key={place.id}
              type="button"
              className={`placement-building ${place.id === selectedPlace?.id && mode === "places" ? "selected" : ""}`}
              style={{
                left: `${(place.x / WORLD.width) * 100}%`,
                top: `${(place.y / WORLD.height) * 100}%`,
                width: `${(place.w / WORLD.width) * 100}%`
              }}
              onPointerDown={(event) => {
                event.preventDefault();
                const point = pointerToWorld(event);
                event.currentTarget.setPointerCapture(event.pointerId);
                setMode("places");
                setSelectedPlaceId(place.id);
                setDragging({
                  type: "place",
                  id: place.id,
                  offsetX: point ? point.x - place.x : 0,
                  offsetY: point ? point.y - place.y : 0
                });
              }}
              onPointerUp={(event) => {
                event.currentTarget.releasePointerCapture(event.pointerId);
                setDragging(null);
              }}
              title={`${place.name} (${place.x}, ${place.y})`}
            >
              <img src={assetUrls.buildings[place.building]} alt={place.name} draggable="false" />
              <span>{place.name}</span>
            </button>
          ))}
        </div>
      </div>

      <aside className="placement-panel">
        <div className="placement-panel-head">
          <div>
            <p className="eyebrow">Map editor</p>
            <h2>맵 수동 조정</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>X</button>
        </div>

        <div className="editor-tabs">
          <button className={mode === "places" ? "active" : ""} type="button" onClick={() => setMode("places")}>건물</button>
          <button className={mode === "blocked" ? "active" : ""} type="button" onClick={() => setMode("blocked")}>이동 금지</button>
        </div>

        {mode === "places" && selectedPlace && (
          <>
            <label>
              건물
              <select value={selectedPlace.id} onChange={(event) => setSelectedPlaceId(event.target.value)}>
                {places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
              </select>
            </label>
            <div className="placement-controls">
              <NumberField label="X" value={selectedPlace.x} min={0} max={WORLD.width} onChange={(x) => updatePlace(selectedPlace.id, { x })} />
              <NumberField label="Y" value={selectedPlace.y} min={0} max={WORLD.height} onChange={(y) => updatePlace(selectedPlace.id, { y })} />
              <label>
                크기
                <input type="range" value={selectedPlace.w} min="120" max="520" onChange={(event) => updatePlace(selectedPlace.id, { w: Number(event.target.value) })} />
                <input type="number" value={selectedPlace.w} min="120" max="520" onChange={(event) => updatePlace(selectedPlace.id, { w: Number(event.target.value) })} />
              </label>
            </div>
          </>
        )}

        {mode === "blocked" && (
          <>
            <button className="primary" type="button" onClick={addBlockedArea}>이동 금지 구역 추가</button>
            {selectedArea ? (
              <div className="placement-controls">
                <label>
                  이름
                  <input value={selectedArea.name ?? ""} onChange={(event) => updateArea(selectedArea.id, { name: event.target.value })} />
                </label>
                <NumberField label="X" value={selectedArea.x} min={0} max={WORLD.width} onChange={(x) => updateArea(selectedArea.id, { x })} />
                <NumberField label="Y" value={selectedArea.y} min={0} max={WORLD.height} onChange={(y) => updateArea(selectedArea.id, { y })} />
                <NumberField label="너비" value={selectedArea.w} min={40} max={900} onChange={(w) => updateArea(selectedArea.id, { w })} />
                <NumberField label="높이" value={selectedArea.h} min={40} max={700} onChange={(h) => updateArea(selectedArea.id, { h })} />
              </div>
            ) : (
              <p className="placement-hint">우물, 연못, 장식물처럼 캐릭터가 못 지나갈 곳에 사각형을 추가하세요.</p>
            )}
          </>
        )}

        <div className="placement-actions">
          <button className="primary" type="button" onClick={save}>저장</button>
          <button className="secondary" type="button" onClick={() => window.location.reload()}>새로고침 적용</button>
          <button className="secondary" type="button" onClick={copyJson}>JSON 복사</button>
          <button className="ghost" type="button" onClick={resetSelected}>{mode === "blocked" ? "선택 삭제" : "선택 초기화"}</button>
          <button className="ghost" type="button" onClick={resetAll}>전체 초기화</button>
        </div>

        {message && <p className="placement-message">{message}</p>}
      </aside>
    </div>
  );
}

function NumberField({ label, value, min, max, onChange }) {
  return (
    <label>
      {label}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
