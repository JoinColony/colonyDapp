import React from 'react';

import DecisionOption, { DecisionOptionType } from './DecisionOption';

const displayName = 'DecisionHub';

interface Props {
  options: DecisionOptionType[];
  name: string;
}

const DecisionHub = ({ options, name }: Props) => (
  <div data-test="hubOptions">
    {options.map(option => (
      <DecisionOption name={name} option={option} key={`row-${option.value}`} />
    ))}
  </div>
);

DecisionHub.displayName = displayName;

export default DecisionHub;
