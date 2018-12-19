/* @flow */

export const raceAgainstTimeout = async (
  /** Promise you want to race against */
  promise: Promise<any>,
  /** Timeout in ms */
  ms: number,
  /** Optional custom error to be thrown if it times out */
  err?: Error,
) => {
  let timeout;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeout = setTimeout(() => reject(err), ms);
  });
  const res = await Promise.race([timeoutPromise, promise]);
  clearTimeout(timeout);
  return res;
};

// Creating a promise chain to sequentially work through the entries
// Warning: Doesn't pass on resolved values to the next promise
export const promiseSeries = (promises: Array<Promise<any>>) =>
  promises.reduce(
    (lastPromise, currentPromise) => lastPromise.then(() => currentPromise),
    Promise.resolve(true),
  );
