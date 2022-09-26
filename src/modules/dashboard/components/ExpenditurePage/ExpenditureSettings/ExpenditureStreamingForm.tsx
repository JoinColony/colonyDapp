import { useField } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { InputLabel, SelectHorizontal, FormSection } from '~core/Fields';
import { filterUserSelection } from '~core/SingleUserPicker';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { useMembersSubscription } from '~data/generated';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';

import { supRenderAvatar } from '../Recipient/Recipient';
import { FundingSource } from '../Streaming/types';

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
  'dashboard.ExpenditurePage.ExpenditureSettings.ExpenditureStreamingForm';

const ExpenditureStreamingForm = ({ sidebarRef, colony }: Props) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colony.colonyAddress || '' },
  });
  const [, { value: fundingSourcesValue }, { setValue }] = useField<
    FundingSource[]
  >('streaming.fundingSources');

  const onSelectChange = useCallback(
    (value: string) => {
      if (value !== ExpenditureEndDateTypes.LimitIsReached) {
        setValue(
          fundingSourcesValue.map((fundingSource) => ({
            ...fundingSource,
            rate: fundingSource.rate.map((rateItem) => ({
              ...rateItem,
              limit: undefined,
            })),
          })),
        );
      }
    },
    [fundingSourcesValue, setValue],
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
            onChange={onSelectChange}
            options={endDateTypes}
            scrollContainer={sidebarRef}
            placement="right"
            withDropdownElement
            hasBlueActiveState
          />
        </div>
      </FormSection>
    </>
  );
};

ExpenditureStreamingForm.displayName = displayName;

export default ExpenditureStreamingForm;
