export const waitForElement = (selector: string) => {
  return new Promise<HTMLElement>((resolve) => {
    // If element is in the DOM, resolve straight away
    if (document.querySelector(selector)) {
      resolve(document.querySelector(selector) as HTMLElement);
    }

    // Else, observe the DOM and return only when element has mounted.
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector) as HTMLElement);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};
