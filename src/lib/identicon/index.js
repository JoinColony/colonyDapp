/* @flow */

import blockies from '../blockies';

const iconCache = {};

/**
 * Generate a blockie with the given seed (usually lowercase address).
 * Optionally set the resulting size in pixels.
 */
export default function getIcon(seed: string, size?: number) {
  if (iconCache[seed]) {
    return iconCache[seed];
  }
  const canvasElm = blockies({
    size: 5,
    scale: size ? parseInt(size / 5, 10) : 10,
    seed,
  });

  iconCache[seed] = canvasElm && canvasElm.toDataURL();
  return iconCache[seed];
}
