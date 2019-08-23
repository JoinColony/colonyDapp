import { addressValidator } from '@colony/purser-core/validators';
import { addressNormalizer } from '@colony/purser-core/normalizers';

import { Address } from '~types/index';

const HTTP_PROTOCOL = 'http://';
const HTTPS_PROTOCOL = 'https://';

/*
  Removes line breaks and replaces them with spaces
*/
export const rmLineBreaks = (str: string) => str.replace(/(\r\n|\n|\r)/gm, ' ');

/**
 * Cut a string short (based on maxCharLength) and append an ellipsis at the end `...`
 *
 * @method multiLineTextEllipsis
 *
 * @param {string} string the string to check / cut short
 * @param {number} maxCharLength the maximum number of characters allowed
 *
 * @return {string} based on maxCharLength either the cut down string or the original one
 */
export const multiLineTextEllipsis = (
  string: string | null,
  maxCharLength: number,
) => {
  if (string && string.length > maxCharLength) {
    return `${string.substring(0, maxCharLength)}...`;
  }
  return string;
};

/**
 * Display the file size in human readable form, appending correct suffixes
 *
 * @method humanReadableFileSize
 *
 * @param {number} size the base size (in bytes) to transform
 *
 * @return {string} the size string in human reabled form with suffix appended
 */
export const humanReadableFileSize = (size: number) => {
  const index = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / 1024 ** index).toFixed(2)} ${
    ['B', 'kB', 'MB', 'GB', 'TB'][index]
  }`;
};

/**
 * Capitalize a word (converts the first letter of the word to upper case)
 *
 * @method capitalize
 *
 * @param {string} word The word / string to capitalize
 * @return {string} The capitalized string
 */
export const capitalize = (word: string): string =>
  word && word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Strip the normal and secure website protocol from the start of a string.
 * If will only check for the specific 'http' and 'https' strings and strip them out,
 * otherwise it will just return the original string.
 *
 * Most use cases would be do display just to domain (and path) part of a website
 *
 * @method stripProtocol
 *
 * @param {string} urlString The string to remove the protocol from
 *
 * @return {string} The new string (stripped of the protocol) or the original one
 */
export const stripProtocol = (urlString: string) =>
  (urlString.startsWith(HTTP_PROTOCOL) &&
    urlString.replace(HTTP_PROTOCOL, '')) ||
  (urlString.startsWith(HTTPS_PROTOCOL) &&
    urlString.replace(HTTPS_PROTOCOL, '')) ||
  urlString;

export type AddressElements = {
  header: string;
  start: string;
  middle: string;
  end: string;
};

/**
 * Split an BIP32 address to highlight start and end sections,
 * hidden by a configurable string mask
 *
 * @NOTE We also validate the address here. If it's not correct this will throw, but we catch it and
 * just return the error message in that case
 *
 * @method splitAddress
 *
 * @param {string} address The address to mask (must be valid!)
 *
 * @return {array} The split address in an array of strings
 */
export const splitAddress = (address: Address): AddressElements | Error => {
  try {
    addressValidator(address);
    const HEX_HEADER = '0x';
    const rawAddress: string = addressNormalizer(address, false);
    const addressStart: string = rawAddress.slice(0, 4);
    const addressMiddle: string = rawAddress.slice(4, -4);
    const addressEnd: string = rawAddress.slice(-4);
    return {
      header: HEX_HEADER,
      start: `${addressStart}`,
      middle: `${addressMiddle}`,
      end: addressEnd,
    };
  } catch (caughtError) {
    return caughtError;
  }
};
