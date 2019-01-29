/* @flow */

export type Query<I: *, R: *> = {
  execute: (args: I) => Promise<R>,
};
