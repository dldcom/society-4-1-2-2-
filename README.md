# 우리 동네 생산·소비 탐험대

초등 사회 4학년 생산·소비 개념을 작은 마을 탐험과 미니게임으로 학습하는 정적 웹게임입니다.

## 실행

`index.html`을 브라우저에서 열면 바로 실행됩니다.

로컬 서버로 확인하려면:

```powershell
python -m http.server 5174
```

그 뒤 `http://localhost:5174`로 접속합니다.

## 현재 구현

- 시작 화면
- 8개 캐릭터 선택
- 이미지 레이어 기반 탑뷰 마을 맵 구조
- 건물 스프라이트 분리 배치 구조
- 방향키/WASD/화면 버튼 이동
- 목적지 느낌표 안내
- 마을 맵 위 미니게임 오버레이
- 생산 활동 3개 + 소비 활동 1개 카드 기록
- 생산/소비 분류 퀴즈
- 결과 이미지 PNG 저장

## 이미지 에셋 구조

- `src/assets/maps/base-town-map.png`: 건물 없는 마을 배경
- `src/assets/buildings/building-spritesheet.png`: 5열 x 2행 건물 스프라이트시트
- `src/assets/characters/*.png`: 캐릭터 스프라이트
- `src/assets/items/*.png`: 미니게임 아이템

자세한 생성 프롬프트는 `docs/image-generation-prompts.md`에 정리되어 있습니다.
