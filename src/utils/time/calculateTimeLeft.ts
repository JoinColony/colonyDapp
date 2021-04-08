export const calculateTimeLeft = (
  createdAt: number,
  timeSinceLastRefreshed: number,
  timeNow?: number,
  actionPeriod?: number,
) => {
  const difference =
    actionPeriod && timeNow
      ? createdAt + actionPeriod * 1000 - (timeNow + timeSinceLastRefreshed)
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
