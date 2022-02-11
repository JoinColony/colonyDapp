import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { RouteComponentProps } from '~pages/RouteLayouts';
import SimpleNav from '../SimpleNav';
import HistoryNavigation from '../HistoryNavigation';

import styles from './Default.css';

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
          <div className={styles.children}>{children}</div>
        </div>
      </SimpleNav>
    </div>
  );
};

Default.displayName = displayName;

export default Default;
