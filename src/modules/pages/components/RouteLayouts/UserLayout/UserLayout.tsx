import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router';

import { RouteComponentProps } from '~pages/RouteLayouts';
import SubscribedColoniesList from '~dashboard/SubscribedColoniesList';

import UserNavigation from '../UserNavigation';
import SimpleNav from '../SimpleNav';

import { query700 as query } from '~styles/queries.css';
import styles from './UserLayout.css';
import navStyles from '../SimpleNav/SimpleNav.css';
import { useLoggedInUser } from '~data/helpers';

interface Props {
  routeProps?: RouteComponentProps;
  children: React.ReactNode;
}

const UserLayout = ({
  children,
  routeProps: { hasSubscribedColonies = true } = {},
}: Props) => {
  const isMobile = useMediaQuery({ query });
  const loggedInUser = useLoggedInUser();
  const { pathname } = useLocation();

  return (
    <SimpleNav>
      {isMobile && (
        <div className={styles.head}>
          <div className={navStyles.nav}>
            <UserNavigation />
          </div>
          {hasSubscribedColonies && (
            <div className={styles.coloniesList}>
              <SubscribedColoniesList
                path={pathname}
                loggedInUser={loggedInUser}
              />
            </div>
          )}
        </div>
      )}
      {children}
    </SimpleNav>
  );
};

const displayName = 'pages.RouteLayouts.UserLayout';
UserLayout.displayName = displayName;

export default UserLayout;
