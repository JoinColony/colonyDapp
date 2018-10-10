/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';

import styles from './ProfileAdvanced.css';

import type { ColonyType } from '~types/colony';

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

type Props = {
  colony: ColonyType,
};

const ProfileAdvanced = ({ colony: { version, id } }: Props) => (
  <div className={styles.main}>
    <section className={styles.section}>
      <div className={styles.withInlineButton}>
        <Heading
          appearance={{ size: 'small', margin: 'none' }}
          text={MSG.labelVersion}
        />
        <p className={styles.advancedNumeric}>{version}</p>
      </div>
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        text={MSG.buttonUpdate}
        onClick={() => console.log(`[${displayName}] Updating the colony`)}
      />
    </section>
    <section className={styles.section}>
      <Heading
        appearance={{ size: 'small', margin: 'none' }}
        text={MSG.labelId}
      />
      <p className={styles.advancedNumeric}>{id}</p>
    </section>
    {/* I have no idea how the recovery mode should work, so for now,
      * I'm assuming we just need a button for it
      */}
    <Button
      appearance={{ theme: 'blue' }}
      text={MSG.buttonRecovery}
      onClick={() => console.log(`[${displayName}] Entering recovery mode`)}
    />
  </div>
);

ProfileAdvanced.displayName = displayName;

export default ProfileAdvanced;
