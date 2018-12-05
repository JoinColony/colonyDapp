/* @flow */

import type { Node } from 'react';
import type { IntlShape, MessageDescriptor, MessageValues } from 'react-intl';
import type { LocationShape } from 'react-router-dom';

import React from 'react';
import { injectIntl } from 'react-intl';
import { NavLink as NavLinkComponent } from 'react-router-dom';

import styles from './NavLink.css';

type Props = {
  /** className to add to the existing classNames when `to` matches the current route (react-router's "activeClassName") */
  activeClassName?: string,
  /** NavLink children to render inside the link */
  children?: Node,
  /** path to go to (react-router's "to") */
  to: string | LocationShape,
  /** A string or a `messageDescriptor` that make up the nav link's text */
  text?: MessageDescriptor | string,
  /** Values for text (react-intl interpolation) */
  textValues?: MessageValues,
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

const NavLink = ({
  activeClassName = styles.active,
  children,
  intl: { formatMessage },
  text,
  textValues,
  to,
  ...linkProps
}: Props) => {
  const linkText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);

  return (
    <NavLinkComponent to={to} activeClassName={activeClassName} {...linkProps}>
      {linkText || children}
    </NavLinkComponent>
  );
};

export default injectIntl(NavLink);
