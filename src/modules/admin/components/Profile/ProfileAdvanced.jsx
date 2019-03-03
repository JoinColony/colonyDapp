/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { ColonyType } from '~immutable';

import { useFeatureFlags } from '~utils/hooks';
import { ACTIONS } from '~redux';

import Heading from '~core/Heading';
import Button, { DialogActionButton } from '~core/Button';

import { isInRecoveryMode } from '../../../dashboard/selectors';

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
    defaultMessage: 'Update',
  },
  buttonRecovery: {
    id: 'admin.Profile.ProfileAdvanced.buttonRecovery',
    defaultMessage: 'Recovery Mode',
  },
});

const displayName: string = 'admin.Profile.ProfileAdvanced';

type Props = {|
  colony: ColonyType,
|};

const ProfileAdvanced = ({ colony }: Props) => {
  const { given } = useFeatureFlags();
  return (
    <div className={styles.main}>
      <section className={styles.section}>
        <div className={styles.withInlineButton}>
          <Heading
            appearance={{ size: 'small', margin: 'none' }}
            text={MSG.labelVersion}
          />
          <p className={styles.advancedNumeric}>{colony.version}</p>
        </div>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.buttonUpdate}
          // eslint-disable-next-line no-console
          onClick={() => console.log(`[${displayName}] Updating the colony`)}
        />
      </section>
      <section className={styles.section}>
        <Heading
          appearance={{ size: 'small', margin: 'none' }}
          text={MSG.labelId}
        />
        <p className={styles.advancedNumeric}>{colony.id}</p>
      </section>
      <DialogActionButton
        appearance={{ theme: 'blue' }}
        text={MSG.buttonRecovery}
        dialog="RecoveryModeDialog"
        submit={ACTIONS.COLONY_RECOVERY_MODE_ENTER}
        success={ACTIONS.COLONY_RECOVERY_MODE_ENTER_SUCCESS}
        error={ACTIONS.COLONY_RECOVERY_MODE_ENTER_ERROR}
        values={{ ensName: colony.ensName }}
        disabled={given(colony, isInRecoveryMode)}
      />
    </div>
  );
};

ProfileAdvanced.displayName = displayName;

export default ProfileAdvanced;
