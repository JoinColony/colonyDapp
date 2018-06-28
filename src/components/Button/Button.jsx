/* @flow */

import type { Node } from 'react';
import type { IntlShape, MessageDescriptor } from 'react-intl';

import React from 'react';
import { injectIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import styles from './Button.css';

const displayName = 'core.Button';

type Appearance = {
  theme?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'underlinedBold' | 'blue',
  size?: 'large'
}

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Overwriting class name(s). Setting this will overwrite the `appearance` object */
  className?: string,
  /** Setting this to `true` will apply disabled styles via `aria-disabled` (disable interactions) */
  disabled?: boolean,
  /** Setting this to `true` will apply loading styles via `aria-busy` (show a spinner) */
  loading?: boolean,
  /** `children` to render (only works if `value` is not set) */
  children?: Node,
  /** `react-intl` object, so that we have access to the `formatMessage()` method */
  intl: IntlShape,
  /** Standard html title attribute. Can be a string or a `messageDescriptor` */
  title?: MessageDescriptor | string,
  /** A string or a `messageDescriptor` that make up the button's text label */
  value?: MessageDescriptor | string,
  /** Button type (button|submit) */
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
  disabled = false,
  intl: { formatMessage },
  loading = false,
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

export default injectIntl(Button);
