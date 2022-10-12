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
  isLastItem?: boolean;
  isLocked?: boolean;
}

const displayName = 'dashboard.ExpenditurePage.Payments.CollapseExpandButtons';

const CollapseExpandButtons = ({
  isExpanded,
  onToogleButtonClick,
  isLastItem,
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
          [styles.dividerInLastItem]: isLastItem,
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
