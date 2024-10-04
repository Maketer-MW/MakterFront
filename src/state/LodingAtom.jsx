import { atom } from "recoil"; // selector를 추가로 임포트합니다.

// 지도의 중심 위치 상태
export const mapCenterState = atom({
  key: "isLodingState",
  default: false,
});
