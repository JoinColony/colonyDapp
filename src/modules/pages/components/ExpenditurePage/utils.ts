type GetTimeDifferenceParameters = {
  amount: number;
  time: 'hours' | 'days' | 'months';
};

const timeMultiplier = (time: 'hours' | 'days' | 'months') => {
  switch (time) {
    case 'hours': {
      return 3600;
    }
    case 'days': {
      return 86400;
    }
    case 'months': {
      return 2629743.83;
    }
    default: {
      return 1;
    }
  }
};

export const getTimeDifference = ({
  amount,
  time,
}: GetTimeDifferenceParameters): number => {
  const multiplicator = timeMultiplier(time);

  return amount * multiplicator;
};

export const setClaimDate = ({
  amount,
  time,
}: GetTimeDifferenceParameters): number => {
  const differenceInSeconds = getTimeDifference({ amount, time });
  const currentDate = new Date();
  return currentDate.setSeconds(currentDate.getSeconds() + differenceInSeconds);
};
