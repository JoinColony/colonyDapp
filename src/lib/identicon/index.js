/* @flow */

import blockies from '../blockies';

const iconCache = {};
export default function getIcon(seed: string) {
  if (iconCache[seed]) {
    return iconCache[seed];
  }
  const canvasElm = blockies({
    size: 5,
    scale: 10,
    seed,
  });

  iconCache[seed] = canvasElm && canvasElm.toDataURL();
  return iconCache[seed];
}
