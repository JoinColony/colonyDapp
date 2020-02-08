import React, { ReactNode } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import { NavLink as NavLinkComponent, NavLinkProps } from 'react-router-dom';

import { SimpleMessageValues } from '~types/index';

import styles from './NavLink.css';

interface Props extends NavLinkProps {
  /** className to add to the existing classNames when `to` matches the current route (react-router's "activeClassName") */
  activeClassName?: string;

  /** NavLink children to render inside the link */
  children?: ReactNode;

  /** path to go to (react-router's "to") */
  to: string | any;

  /** A string or a `messageDescriptor` that make up the nav link's text */
  text?: MessageDescriptor | string;

  /** Values for text (react-intl interpolation) */
  textValues?: SimpleMessageValues;
}

const NavLink = ({
  activeClassName = styles.active,
  children,
  text,
  textValues,
  to,
  ...linkProps
}: Props) => {
  const { formatMessage } = useIntl();

  const linkText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);

  return (
    <NavLinkComponent to={to} activeClassName={activeClassName} {...linkProps}>
      {linkText || children}
    </NavLinkComponent>
  );
};

export default NavLink;
