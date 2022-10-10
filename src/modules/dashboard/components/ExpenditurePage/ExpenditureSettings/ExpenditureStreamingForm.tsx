import { useField } from 'formik';
import React from 'react';
import { defineMessages } from 'react-intl';
import classNames from 'classnames';

import { InputLabel, FormSection } from '~core/Fields';
import DatePicker, { DatePickerOption } from '~core/Fields/DatePicker';
import { filterUserSelection } from '~core/SingleUserPicker';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { useMembersSubscription } from '~data/generated';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';

import { supRenderAvatar } from '../Recipient/Recipient';
import { Streaming } from '../Streaming/types';

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

const displayName =
  'dashboard.ExpenditurePage.ExpenditureSettings.ExpenditureStreamingForm';

const ExpenditureStreamingForm = ({ sidebarRef, colony }: Props) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colony.colonyAddress || '' },
  });
  const [, { value: startDate }] = useField<Streaming['startDate']>(
    'streaming.startDate',
  );
  const [, { error: endDateError }] = useField<Streaming['endDate']>(
    'streaming.endDate',
  );

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
          <DatePicker
            name="streaming.startDate"
            showTimeSelect
            minDate={new Date()}
          />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={classNames(styles.blue, styles.settingsRow)}>
          <InputLabel
            label={MSG.ends}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <div className={classNames({ [styles.dateError]: endDateError })}>
            <DatePicker
              name="streaming.endDate"
              showTimeSelect
              options={endDateOptions}
              minDate={startDate.date}
            />
          </div>
        </div>
      </FormSection>
    </>
  );
};

ExpenditureStreamingForm.displayName = displayName;

export default ExpenditureStreamingForm;
