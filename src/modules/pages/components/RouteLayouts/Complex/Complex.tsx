import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { RouteComponentProps } from '~pages/RouteLayouts';
import SubscribedColoniesList from '~dashboard/SubscribedColoniesList';
import SimpleNav from '../SimpleNav';
import HistoryNavigation from '../HistoryNavigation';

import styles from './Complex.css';

interface Props {
  children: ReactNode;
  routeProps?: RouteComponentProps;
}

const displayName = 'pages.Complex';

const Complex = ({
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
          {hasSubscribedColonies && (
            <div className={styles.coloniesList}>
              <SubscribedColoniesList />
            </div>
          )}
          <div className={styles.children}>{children}</div>
        </div>
      </SimpleNav>
    </div>
  );
};

Complex.displayName = displayName;

export default Complex;
