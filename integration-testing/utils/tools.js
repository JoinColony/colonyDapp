import { sleep } from '../../src/utils/time';

/**
 * Return a time prefix, used for testing,
 * in the form '20180430_200059'
 */
export function timePrefix() {
  // TODO(laurent): lpad numbers.
  const d = new Date();
  const a = `${d.getUTCFullYear()}${d.getUTCMonth()}${d.getUTCDay()}`;
  const b = `${d.getUTCHours()}${d.getUTCMinutes()}${d.getUTCSeconds()}`;
  return `${a}_${b}`;
}

/**
 * Retry until the given function returns a non-falsy value.
 *
 * By default try 10 times, with a sleep of 500ms between
 * each attempt.
 *
 * @param f
 * @param attempts
 * @param value
 * @returns {Promise<*>}
 */
export async function retryUntilValue(f, { attempts, value } = { attempts: 20, value: undefined }) {
  attempts = attempts || 20;

  let r = f()
  // console.log('GOT=', r);

  const shouldContinue = () => {
    if (value === undefined) {
      return r === undefined;
    }
    else {
      return r !== value;
    }
  }

  while (shouldContinue() && attempts > 0) {
    await sleep(500);
    r = f();
    attempts--;
    // console.log('Retried, GOT=', r);
  }

  return r
}
