import React from 'react';
import { MessageDescriptor } from 'react-intl';

import { CustomRadioGroup, CustomRadioProps } from '~core/Fields';
import Heading from '~core/Heading';

import styles from './ColonyPolicySelector.css';

export interface FormValues {
  policy: string;
}

interface Props {
  selectedPolicy: string;
  title: MessageDescriptor | string;
  options: CustomRadioProps[];
}

const ColonyPolicySelector = ({ selectedPolicy, title, options }: Props) => (
  <div className={styles.container}>
    <Heading
      appearance={{ margin: 'small', size: 'normal', theme: 'dark' }}
      text={title}
    />
    <CustomRadioGroup
      appearance={{ direction: 'horizontal', gap: 'medium' }}
      options={options}
      currentlyCheckedValue={selectedPolicy}
      name="policy"
    />
  </div>
);

export default ColonyPolicySelector;
