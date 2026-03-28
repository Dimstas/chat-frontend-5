export const formatParticipants = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  let word = '';
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    word = 'участников';
  } else if (lastDigit === 1) {
    word = 'участник';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    word = 'участника';
  } else {
    word = 'участников';
  }

  return `${count} ${word}`;
};
