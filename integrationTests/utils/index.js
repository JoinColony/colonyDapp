import { sleep } from '../../src/utils/time';

/**
 * Retry until the given function returns a non-falsy value.
 *
 * By default try 10 times, with a sleep of 500ms between
 * each attempt.
 *
 * @param f
 * @param attempts
 * @returns {Promise<*>}
 */
export async function retryUntilValue(f, attempts = 10) {
  let r = f()
  console.log('GOT=', r);

  while (!r && attempts > 0) {
    await sleep(500);
    r = f();
    attempts--;
    console.log('Retried, GOT=', r);
  }

  return r
}
