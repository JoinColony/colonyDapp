import React, { KeyboardEvent, useCallback } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import NavLink from '~core/NavLink';
import { ENTER } from '~types/index';

import styles from './NavItem.css';

interface Props {
  disabled?: boolean;
  extra?: MessageDescriptor;
  linkTo: string;
  showDot?: boolean;
  text: MessageDescriptor;
}

const displayName = 'dashboard.ColonyNavigation.NavItem';

const NavItem = ({
  disabled = false,
  extra: extraProp,
  linkTo,
  showDot = false,
  text: textProp,
}: Props) => {
  const { formatMessage } = useIntl();

  const handleLinkKeyDown = useCallback(
    (evt: KeyboardEvent<HTMLAnchorElement>) => {
      if (disabled && evt.key === ENTER) {
        evt.preventDefault();
      }
    },
    [disabled],
  );

  const text = formatMessage(textProp);
  const extra = extraProp ? formatMessage(extraProp) : undefined;
  const classNames = [styles.main];
  if (showDot) {
    classNames.push(styles.showDot);
  }
  return (
    <NavLink
      activeClassName={styles.active}
      aria-disabled={disabled}
      className={classNames.join(' ')}
      onKeyDown={handleLinkKeyDown}
      to={linkTo}
    >
      <span className={styles.text}>{text}</span>
      {extra && <span className={styles.extra}>{extra}</span>}
    </NavLink>
  );
};

NavItem.displayName = displayName;

export default NavItem;
