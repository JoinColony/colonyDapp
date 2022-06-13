import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { RouteComponentProps } from '~pages/RouteLayouts';
import SubscribedColoniesList from '~dashboard/SubscribedColoniesList';
import SimpleNav from '../SimpleNav';
import HistoryNavigation from '../HistoryNavigation';

import styles from './Default.css';
import navStyles from '../SimpleNav/SimpleNav.css';

import { mobile } from '~utils/mediaQueries';
import UserNavigation from '../UserNavigation';

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
  const isMobile = useMediaQuery({ query: mobile });

  return (
    <div className={styles.main}>
      <SimpleNav>
        {backLinkExists && (
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
              {hasSubscribedColonies && (
                <div className={styles.coloniesList}>
                  <SubscribedColoniesList />
                </div>
              )}
            </div>
          ) : (
            hasSubscribedColonies && (
              <div className={styles.coloniesList}>
                <SubscribedColoniesList />
              </div>
            )
          )}
          <div className={styles.children}>{children}</div>
        </div>
      </SimpleNav>
    </div>
  );
};

Default.displayName = displayName;

export default Default;
