import React from 'react';
import classNames from 'classnames';
import { defineMessages } from 'react-intl';

import Icon from '~core/Icon';

import styles from './Payments.css';

const MSG = defineMessages({
  minusIconTitle: {
    id: `dashboard.ExpenditurePage.Payments.CollapseExpandButtons.minusIconTitle`,
    defaultMessage: 'Collapse a single recipient settings',
  },
  plusIconTitle: {
    id: `dashboard.ExpenditurePage.Payments.CollapseExpandButtons.plusIconTitle`,
    defaultMessage: 'Expand a single recipient settings',
  },
});

interface Props {
  isExpanded: boolean;
  onToogleButtonClick: () => void;
  isLastitem?: boolean;
  isLocked?: boolean;
}

const displayName = 'dashboard.ExpenditurePage.Payments.CollapseExpandButtons';

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
