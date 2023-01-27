import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import InfoPopover from '~core/InfoPopover';
import Heading from '~core/Heading';
import { Colony, ColonySafe } from '~data/index';
import { useDialog } from '~core/Dialog';
import ControlSafeDialog from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';

import styles from './ColonySafes.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHome.ColonySafes.title',
    defaultMessage: 'Linked assets',
  },
});

interface Props {
  colony: Colony;
}

const displayName = 'dashboard.ColonyHome.ColonySafes';

const ColonySafes = ({ colony: { safes }, colony }: Props) => {
  const openControlSafeDialog = useDialog(ControlSafeDialog);
  const handleOpenControlSafeDialog = (safe: ColonySafe) =>
    openControlSafeDialog({ preselectedSafe: safe, colony });

  if (isEmpty(safes)) {
    return null;
  }

  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <FormattedMessage {...MSG.title} />
      </Heading>
      <ul>
        {safes.map((safe) => (
          <li className={styles.safeItem}>
            <InfoPopover
              key={`${safe.chainId}-${safe.contractAddress}`}
              safe={safe}
              openDialog={handleOpenControlSafeDialog}
              popperOptions={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [55, 10],
                    },
                  },
                ],
              }}
            >
              {({ id, isOpen, toggle, ref }) => (
                <button
                  className={classnames(styles.safeItemButton, {
                    [styles.safeItemToggledButton]: isOpen,
                  })}
                  onClick={toggle}
                  aria-describedby={isOpen ? id : undefined}
                  ref={ref}
                  type="button"
                >
                  {safe.safeName}
                </button>
              )}
            </InfoPopover>
          </li>
        ))}
      </ul>
    </div>
  );
};

ColonySafes.displayName = displayName;

export default ColonySafes;
