export const calculateTimeLeft = (createdAt: number, actionPeriod?: number) => {
  if (!actionPeriod) {
    return undefined;
  }
  // 1617362399585
  const difference = createdAt + actionPeriod * 1000 - Date.now();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return undefined;
};
