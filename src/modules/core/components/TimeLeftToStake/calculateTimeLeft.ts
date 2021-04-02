export const calculateTimeLeft = (createdAt: number, stakePeriod: number) => {
  const difference = createdAt + stakePeriod * 1000 - Date.now();

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};
