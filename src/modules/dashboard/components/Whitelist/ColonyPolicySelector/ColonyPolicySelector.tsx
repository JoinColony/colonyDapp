import React from 'react';
import { MessageDescriptor } from 'react-intl';
import { useField } from 'formik';

import { CustomRadioGroup, CustomRadioProps } from '~core/Fields';
import Heading from '~core/Heading';

import styles from './ColonyPolicySelector.css';

export interface FormValues {
  policy: string;
}

interface Props {
  name: string;
  title: MessageDescriptor | string;
  options: CustomRadioProps[];
}

const displayName = 'dashboard.Whitelist.ColonyPolicySelector';

const ColonyPolicySelector = ({ name, title, options }: Props) => {
  const [inputFieldProps] = useField<string>(name);
  return (
    <div className={styles.container}>
      <Heading
        appearance={{ margin: 'small', size: 'normal', theme: 'dark' }}
        text={title}
      />
      <CustomRadioGroup
        appearance={{ direction: 'horizontal', gap: 'medium' }}
        options={options}
        currentlyCheckedValue={inputFieldProps.value}
        name="policy"
        dataTest="policySelector"
      />
    </div>
  );
};

ColonyPolicySelector.displayName = displayName;

export default ColonyPolicySelector;
