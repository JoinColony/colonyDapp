/* @flow */

import namehash from 'eth-ens-namehash-ms';

/**
 * Get an ENS domain name string from given parts.
 *
 * @param parts {string[]} One or more domain name parts, e.g. `'chris', 'user'`
 * @returns {string} An ENS domain name
 */
export const getENSDomainString = (...parts: Array<string>) =>
  `${parts.join('.')}.joincolony.eth`;

/**
 * Get a hashed ENS domain name from given parts.
 *
 * @param parts
 */
export const getHashedENSDomainString = (...parts: Array<string>) =>
  namehash.hash(getENSDomainString(...parts));
