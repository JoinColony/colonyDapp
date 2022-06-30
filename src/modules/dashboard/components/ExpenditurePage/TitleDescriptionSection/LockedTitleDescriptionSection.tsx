import React from 'react';
import classNames from 'classnames';

import styles from './TitleDescriptionSection.css';

interface Props {
  title?: string;
  description?: string;
}

const LockedTitleDescriptionSection = ({ title, description }: Props) => {
  return (
    <div className={styles.lockedSectionContainer}>
      {/* "Exp - 25" is temporary value, needs to be changed to fetched value, id? */}
      <div className={styles.number}>Exp - 25</div>
      <div className={styles.titleContainer}>
        <div className={classNames(styles.title, styles.lockedTitle)}>
          {title}
        </div>
      </div>
      <div className={classNames(styles.descriptionContainer)}>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
};

export default LockedTitleDescriptionSection;
