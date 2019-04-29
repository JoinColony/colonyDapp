/* @flow */

export const isDev = process.env.NODE_ENV === 'development';

export const log = (
  error: Error | string,
  logger: any => void = console.error.bind(console),
) => (isDev ? logger(error) : null);

log.warn = (error: any) => log(error, console.warn.bind(console));

log.debug = (message: string) => log(message, console.info.bind(console));
