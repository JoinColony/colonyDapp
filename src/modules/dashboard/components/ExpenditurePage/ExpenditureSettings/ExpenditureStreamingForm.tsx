import React from 'react';
import { defineMessages } from 'react-intl';

import { InputLabel, FormSection } from '~core/Fields';
import DatePicker, { DatePickerOption } from '~core/Fields/DatePicker';
import { filterUserSelection } from '~core/SingleUserPicker';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { useMembersSubscription } from '~data/generated';
import { Colony } from '~data/index';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';

import { supRenderAvatar } from '../Recipient/Recipient';

import { Props } from './ExpenditureSettings';
import styles from './ExpenditureSettings.css';

export const MSG = defineMessages({
  to: {
    id: 'dashboard.ExpenditurePage.ExpenditureStreamingForm.to',
    defaultMessage: 'To',
  },
  starts: {
    id: 'dashboard.ExpenditurePage.ExpenditureStreamingForm.starts',
    defaultMessage: 'Starts',
  },
  ends: {
    id: 'dashboard.ExpenditurePage.ExpenditureStreamingForm.ends',
    defaultMessage: 'Ends',
  },
  whenCancelled: {
    id: 'dashboard.ExpenditurePage.ExpenditureStreamingForm.whenCancelled',
    defaultMessage: 'When cancelled',
  },
  limitIsReached: {
    id: 'dashboard.ExpenditurePage.ExpenditureStreamingForm.limitIsReached',
    defaultMessage: 'Limit is reached',
  },
  fixedTime: {
    id: 'dashboard.ExpenditurePage.ExpenditureStreamingForm.fixedTime',
    defaultMessage: 'Fixed time',
  },
});

const endDateOptions: DatePickerOption[] = [
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
    showDatePicker: true,
  },
];

export interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

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

          <DatePicker name="streaming.startDate" showTimeSelect />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={(styles.blue, styles.settingsRow)}>
          <InputLabel
            label={MSG.ends}
            appearance={{
              direction: 'horizontal',
            }}
          />

          <DatePicker
            name="streaming.endDate"
            showTimeSelect
            options={endDateOptions}
            minDate={new Date()}
          />
        </div>
      </FormSection>
    </>
  );
};

ExpenditureStreamingForm.displayName = displayName;

export default ExpenditureStreamingForm;
