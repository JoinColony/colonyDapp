import React from 'react';
import { MessageDescriptor } from 'react-intl';

import DecisionOption from './DecisionOption';

const displayName = 'DecisionHub';

interface Option {
  value: string;
  title: MessageDescriptor | string;
  subtitle: MessageDescriptor | string;
  icon?: string;
  tooltip?: MessageDescriptor | string;
}

interface Props {
  options: Option[];
  name: string;
}

const DecisionHub = ({ options, name }: Props) => (
  <div>
    {options.map(option => (
      <DecisionOption name={name} option={option} key={`row-${option.value}`} />
    ))}
  </div>
);

DecisionHub.displayName = displayName;

export default DecisionHub;
