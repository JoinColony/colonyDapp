/* @flow */

const HTTP_PROTOCOL: string = 'http://';
const HTTPS_PROTOCOL: string = 'https://';

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
  string: string,
  maxCharLength: number,
) => {
  if (string.length > maxCharLength) {
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
export const capitalize = (word: string) =>
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
