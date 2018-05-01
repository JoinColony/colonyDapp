// https://stackoverflow.com/a/39914235
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
