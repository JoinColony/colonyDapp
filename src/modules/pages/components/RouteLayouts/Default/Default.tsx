import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { RouteComponentProps } from '~pages/RouteLayouts';
import SubscribedColoniesList from '~dashboard/SubscribedColoniesList';
import SimpleNav from '../SimpleNav';
import HistoryNavigation from '../HistoryNavigation';
import UserNavigation from '../UserNavigation';

import { query700 as query } from '~styles/queries.css';
import styles from './Default.css';
import navStyles from '../SimpleNav/SimpleNav.css';

interface Props {
  children: ReactNode;
  routeProps?: RouteComponentProps;
}

const displayName = 'pages.Default';

const Default = ({
  children,
  routeProps: {
    hasBackLink = true,
    backRoute,
    backText,
    backTextValues,
    hasSubscribedColonies = true,
  } = {},
}: Props) => {
  const location = useLocation<{ hasBackLink?: boolean }>();
  const backLinkExists =
    hasBackLink === undefined
      ? location.state && location.state.hasBackLink
      : hasBackLink;
  const isMobile = useMediaQuery({ query });

  const SubscribedColonies = () =>
    hasSubscribedColonies ? (
      <div className={styles.coloniesList}>
        <SubscribedColoniesList path={location.pathname} />
      </div>
    ) : null;

  return (
    <div className={styles.main}>
      <SimpleNav>
        {backLinkExists && !isMobile && (
          <HistoryNavigation
            backRoute={backRoute}
            backText={backText}
            backTextValues={backTextValues}
            className={
              hasSubscribedColonies ? styles.history : styles.onlyHistory
            }
          />
        )}
        <div className={styles.content}>
          {isMobile ? (
            // Render the UserNavigation and SubscribedColoniesList in shared parent on mobile
            <div className={styles.head}>
              <div className={navStyles.nav}>
                <UserNavigation />
              </div>
              <SubscribedColonies />
            </div>
          ) : (
            <SubscribedColonies />
          )}
          <div className={styles.children}>{children}</div>
        </div>
      </SimpleNav>
    </div>
  );
};

Default.displayName = displayName;

export default Default;
