import React from 'react';
import { defineMessages } from 'react-intl';
import { useFormikContext } from 'formik';

import { SelectHorizontal, FormSection } from '~core/Fields';
import { Colony } from '~data/index';
import { ExpenditureTypes, ValuesType } from '~pages/ExpenditurePage/types';
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
  multiple: {
    id: 'dashboard.ExpenditurePage.ExpenditureSettings.multiple',
    defaultMessage: 'Multiple',
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

const expenditureTypes = [
  {
    label: MSG.multiple,
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
    label: MSG.batch,
    value: ExpenditureTypes.Batch,
  },
  {
    label: MSG.streaming,
    value: ExpenditureTypes.Streaming,
  },
];

const displayName = 'dashboard.ExpenditurePage.ExpenditureSettings';

export interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
  inEditMode: boolean;
}

const ExpenditureSettings = ({ colony, sidebarRef, inEditMode }: Props) => {
  const { values } = useFormikContext<ValuesType>() || {};
  const { expenditure } = values;
  const expenditureType = values.expenditure;

  return (
    <div className={styles.container}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.blue}>
          {/* withDropdownElement - dropdown component created because there is a need to render element outside DOM hierarchy */}
          <SelectHorizontal
            name="expenditure"
            label={MSG.type}
            appearance={{
              theme: 'alt',
              width: 'content',
            }}
            options={
              inEditMode
                ? [
                    {
                      label: capitalize(expenditureType),
                      value: expenditureType,
                    },
                  ]
                : expenditureTypes
            }
            scrollContainer={sidebarRef}
            placement="bottom"
            withDropdownElement
            optionSizeLarge
          />
        </div>
      </FormSection>
      {expenditureType === ExpenditureTypes.Streaming ? (
        <ExpenditureStreamingForm sidebarRef={sidebarRef} colony={colony} />
      ) : (
        <ExpenditureBaseForm sidebarRef={sidebarRef} colony={colony} />
      )}
    </div>
  );
};

ExpenditureSettings.displayName = displayName;

export default ExpenditureSettings;
