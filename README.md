# 우리 동네 생산·소비 탐험대

초등 사회 4학년 생산·소비 개념을 탑다운 픽셀 RPG 마을 탐험과 짧은 미션으로 학습하는 웹게임입니다.

## 실행

현재 프로젝트는 Vite + React + Phaser 구조입니다.

```powershell
npm install
npm run dev
```

기본 개발 서버는 `http://127.0.0.1:5173`에서 실행됩니다.

## 현재 구현

- 시작 화면
- 플레이어 캐릭터 선택
- 미션팩 선택
- Phaser 기반 큰 마을 맵
- 카메라가 플레이어를 따라가는 탑다운 이동
- 방향키/WASD/화면 버튼 이동
- 건물 스프라이트 분리 배치
- 목적지 느낌표 안내
- 건물 충돌 판정
- 맵 위 미션 오버레이
- 생산/소비 활동 카드 기록
- 생산/소비 분류 퀴즈
- 결과 이미지 PNG 저장
- 건물 위치와 이동 금지 구역을 조정하는 맵 에디터

## 이미지 에셋 구조

- `src/assets/maps/base-town-map.png`: 건물 없는 마을 배경
- `src/assets/buildings/split/*.png`: 개별 건물 이미지
- `src/assets/characters/cat-walk-spritesheet.png`: 투명 배경 4방향 걷기 스프라이트시트
- `src/assets/characters/cat-walk-spritesheet-source.png`: 원본 캐릭터 스프라이트 이미지

## 다음 개발 우선순위

1. 캐릭터 걷기 애니메이션과 조작감 다듬기
2. 미션별 임시 클릭 미니게임을 실제 미니게임 컴포넌트로 교체
3. 맵 에디터에서 잡은 건물/충돌 좌표를 `src/data/world.js` 기본값에 반영
4. 결과 이미지 긴 문장 줄바꿈 개선
