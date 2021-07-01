import React from 'react';
import { defineMessages } from 'react-intl';

import { CustomRadioGroup, CustomRadioProps } from '~core/Fields';
import Heading from '~core/Heading';

import styles from './ColonyPolicySelector.css';

export interface FormValues {
  policy: string;
}

interface Props {
  selectedPolicy: string;
}

const MSG = defineMessages({
  title: {
    id: 'ashboard.Extensions.ColonyPolicySelector.title',
    defaultMessage: 'What is the colony policy on whitelisting?',
  },
  agreementOnly: {
    id: 'dashboard.Extensions.ColonyPolicySelector.agreementOnly',
    defaultMessage: 'Agreement only',
  },
  KYCOnly: {
    id: 'dashboard.Extensions.ColonyPolicySelector.KYCOnly',
    defaultMessage: 'KYC only',
  },
  agreementAndKYC: {
    id: 'dashboard.Extensions.ColonyPolicySelector.agreementAndKYC',
    defaultMessage: 'KYC and agreement',
  },
});

const ColonyPolicySelector = ({ selectedPolicy }: Props) => {
  const options: CustomRadioProps[] = [
    {
      value: 'AGREEMENT_ONLY',
      label: MSG.agreementOnly,
      name: 'policy',
      appearance: {
        theme: 'traditional',
      },
      checked: false,
    },
    {
      value: 'KYC_ONLY',
      label: MSG.KYCOnly,
      name: 'policy',
      appearance: {
        theme: 'traditional',
      },
      checked: false,
    },
    {
      value: 'KYC_AND_AGREEMENT',
      label: MSG.agreementAndKYC,
      name: 'policy',
      appearance: {
        theme: 'traditional',
      },
      checked: false,
    },
  ];
  return (
    <div className={styles.container}>
      <Heading
        appearance={{ margin: 'small', size: 'normal', theme: 'dark' }}
        text={MSG.title}
      />
      <CustomRadioGroup
        appearance={{ direction: 'horizontal', gap: 'medium' }}
        options={options}
        currentlyCheckedValue={selectedPolicy}
        name="policy"
      />
    </div>
  );
};

export default ColonyPolicySelector;
