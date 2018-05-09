// https://stackoverflow.com/a/39914235
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
