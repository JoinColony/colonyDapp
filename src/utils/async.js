/* @flow */

/* eslint-disable-next-line import/prefer-default-export */
export const raceAgainstTimeout = async (
  /** Promise you want to race against */
  promise: Promise<any>,
  /** Timeout in ms */
  ms: number,
  /** Optional custom error to be thrown if it times out */
  err?: Error,
  /** Optional cleanup function to _always_ call when the race is over */
  cleanup?: () => any,
) => {
  let timeout;
  const throwError = err || new Error('Timed out');
  const timeoutPromise = new Promise((resolve, reject) => {
    timeout = setTimeout(() => reject(throwError), ms);
  });
  try {
    // To be able to use the async error handling here, we need to explicitly
    // use `await`
    const result = await Promise.race([timeoutPromise, promise]);
    return result;
  } finally {
    if (typeof cleanup == 'function') cleanup();
    clearTimeout(timeout);
  }
};
