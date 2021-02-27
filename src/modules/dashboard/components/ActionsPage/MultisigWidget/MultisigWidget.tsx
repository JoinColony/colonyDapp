import React, { ReactNode, useState, RefObject } from 'react';
import { ColonyRole } from '@colony/colony-js';
import { nanoid } from 'nanoid';
import { defineMessages, FormattedMessage } from 'react-intl';

import HookedUserAvatar from '~users/HookedUserAvatar';
import PermissionsLabel from '~core/PermissionsLabel';
import ProgressBar from '~core/ProgressBar';
import { ActionButton } from '~core/Button';

import {
  Colony,
  useGetRecoveryStorageSlotLazyQuery,
  useLoggedInUser,
} from '~data/index';
import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';

import styles from './MultisigWidget.css';

const displayName = 'dashboard.ActionsPage.MultisigWidget';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ActionsPage.MultisigWidget.title',
    defaultMessage: `Members with {permissionLabel} permission`,
  },
  progressBarLabel: {
    id: 'dashboard.ActionsPage.MultisigWidget.progressBarLabel',
    defaultMessage: `{value} of {max} signatures {totalRequired}`,
  },
  totalRequired: {
    id: 'dashboard.ActionsPage.MultisigWidget.totalRequired',
    defaultMessage: `({required} required)`,
  },
});

const UserAvatar = HookedUserAvatar({ fetchUser: true });

interface Props {
  colony: Colony;
  startBlock?: number;
  scrollToRef?: RefObject<HTMLInputElement>;
}

const MultisigWidget = ({ colony: { colonyAddress } }: Props) => {
  const { username, ethereal } = useLoggedInUser();

  const hasRegisteredProfile = !!username && !ethereal;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <FormattedMessage
          {...MSG.title}
          values={{
            permissionLabel: (
              <PermissionsLabel permission={ColonyRole.Recovery} />
            ),
          }}
        />
      </div>
      <div className={styles.avatars}>
        {[...new Array(17)].map((_, index) => {
          // @TODO get status for address
          const approved = index % 2 === 0;
          return (
            <div>
              <UserAvatar
                size="s"
                address="0xb77D57F4959eAfA0339424b83FcFaf9c15407461"
                notSet={false}
                showInfo
              />
              <span
                className={`${styles.status} ${
                  approved && styles.statusApproved
                }`}
              />
            </div>
          );
        })}
      </div>
      <p className={styles.progressBarLabel}>
        <FormattedMessage
          {...MSG.progressBarLabel}
          values={{
            value: 5,
            max: 10,
            totalRequired: (
              <span className={styles.totalRequired}>
                <FormattedMessage
                  {...MSG.totalRequired}
                  values={{ required: 8 }}
                />
              </span>
            ),
          }}
        />
      </p>
      <ProgressBar value={5} max={18} />
      <div className={styles.controls}>
        {hasRegisteredProfile && (
          <ActionButton
            appearance={{ theme: 'primary', size: 'medium' }}
            submit={ActionTypes.COLONY_ACTION_GENERIC}
            error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
            success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
            // transform={transform}
            text={{ id: 'button.approve' }}
          />
        )}
      </div>
    </div>
  );
};

MultisigWidget.displayName = displayName;

export default MultisigWidget;
