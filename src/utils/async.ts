import { log } from './debug';

/* eslint-disable-next-line import/prefer-default-export */
export const raceAgainstTimeout = async (
  promise: Promise<any>,
  ms: number,
  err?: Error,
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
  } catch (error) {
    log.verbose(error);
    return null;
  } finally {
    if (typeof cleanup === 'function') cleanup();
    clearTimeout(timeout);
  }
};

export function promisify(fn) {
  return (...args) => {
    // return a wrapper-function (*)
    return new Promise((resolve, reject) => {
      function callback(err, result) {
        // our custom callback for f (**)
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // append our custom callback to the end of f arguments

      fn.call(this, ...args); // call the original function
    });
  };
}
