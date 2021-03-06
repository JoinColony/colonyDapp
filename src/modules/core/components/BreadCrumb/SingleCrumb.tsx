import React from 'react';

import NavLink from '~core/NavLink';

import styles from './BreadCrumb.css';

interface Props {
  crumbText: string;
  crumbLink?: string;
  lastCrumb?: boolean;
}

const SingleCrumb = ({ crumbText, crumbLink, lastCrumb }: Props) => {
  if (lastCrumb) {
    return (
      <div className={styles.elementLast} title={crumbText}>
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
    <div className={styles.element} title={crumbText}>
      <span className={styles.breadCrumble}>
        {crumbLink ? (
          <NavLink className={styles.invisibleLink} to={crumbLink}>
            {crumbText}
          </NavLink>
        ) : (
          crumbText
        )}
      </span>
      <span className={styles.arrow}>&gt;</span>
    </div>
  );
};

SingleCrumb.displayName = 'BreadCrumb.SingleCrumb';

export default SingleCrumb;
