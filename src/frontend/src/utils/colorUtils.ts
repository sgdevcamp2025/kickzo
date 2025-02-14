/** 색상을 어둡게 변환하는 함수 */
export const darkenColor = (color: string): string => {
  const [r, g, b] = color
    .match(/\w\w/g)!
    .map(hex => parseInt(hex, 16))
    .map(value => Math.max(0, value - 30)); // 밝기를 줄임
  return `rgb(${r}, ${g}, ${b})`;
};
