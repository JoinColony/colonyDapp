export const checkIfLimitIsChanged = (newRate, oldRate) => {
  // limit can't be removed without changing endDate
  if (!newRate.limit) {
    return false;
  }

  if (newRate?.limit === oldRate?.limit && newRate.token === oldRate.token) {
    return false;
  }
  return true;
};

export const checkIfRateIsChanged = (newRate, oldRate) => {
  return (
    newRate.amount !== oldRate?.amount ||
    newRate.token !== oldRate?.token ||
    newRate.time !== oldRate?.time
  );
};
