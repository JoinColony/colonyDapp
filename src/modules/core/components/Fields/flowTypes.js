/* @flow */

import type { MessageDescriptor } from 'react-intl';
import type { FieldProps } from 'redux-form';
import type { Appearance } from '~types/css';

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

export type CleaveHTMLInputElement = HTMLInputElement & { rawValue: string };

export type IntlFormatter = (prop?: MessageDescriptor | string, values?: { [string]: string }) => string;

export type Utils = {
  getIntlFormatted: IntlFormatter,
  reset: () => void,
};

export type Option = {
  value: string,
  label: string,
};

export type FieldComponentProps<CustomProps: {} = Object> = FieldProps & {
  appearance?: Appearance,
  elementOnly?: boolean,
  error?: string,
  hasError: boolean,
  help: string,
  inputProps: {
    id: string,
    placeholder: string,
    title: string,
  },
  label: string,
  options?: Array<Option>,
  passthroughProps: CustomProps,
  utils: Utils,
};
