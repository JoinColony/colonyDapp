import { defineMessages } from 'react-intl';
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import Alert from '~core/Alert';
import { useLoggedInUser } from '~data/index';
import { getMainClasses } from '~utils/css';

import HistoryNavigation from './HistoryNavigation';
import UserNavigation from './UserNavigation';
import { RouteComponentProps } from './index';

import styles from './NavBar.css';

const displayName = 'pages.NavBar';

const MSG = defineMessages({
  mainnetAlert: {
    id: `pages.NavBar.mainnetAlert`,
    defaultMessage:
      /* eslint-disable-next-line max-len */
      'Heads up! Colony is a beta product on the Ethereum mainnet. Please be careful.',
  },
});

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
  const { username } = useLoggedInUser();
  const location = useLocation();

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
        <main className={styles.content}>
          {children}
          {!username && (
            <div className={styles.alertBanner}>
              <Alert
                appearance={{
                  theme: 'danger',
                  borderRadius: 'round',
                }}
                text={MSG.mainnetAlert}
                isDismissible
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

NavBar.displayName = displayName;

export default NavBar;
