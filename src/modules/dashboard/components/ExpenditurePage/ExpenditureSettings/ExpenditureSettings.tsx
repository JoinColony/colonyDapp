import React from 'react';
import { defineMessages } from 'react-intl';
import { useField } from 'formik';

import { SelectHorizontal, FormSection } from '~core/Fields';
import { Colony } from '~data/index';
import { ExpenditureTypes } from '~pages/ExpenditurePage/types';
import { capitalize } from '~utils/strings';

import ExpenditureStreamingForm from './ExpenditureStreamingForm';
import ExpenditureBaseForm from './ExpenditureBaseForm';
import styles from './ExpenditureSettings.css';

export const MSG = defineMessages({
  type: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.type',
    defaultMessage: 'Expenditure type',
  },
  team: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.team',
    defaultMessage: 'Team',
  },
  balance: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.balance',
    defaultMessage: 'Balance',
  },
  owner: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.owner',
    defaultMessage: 'Owner',
  },
  advancedPayment: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.advancedPayment',
    defaultMessage: 'Advanced payment',
  },
  staged: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.staged',
    defaultMessage: 'Staged',
  },
  split: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.split',
    defaultMessage: 'Split',
  },
  streaming: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.streaming',
    defaultMessage: 'Streaming',
  },
  batch: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.batch',
    defaultMessage: 'Batch',
  },
});

const expeditureTypes = [
  {
    label: MSG.advancedPayment,
    value: ExpenditureTypes.Advanced,
  },
  {
    label: MSG.split,
    value: ExpenditureTypes.Split,
  },
  {
    label: MSG.staged,
    value: ExpenditureTypes.Staged,
  },
  {
    label: MSG.streaming,
    value: ExpenditureTypes.Streaming,
  },
  {
    label: MSG.batch,
    value: ExpenditureTypes.Batch,
  },
];

const displayName = 'dashboard.ExpenditurePage.ExpenditureSettings';

export interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
  inEditMode: boolean;
}

const ExpenditureSettings = ({ colony, sidebarRef, inEditMode }: Props) => {
  const [, { value: expenditure }] = useField('expenditure');

  return (
    <div className={styles.container}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.blue}>
          <SelectHorizontal
            name="expenditure"
            label={MSG.type}
            appearance={{
              theme: 'alt',
              width: 'content',
            }}
            options={
              inEditMode
                ? [{ label: capitalize(expenditure), value: expenditure }]
                : expeditureTypes
            }
            scrollContainer={sidebarRef}
            placement="bottom"
            withDropdownElelment
            optionSizeLarge
          />
        </div>
      </FormSection>
      {expenditure === ExpenditureTypes.Streaming ? (
        <ExpenditureStreamingForm sidebarRef={sidebarRef} colony={colony} />
      ) : (
        <ExpenditureBaseForm sidebarRef={sidebarRef} colony={colony} />
      )}
    </div>
  );
};

ExpenditureSettings.displayName = displayName;

export default ExpenditureSettings;
