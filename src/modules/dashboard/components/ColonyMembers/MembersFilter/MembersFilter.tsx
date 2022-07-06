import { FormikProps } from 'formik';
import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { Form, Select } from '~core/Fields';

import styles from './MembersFilter.css';

const displayName = 'dashboard.ColonyMembers.MembersFilter';

const MSG = defineMessage({
  filter: {
    id: 'dashboard.ColonyMembers.MembersFilter.filter',
    defaultMessage: 'Filters',
  },
  reset: {
    id: 'dashboard.ColonyMembers.MembersFilter.reset',
    defaultMessage: 'Reset',
  },
  allMembers: {
    id: 'dashboard.ColonyMembers.MembersFilter.allMembers',
    defaultMessage: 'All members',
  },
  any: {
    id: 'dashboard.ColonyMembers.MembersFilter.allMembers',
    defaultMessage: 'Any',
  },
  contributors: {
    id: 'dashboard.ColonyMembers.MembersFilter.contributors',
    defaultMessage: 'Contributors',
  },
  watchers: {
    id: 'dashboard.ColonyMembers.MembersFilter.watchers',
    defaultMessage: 'Watchers',
  },
  verified: {
    id: 'dashboard.ColonyMembers.MembersFilter.verified',
    defaultMessage: 'Verified',
  },
  unverified: {
    id: 'dashboard.ColonyMembers.MembersFilter.unverified',
    defaultMessage: 'Unverified',
  },
  banned: {
    id: 'dashboard.ColonyMembers.MembersFilter.banned',
    defaultMessage: 'Banned',
  },
  notBanned: {
    id: 'dashboard.ColonyMembers.MembersFilter.notBanned',
    defaultMessage: 'Not banned',
  },
  memberType: {
    id: 'dashboard.ColonyMembers.MembersFilter.memberType',
    defaultMessage: 'Member type',
  },
  bannedStatus: {
    id: 'dashboard.ColonyMembers.MembersFilter.bannedStatus',
    defaultMessage: 'Banned status',
  },
  verificationType: {
    id: 'dashboard.ColonyMembers.MembersFilter.verificationType',
    defaultMessage: 'Verification type',
  },
});

export enum MemberType {
  ALL = 'all',
  CONTRIBUTORS = 'contributors',
  WATCHERS = 'watchers',
}

export enum VerificationType {
  ALL = 'all',
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
}

export enum BannedStatus {
  ALL = 'all',
  BANNED = 'banned',
  NOT_BANNED = 'not_banned',
}

export interface FormValues {
  memberType: MemberType;
  verificationType: VerificationType;
  bannedStatus: BannedStatus;
}

const memberTypes = [
  { label: MSG.allMembers, value: MemberType.ALL },
  { label: MSG.contributors, value: MemberType.CONTRIBUTORS },
  { label: MSG.watchers, value: MemberType.WATCHERS },
];

const verificationTypes = [
  { label: MSG.any, value: VerificationType.ALL },
  { label: MSG.verified, value: VerificationType.VERIFIED },
  { label: MSG.unverified, value: VerificationType.UNVERIFIED },
];

const bannedStatuses = [
  { label: MSG.any, value: BannedStatus.ALL },
  { label: MSG.banned, value: BannedStatus.BANNED },
  { label: MSG.notBanned, value: BannedStatus.NOT_BANNED },
];

interface Props {
  handleFiltersCallback: (filters: FormValues) => void;
  isRoot: boolean;
}

const MembersFilter = ({ handleFiltersCallback, isRoot }: Props) => {
  return (
    <>
      <hr className={styles.divider} />
      <Form
        initialValues={{
          memberType: MemberType.ALL,
          verificationType: VerificationType.ALL,
          bannedStatus: BannedStatus.ALL,
        }}
        onSubmit={() => {}}
        enableReinitialize
      >
        {({ resetForm, values }: FormikProps<FormValues>) => {
          handleFiltersCallback(values);
          return (
            <div className={styles.filters}>
              <div className={styles.titleContainer}>
                <span className={styles.title}>
                  <FormattedMessage {...MSG.filter} />
                </span>
                <Button
                  text={MSG.reset}
                  appearance={{ theme: 'blue' }}
                  onClick={() => resetForm()}
                />
              </div>
              {isRoot && (
                <Select
                  appearance={{ theme: 'grey' }}
                  name="memberType"
                  options={memberTypes}
                  label={MSG.memberType}
                />
              )}
              <Select
                appearance={{ theme: 'grey' }}
                name="verificationType"
                options={verificationTypes}
                label={MSG.verificationType}
              />
              <Select
                appearance={{ theme: 'grey' }}
                name="bannedStatus"
                options={bannedStatuses}
                label={MSG.bannedStatus}
              />
            </div>
          );
        }}
      </Form>
    </>
  );
};

MembersFilter.displayName = displayName;

export default MembersFilter;
