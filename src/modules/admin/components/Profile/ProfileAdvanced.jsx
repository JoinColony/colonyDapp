/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { ColonyType } from '~immutable';
import type { OpenDialog } from '~core/Dialog/types';

import { useFeatureFlags } from '~utils/hooks';

import Heading from '~core/Heading';
import Button from '~core/Button';

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
  openDialog: OpenDialog,
|};

const ProfileAdvanced = ({ colony, openDialog }: Props) => {
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
      {/* I have no idea how the recovery mode should work, so for now,
       * I'm assuming we just need a button for it
       */}
      <Button
        appearance={{ theme: 'blue' }}
        text={MSG.buttonRecovery}
        onClick={() =>
          openDialog('RecoveryModeDialog')
            .afterClosed()
            /*
             * @TODO Wire up setting the Colony into Recovery Mode
             */
            .then(() =>
              /* eslint-disable-next-line no-console */
              console.log(`[${displayName}] Colony set to Recovery Mode!`),
            )
        }
        disabled={given(colony, isInRecoveryMode)}
      />
    </div>
  );
};

ProfileAdvanced.displayName = displayName;

export default ProfileAdvanced;
