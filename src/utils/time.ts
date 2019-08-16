/* eslint-disable import/prefer-default-export */

// https://stackoverflow.com/a/39914235
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
