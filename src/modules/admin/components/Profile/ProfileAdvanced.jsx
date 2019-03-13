/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { ColonyType, UserPermissionsType } from '~immutable';

import { useDataFetcher, useFeatureFlags } from '~utils/hooks';
import { ACTIONS } from '~redux';

import Heading from '~core/Heading';
import { DialogActionButton } from '~core/Button';

import { currentUserColonyPermissionsFetcher } from '../../../users/fetchers';
import { canEnterRecoveryMode } from '../../../users/selectors';
import { isInRecoveryMode, canBeUpgraded } from '../../../dashboard/selectors';

import styles from './ProfileAdvanced.css';

const MSG = defineMessages({
  labelVersion: {
    id: 'admin.Profile.ProfileAdvanced.labelVersion',
    defaultMessage: 'Colony Version',
  },
  labelId: {
    id: 'admin.Profile.ProfileAdvanced.labelId',
    defaultMessage: 'Colony ID',
  },
  buttonUpdate: {
    id: 'admin.Profile.ProfileAdvanced.buttonUpdate',
    defaultMessage: 'Upgrade',
  },
  buttonRecoveryMode: {
    id: 'admin.Profile.ProfileAdvanced.buttonRecoveryMode',
    defaultMessage: 'Turn on recovery Mode',
  },
  headingRecoveryMode: {
    id: 'admin.Profile.ProfileAdvanced.headingRecoveryMode',
    defaultMessage: 'Recovery Mode',
  },
  inRecoveryMode: {
    id: 'admin.Profile.ProfileAdvanced.inRecoveryMode',
    defaultMessage: `{inRecoveryMode, select,
      true {Colony is in recovery mode}
      false {Colony is not in recovery mode}
    }`,
  },
});

const displayName: string = 'admin.Profile.ProfileAdvanced';

type Props = {|
  colony: ColonyType,
|};

const ProfileAdvanced = ({ colony }: Props) => {
  const { given } = useFeatureFlags();

  const {
    isFetching,
    data: permissions,
    error,
  } = useDataFetcher<UserPermissionsType>(
    currentUserColonyPermissionsFetcher,
    [colony.ensName],
    [colony.ensName],
  );
  return (
    <div className={styles.main}>
      <section className={styles.section}>
        <div className={styles.withInlineButton}>
          <Heading
            appearance={{ size: 'small', margin: 'none' }}
            text={MSG.labelVersion}
          />
          <p className={styles.bigInfoText}>{colony.version}</p>
        </div>
        <DialogActionButton
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.buttonUpdate}
          dialog="UpgradeContractDialog"
          submit={ACTIONS.COLONY_VERSION_UPGRADE}
          success={ACTIONS.COLONY_VERSION_UPGRADE_SUCCESS}
          error={ACTIONS.COLONY_VERSION_UPGRADE_ERROR}
          values={{ ensName: colony.ensName }}
          disabled={!given(colony, canBeUpgraded)}
        />
      </section>
      <section className={styles.section}>
        <Heading
          appearance={{ size: 'small', margin: 'none' }}
          text={MSG.labelId}
        />
        <p className={styles.bigInfoText}>{colony.id}</p>
      </section>
      <section className={styles.section}>
        <div className={styles.withInlineButton}>
          <Heading
            appearance={{ size: 'small', margin: 'none' }}
            text={MSG.headingRecoveryMode}
          />
          <p className={styles.bigInfoText}>
            <FormattedMessage
              {...MSG.inRecoveryMode}
              values={{ inRecoveryMode: colony.inRecoveryMode }}
            />
          </p>
        </div>
        <DialogActionButton
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.buttonRecoveryMode}
          dialog="RecoveryModeDialog"
          submit={ACTIONS.COLONY_RECOVERY_MODE_ENTER}
          success={ACTIONS.COLONY_RECOVERY_MODE_ENTER_SUCCESS}
          error={ACTIONS.COLONY_RECOVERY_MODE_ENTER_ERROR}
          values={{ ensName: colony.ensName }}
          loading={isFetching}
          disabled={
            !!error ||
            given(colony, isInRecoveryMode) ||
            !given(permissions, canEnterRecoveryMode)
          }
        />
      </section>
    </div>
  );
};

ProfileAdvanced.displayName = displayName;

export default ProfileAdvanced;
