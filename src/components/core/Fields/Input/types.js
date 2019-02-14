/* @flow */

/* Cleave.js options. This is not an extensive list. Just the ones we're using for now */
/* Full list: https://github.com/nosir/cleave.js/blob/master/doc/options.md */
export type CleaveOptions = {
  prefix?: string,
  rawValueTrimPrefix?: boolean,
  numeral?: boolean,
  delimiter?: string,
  numeralThousandsGroupStyle?: string,
  numeralDecimalScale?: number,
  numeralPositiveOnly?: boolean,
};
