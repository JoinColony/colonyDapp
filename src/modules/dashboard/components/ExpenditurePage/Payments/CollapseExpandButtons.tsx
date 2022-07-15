import React from 'react';
import classNames from 'classnames';

import Icon from '~core/Icon';
import styles from './Payments.css';
import { MSG } from './Payments';

interface Props {
  isExpanded: boolean;
  onToogleButtonClick: () => void;
  isLastitem?: boolean;
}

const displayName = 'dashboard.ExpenditurePage.CollapseExpandButtons';

const CollapseExpandButtons = ({
  isExpanded,
  onToogleButtonClick,
  isLastitem,
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
