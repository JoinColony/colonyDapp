import { BEAMER_LIBRARY } from '~externalUrls';

// Add support for Beamer (getbeamer.com) in app feature announcements
export const getBeamerId = process.env.BEAMER_PRODUCT_ID || false;

const getBeamerInitialize = (id: string, url?: string, args = {}) => {
  if (!window) {
    return;
  }

  if (!id) {
    throw Error('Must provide Beamer "id".');
  }

  /* eslint-disable camelcase */
  (window as any).beamer_config = {
    product_id: id,
    ...args,
  };
  /* eslint-enable camelcase */

  const beamerURL = url || BEAMER_LIBRARY;

  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');

  script.defer = true;
  script.src = beamerURL;
  head.appendChild(script);
};

export default getBeamerInitialize;
