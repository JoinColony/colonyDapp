import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection, InputLabel } from '~core/Fields';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { Colony } from '~data/index';

import styles from './LockedProtectors.css';
import { ValuesType } from '~pages/IncorporationPage/types';

export const MSG = defineMessages({
  protectors: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedProtectors.protectors`,
    defaultMessage: 'Protectors',
  },
  protectorsTooltip: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedProtectors.protectorsTooltip`,
    defaultMessage: `A Protector's role in a DAO legal corporation is to ratify the decisions of the DAO. Their purpose is to act on behalf of the DAO and handle legal the required administration. Learn more`,
  },
  unverified: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedProtectors.unverified`,
    defaultMessage: 'Unverified',
  },
  verified: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedProtectors.verified`,
    defaultMessage: 'Verified',
  },
  mainContact: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedProtectors.mainContact`,
    defaultMessage: 'Main contact',
  },
  signing: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedProtectors.signing`,
    defaultMessage: 'Signing',
  },
  mainContactTooltip: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedProtectors.mainContactTooltip`,
    defaultMessage: `The main contact is required during the incorporation process and is also required to use their delivery address details for the registration.`,
  },
  signOptionTooltip: {
    id: `dashboard.DAOIncorporation.IncorporationForm.LockedProtectors.signOptionTooltip`,
    defaultMessage: `Decide the requirements as to how many Protectors are required to sign legal documents to enact the decisions of a DAO.`,
  },
});

const displayName = `dashboard.DAOIncorporation.IncorporationForm.LockedProtectors`;

export interface Props {
  protectors: ValuesType['protectors'];
  colony: Colony;
}

const LockedProtectors = () => {
  return (
    <>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.wrapper}>
          <div className={styles.protectorsLabelWrapper}>
            <div className={styles.label}>
              <FormattedMessage {...MSG.protectors} />
            </div>
            <QuestionMarkTooltip tooltipText={MSG.protectorsTooltip} />
          </div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        {/* {protectors?.map((protector) => {
          return (
          <div className={styles.userAvatarContainer}>
            <UserAvatar address={walletAddress} size="xs" notSet={false} />
            <div className={styles.userName}>
              <UserMention username={username || ''} />
            </div>
          </div>
        )})} */}
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.row}>
          <InputLabel label={MSG.mainContact} />
          {/* <div className={styles.userAvatarContainer}>
            <UserAvatar address={walletAddress} size="xs" notSet={false} />
            <div className={styles.userName}>
              <UserMention username={username || ''} />
            </div>
          </div> */}
        </div>
      </FormSection>
      <div className={styles.signOptionWrapper}>
        <div className={styles.labelWrapper}>
          <InputLabel label={MSG.signing} />
          <QuestionMarkTooltip tooltipText={MSG.signOptionTooltip} />
        </div>
        <div className={styles.signing}>All need to sign</div>
      </div>
    </>
  );
};

LockedProtectors.displayName = displayName;

export default LockedProtectors;
