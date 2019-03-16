/* @flow */

import { PAGES_MAINNET_BANNER_DISMISSED } from '../../modules/pages/constants';

export const isBannerDismissed = () =>
  localStorage.getItem(PAGES_MAINNET_BANNER_DISMISSED) === 'true' || false;

export const dismissBanner = () =>
  localStorage.setItem(PAGES_MAINNET_BANNER_DISMISSED, 'true');
