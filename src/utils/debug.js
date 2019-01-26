/* @flow */

export const isDev = process.env.NODE_ENV === 'development';

export const log = (error: Error | string) =>
  isDev ? console.error(error) : null;
