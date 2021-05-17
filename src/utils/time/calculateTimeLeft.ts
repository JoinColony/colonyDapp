export const splitTimeLeft = (period: number) => {
  if (period > 0) {
    return {
      days: Math.floor(period / (60 * 60 * 24)),
      hours: Math.floor((period / (60 * 60)) % 24),
      minutes: Math.floor((period / 60) % 60),
      seconds: Math.floor(period % 60),
    };
  }
  return undefined;
};
