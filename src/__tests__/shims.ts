// @ts-ignore
global.requestAnimationFrame = (callback: () => any) => {
  setTimeout(callback, 0);
};
