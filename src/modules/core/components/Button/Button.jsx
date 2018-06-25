/* @flow */

import React from 'react';
import type { Node } from 'react';
import type { IntlShape, MessageDescriptor } from 'react-intl';
import type { Appearance } from '~types/css';

import { getMainClasses } from '~utils/css';

import styles from './Button.css';

const displayName = 'core.Button';

type Props = {
  appearance?: Appearance, // Appearance object
  className?: string, // Overwriting class name(s). Setting this will overwrite `theme` and `size` values.
  disabled?: boolean, // Setting this to `true` will apply disabled styles via `aria-disabled` (disable interactions)
  loading?: boolean, // Setting this to `true` will apply loading styles via `aria-busy` (show a spinner)
  children?: Node, // Acts exactly the way as `value`
  intl: IntlShape, // `react-intl` object, so that we have access to the `formatMessage()` method.
  title?: MessageDescriptor | string, // Standard html title element. Can be a string or a `messageDescriptor`.
  value?: MessageDescriptor | string, // A string or a `messageDescriptor` that make up the button's text label
  type: string,
};

/*
 * The button type rule recently intoduced in the airbnb ruleset has some funky
 * functionality right now.
 *
 * See this for context: https://github.com/yannickcr/eslint-plugin-react/issues/1555
 *
 * But in combination with Flow and react-intl you can't get it to actually work
 * in this component using default props.
 *
 * @TODO Enable react/button-has-type rule
 *
 * After a non-workaround has been found for this.
 */
/* eslint-disable react/button-has-type */
const Button = ({
  appearance,
  children,
  className,
  disabled,
  intl: { formatMessage },
  loading,
  title,
  value,
  type = 'button',
  ...props
}: Props) => {
  const titleText =
    typeof title == 'string' ? title : title && formatMessage(title);
  const valueText =
    typeof value == 'string' ? value : value && formatMessage(value);
  return (
    <button
      className={className || getMainClasses(appearance, styles)}
      disabled={disabled || loading}
      aria-busy={loading}
      title={titleText}
      type={type}
      {...props}
    >
      {valueText || children}
    </button>
  );
};

Button.displayName = displayName;

export default Button;
