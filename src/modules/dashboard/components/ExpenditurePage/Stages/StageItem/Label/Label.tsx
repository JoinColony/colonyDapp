import { ColonyRole } from '@colony/colony-js';
import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import PermissionsLabel from '~core/PermissionsLabel';

import styles from './Label.css';

const MSG = defineMessages({
  updatedByArbitrator: {
    id: 'dashboard.ExpenditurePage.Stages.StageItem.Label.updatedByArbitrator',
    defaultMessage: 'Value updated by arbitrator',
  },
  label: {
    id: 'dashboard.ExpenditurePage.Stages.StageItem.Label.label',
    defaultMessage: '{label} {icon}',
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages.StageItem.Label';

interface Props {
  label: string | MessageDescriptor;
}

const Label = ({ label }: Props) => {
  // role is temporary value
  const role = ColonyRole.Arbitration;

  return (
    <div className={styles.labelComponent}>
      <FormattedMessage
        {...MSG.label}
        values={{
          label:
            typeof label === 'object' && label?.id ? (
              <FormattedMessage {...label} />
            ) : (
              label
            ),
          icon: (
            <PermissionsLabel
              permission={role}
              appearance={{ theme: 'white' }}
              infoMessage={MSG.updatedByArbitrator}
              minimal
            />
          ),
        }}
      />
    </div>
  );
};

Label.displayName = displayName;

export default Label;
