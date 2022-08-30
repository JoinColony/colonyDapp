import { MessageDescriptor, useIntl } from 'react-intl';
import React from 'react';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './InputStatus.css';

export interface Appearance {
  theme?: 'fat' | 'underlined' | 'minimal' | 'dotted';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'grey' | 'transparent';
  statusSchema?: 'info';
  size?: 'small' | 'medium';
  textSpace?: 'wrap';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Error text (if applicable) */
  error?: string | MessageDescriptor;

  /** Status text (if applicable) */
  status?: string | MessageDescriptor;

  /** Values for status text (react-intl interpolation) (if applicable) */
  statusValues?: SimpleMessageValues;
  touched?: boolean;
}

const displayName = 'InputStatus';

const InputStatus = ({
  appearance = {},
  error,
  status,
  statusValues,
  touched,
}: Props) => {
  const { formatMessage } = useIntl();
  const getErrorText = () => {
    switch (typeof error) {
      case 'object':
        return formatMessage(isArray(error) ? error.find((e) => e) : error);
      default:
        return error;
    }
  };
  const statusText =
    typeof status === 'object' ? formatMessage(status, statusValues) : status;
  const text = getErrorText() || statusText;
  const Element = appearance.direction === 'horizontal' ? 'span' : 'p';
  return (
    <Element
      className={getMainClasses(appearance, styles, {
        error: !!error,
        hidden: !text || (!!error && !isNil(touched) && !touched),
      })}
    >
      {text}
    </Element>
  );
};

InputStatus.displayName = displayName;

export default InputStatus;
