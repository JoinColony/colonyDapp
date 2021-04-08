export const calculateTimeLeft = (createdAt: number, actionPeriod?: number) => {
  const difference = actionPeriod
    ? createdAt + actionPeriod * 1000 - Date.now()
    : 0;

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
