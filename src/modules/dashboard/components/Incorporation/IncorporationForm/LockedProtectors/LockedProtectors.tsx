import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection, InputLabel } from '~core/Fields';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { ValuesType } from '~pages/IncorporationPage/types';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import Tag from '~core/Tag';

import { SignOption, VerificationStatus } from '../constants';

import styles from './LockedProtectors.css';

export const MSG = defineMessages({
  protectors: {
    id: `dashboard.Incorporation.IncorporationForm.LockedProtectors.protectors`,
    defaultMessage: 'Protectors',
  },
  protectorsTooltip: {
    id: `dashboard.Incorporation.IncorporationForm.LockedProtectors.protectorsTooltip`,
    defaultMessage: `A Protector's role in a DAO legal corporation is to ratify the decisions of the DAO. Their purpose is to act on behalf of the DAO and handle legal the required administration. Learn more`,
  },
  unverified: {
    id: `dashboard.Incorporation.IncorporationForm.LockedProtectors.unverified`,
    defaultMessage: 'Unverified',
  },
  verified: {
    id: `dashboard.Incorporation.IncorporationForm.LockedProtectors.verified`,
    defaultMessage: 'Verified',
  },
  mainContact: {
    id: `dashboard.Incorporation.IncorporationForm.LockedProtectors.mainContact`,
    defaultMessage: 'Main contact',
  },
  signing: {
    id: `dashboard.Incorporation.IncorporationForm.LockedProtectors.signing`,
    defaultMessage: 'Signing',
  },
  mainContactTooltip: {
    id: `dashboard.Incorporation.IncorporationForm.LockedProtectors.mainContactTooltip`,
    defaultMessage: `The main contact is required during the incorporation process and is also required to use their delivery address details for the registration.`,
  },
  signOptionTooltip: {
    id: `dashboard.Incorporation.IncorporationForm.LockedProtectors.signOptionTooltip`,
    defaultMessage: `Decide the requirements as to how many Protectors are required to sign legal documents to enact the decisions of a DAO.`,
  },
  individual: {
    id: `dashboard.Incorporation.IncorporationForm.LockedProtectors.individual`,
    defaultMessage: 'Individual signing',
  },
  multiple: {
    id: `dashboard.Incorporation.IncorporationForm.LockedProtectors.multiple`,
    defaultMessage: 'All need to sign',
  },
});

const displayName = `dashboard.Incorporation.IncorporationForm.LockedProtectors`;

export interface Props {
  formValues: ValuesType;
}

const LockedProtectors = ({ formValues }: Props) => {
  const signLabel = useMemo(() => {
    return formValues.signOption === SignOption.Individual
      ? MSG.individual
      : MSG.multiple;
  }, [formValues]);

  return (
    <>
      <FormSection>
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
        {formValues.protectors?.map((protector) => {
          const { user } = protector || {};
          const { profile } = user || {};
          const { walletAddress, username, displayName: userDispalyName } =
            profile || {};
          const verificationStatus = VerificationStatus.Unverified; // mockData

          return (
            <div className={styles.row}>
              <Tag
                appearance={{
                  colorSchema: 'fullColor',
                  theme:
                    verificationStatus === VerificationStatus.Unverified
                      ? 'danger'
                      : 'primary',
                }}
              >
                {verificationStatus}
              </Tag>
              <div className={styles.userAvatarContainer}>
                <UserAvatar
                  address={walletAddress || ''}
                  size="xs"
                  notSet={false}
                />
                <div className={styles.userName}>
                  <UserMention username={username || userDispalyName || ''} />
                </div>
              </div>
            </div>
          );
        })}
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.mainContactRow}>
          <div className={styles.labelWrapper}>
            <InputLabel label={MSG.mainContact} />
            <QuestionMarkTooltip tooltipText={MSG.mainContactTooltip} />
          </div>
          <div className={styles.userAvatarContainer}>
            <UserAvatar
              address={formValues.mainContact?.profile.walletAddress || ''}
              size="xs"
              notSet={false}
            />
            <div className={styles.userName}>
              <UserMention
                username={formValues.mainContact?.profile.username || ''}
              />
            </div>
          </div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.signOptionWrapper}>
          <div className={styles.labelWrapper}>
            <InputLabel label={MSG.signing} />
            <QuestionMarkTooltip tooltipText={MSG.signOptionTooltip} />
          </div>
          <div className={styles.signing}>
            <FormattedMessage {...signLabel} />
          </div>
        </div>
      </FormSection>
    </>
  );
};

LockedProtectors.displayName = displayName;

export default LockedProtectors;
