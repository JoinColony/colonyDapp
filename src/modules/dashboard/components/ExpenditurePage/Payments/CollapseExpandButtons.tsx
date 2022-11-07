import React from 'react';
import classNames from 'classnames';
import { defineMessages, useIntl } from 'react-intl';

import Icon from '~core/Icon';

import styles from './Payments.css';

const MSG = defineMessages({
  minusIconTitle: {
    id: `dashboard.ExpenditurePage.Payments.CollapseExpandButtons.minusIconTitle`,
    defaultMessage: 'Collapse a single {itemName} settings',
  },
  plusIconTitle: {
    id: `dashboard.ExpenditurePage.Payments.CollapseExpandButtons.plusIconTitle`,
    defaultMessage: 'Expand a single {itemName} settings',
  },
});

interface Props {
  isExpanded: boolean;
  onToogleButtonClick: () => void;
  isLastItem?: boolean;
  isLocked?: boolean;
  itemName?: string;
}

const displayName = 'dashboard.ExpenditurePage.Payments.CollapseExpandButtons';

const CollapseExpandButtons = ({
  isExpanded,
  onToogleButtonClick,
  isLastItem,
  isLocked,
  itemName = 'item',
}: Props) => {
  const { formatMessage } = useIntl();

  return isExpanded ? (
    <>
      <Icon
        name="collapse"
        onClick={onToogleButtonClick}
        className={styles.signWrapper}
        title={formatMessage(MSG.minusIconTitle, { itemName })}
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
      title={formatMessage(MSG.plusIconTitle, { itemName })}
    />
  );
};

CollapseExpandButtons.displayName = displayName;

export default CollapseExpandButtons;
