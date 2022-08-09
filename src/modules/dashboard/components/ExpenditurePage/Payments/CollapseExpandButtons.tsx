import React from 'react';
import classNames from 'classnames';

import Icon from '~core/Icon';
import styles from './Payments.css';
import { MSG } from './Payments';

interface Props {
  isExpanded: boolean;
  onToogleButtonClick: () => void;
  isLastitem?: boolean;
  isLocked?: boolean;
}

const displayName = 'dashboard.ExpenditurePage.CollapseExpandButtons';

const CollapseExpandButtons = ({
  isExpanded,
  onToogleButtonClick,
  isLastitem,
  isLocked,
}: Props) => {
  return isExpanded ? (
    <>
      <Icon
        name="collapse"
        onClick={onToogleButtonClick}
        className={styles.signWrapper}
        title={MSG.minusIconTitle}
      />
      <div
        className={classNames(styles.verticalDivider, {
          [styles.dividerInLastItem]: isLastitem,
          [styles.dividerInLockedItem]: isLocked,
        })}
      />
    </>
  ) : (
    <Icon
      name="expand"
      onClick={onToogleButtonClick}
      className={styles.signWrapper}
      title={MSG.plusIconTitle}
    />
  );
};

CollapseExpandButtons.displayName = displayName;

export default CollapseExpandButtons;
