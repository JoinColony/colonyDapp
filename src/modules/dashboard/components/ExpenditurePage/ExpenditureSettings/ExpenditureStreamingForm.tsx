import React from 'react';
import { defineMessages } from 'react-intl';

import { InputLabel, SelectHorizontal, FormSection } from '~core/Fields';
import { filterUserSelection } from '~core/SingleUserPicker';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { useMembersSubscription } from '~data/generated';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';
import { supRenderAvatar } from '../Recipient/Recipient';
import { Props } from './ExpenditureSettings';

import styles from './ExpenditureSettings.css';

export const MSG = defineMessages({
  to: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.to',
    defaultMessage: 'To',
  },
  starts: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.starts',
    defaultMessage: 'Starts',
  },
  ends: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.ends',
    defaultMessage: 'Ends',
  },
  whenCancelled: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.whenCancelled',
    defaultMessage: 'When cancelled',
  },
  limitIsReached: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.limitIsReached',
    defaultMessage: 'Limit is reached',
  },
  fixedTime: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.fixedTime',
    defaultMessage: 'Fixed time',
  },
});

const endDateTypes = [
  {
    label: MSG.whenCancelled,
    value: ExpenditureEndDateTypes.WhenCancelled,
  },
  {
    label: MSG.limitIsReached,
    value: ExpenditureEndDateTypes.LimitIsReached,
  },
  {
    label: MSG.fixedTime,
    value: ExpenditureEndDateTypes.FixedTime,
  },
];

const displayName =
  'dashboard.ExpenditurePage.ExpenditureSettings.streamingForm';

const ExpenditureStreamingForm = ({ sidebarRef, colony }: Props) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colony.colonyAddress || '' },
  });

  return (
    <>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.settingsRow}>
          <UserPickerWithSearch
            data={colonyMembers?.subscribedUsers || []}
            label={MSG.to}
            name="streaming.user"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            placeholder="Search"
            sidebarRef={sidebarRef}
          />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={(styles.blue, styles.settingsRow)}>
          <InputLabel
            label={MSG.starts}
            appearance={{
              direction: 'horizontal',
            }}
          />
          {/* Mock element - awaits for datepicker */}
          <>{new Date().toLocaleDateString()}</>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.blue}>
          <SelectHorizontal
            name="streaming.endDate"
            label={MSG.ends}
            appearance={{
              theme: 'alt',
              width: 'content',
            }}
            options={endDateTypes}
            scrollContainer={sidebarRef}
            placement="right"
            withDropdownElelment
          />
        </div>
      </FormSection>
    </>
  );
};

ExpenditureStreamingForm.displayName = displayName;

export default ExpenditureStreamingForm;
