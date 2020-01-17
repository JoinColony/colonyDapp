/* eslint-disable react/button-has-type */

import React, { ReactNode } from 'react';
import {
  IntlShape,
  MessageDescriptor,
  MessageValues,
  injectIntl,
} from 'react-intl';

import { NavLink } from 'react-router-dom';
import { useMainClasses } from '~utils/hooks';
import styles from './Button.css';

const displayName = 'Button';

export interface Appearance {
  theme?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'dangerLink'
    | 'ghost'
    | 'underlinedBold'
    | 'blue';
  size?: 'small' | 'medium' | 'large';
}

export interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** `children` to render (only works if `value` is not set) */
  children?: ReactNode;

  /** Overwriting class name(s). Setting this will overwrite the `appearance` object */
  className?: string;

  /** Setting this to `true` will apply disabled styles via `aria-disabled` (disable interactions) */
  disabled?: boolean;

  /** Pass a ref to the `<button>` element */
  innerRef?: (ref: HTMLElement | null) => void;

  /** Use a link instead of a button. Like ReactRouter's `to` property */
  linkTo?: string;

  /** Setting this to `true` will apply loading styles via `aria-busy` (show a spinner) */
  loading?: boolean;

  /** Standard html title attribute. Can be a string or a `messageDescriptor` */
  title?: MessageDescriptor | string;

  /** Button type (button|submit) */
  type?: 'submit' | 'reset' | 'button';

  /** A string or a `messageDescriptor` that make up the button's text label */
  text?: MessageDescriptor | string;

  /** Values for loading text (react-intl interpolation) */
  textValues?: MessageValues;

  /** @ignore injected by `react-intl` */
  intl: IntlShape;
}

/*
 * The button type rule recently intoduced in the airbnb ruleset has some funky
 * functionality right now.
 *
 * See this for context: https://github.com/yannickcr/eslint-plugin-react/issues/1555
 *
 * But in combination with Flow and react-intl you can't get it to actually work
 * in this component using default props.
 *
 * TODO Enable react/button-has-type rule
 *
 * After a non-workaround has been found for this.
 */
const Button = ({
  appearance = { theme: 'primary' },
  children,
  className,
  disabled = false,
  innerRef,
  intl: { formatMessage },
  linkTo,
  loading = false,
  title,
  text,
  textValues,
  type = 'button',
  ...props
}: Props) => {
  const titleText =
    typeof title == 'string' ? title : title && formatMessage(title);
  const buttonText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);

  const classNames = useMainClasses(appearance, styles, className);

  if (linkTo) {
    return (
      <NavLink className={classNames} to={linkTo} {...props}>
        {buttonText || children}
      </NavLink>
    );
  }

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      aria-busy={loading}
      title={titleText}
      type={type}
      ref={innerRef}
      {...props}
    >
      {buttonText || children}
    </button>
  );
};

Button.displayName = displayName;

export default injectIntl(Button);
