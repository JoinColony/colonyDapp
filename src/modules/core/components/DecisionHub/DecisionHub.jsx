/* @flow */

import React from 'react';

import DecisionOption from './DecisionOption.jsx';

const displayName = 'DecisionHub';

type Props = {
  options: Array<{
    value: string,
    title: string,
    subtitle: string,
    icon?: string,
  }>,
  name: string,
};

const DecisionHub = ({ options, name }: Props) => (
  <div>
    {options.map(option => (
      <DecisionOption name={name} option={option} key={`row-${option.value}`} />
    ))}
  </div>
);

DecisionHub.displayName = displayName;

export default DecisionHub;
