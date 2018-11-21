/* @flow */

export const isDev = process.env.NODE_ENV === 'development';

export const log = (error: Error) => (isDev ? console.error(error) : null);
