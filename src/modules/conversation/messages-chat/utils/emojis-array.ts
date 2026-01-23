export const emojisArray = (col: number): string[] => {
  const emojis: string[] = [];
  for (let i = 0; i <= col; i++) {
    emojis.push(`${i}`);
  }
  return emojis;
};
