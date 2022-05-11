import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { getMainClasses } from '~utils/css';

import HistoryNavigation from '../HistoryNavigation';
import UserNavigation from '../UserNavigation';
import { RouteComponentProps } from '~pages/RouteLayouts';

import styles from './NavBar.css';

const displayName = 'pages.NavBar';

interface Props {
  children: ReactNode;
  routeProps?: RouteComponentProps;
}

const NavBar = ({
  routeProps: {
    className,
    hasBackLink = true,
    backRoute,
    backText,
    backTextValues,
  } = {},
  children,
}: Props) => {
  const location = useLocation<{ hasBackLink?: boolean }>();

  const backLinkExists =
    hasBackLink === undefined
      ? location.state && location.state.hasBackLink
      : hasBackLink;

  return (
    <div className={className || getMainClasses({}, styles)}>
      <div className={styles.wrapper}>
        <nav className={styles.navigation}>
          {backLinkExists && (
            <div className={styles.history}>
              <HistoryNavigation
                backRoute={backRoute}
                backText={backText}
                backTextValues={backTextValues}
              />
            </div>
          )}
          <div className={styles.user}>
            <UserNavigation />
          </div>
        </nav>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

NavBar.displayName = displayName;

export default NavBar;
