import React from 'react';
import { useMediaQuery } from 'react-responsive';

import NavLink from '~core/NavLink';

import { CrumbText } from './BreadCrumb';

import { query700 as query } from '~styles/queries.css';
import styles from './BreadCrumb.css';

interface Props {
  crumbText: CrumbText;
  crumbLink?: string;
  lastCrumb?: boolean;
}

const SingleCrumb = ({ crumbText, crumbLink, lastCrumb }: Props) => {
  const crumbTitle = typeof crumbText === 'string' ? crumbText : '';
  const isMobile = useMediaQuery({ query });
  const Chevron = () => <span className={styles.arrow}>&gt;</span>;

  if (lastCrumb) {
    return (
      <div className={styles.elementLast} title={crumbTitle}>
        <span className={styles.breadCrumble}>
          {crumbLink ? (
            <NavLink className={styles.invisibleLink} to={crumbLink}>
              {crumbText}
            </NavLink>
          ) : (
            crumbText
          )}
        </span>
      </div>
    );
  }
  return (
    <div className={styles.element} title={crumbTitle}>
      <span className={styles.breadCrumble}>
        {crumbLink ? (
          <NavLink className={styles.invisibleLink} to={crumbLink}>
            {crumbText}
          </NavLink>
        ) : (
          crumbText
        )}
        {isMobile && <Chevron />}
      </span>
      {!isMobile && <Chevron />}
    </div>
  );
};

SingleCrumb.displayName = 'BreadCrumb.SingleCrumb';

export default SingleCrumb;
