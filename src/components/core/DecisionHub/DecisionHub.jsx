/* @flow */

import React from 'react';

import type { MessageDescriptor } from 'react-intl';

import DecisionOption from './DecisionOption.jsx';

const displayName = 'DecisionHub';

type Option = {|
  value: string,
  title: MessageDescriptor | string,
  subtitle: MessageDescriptor | string,
  icon?: string,
|};

type Props = {|
  options: Array<Option>,
  name: string,
|};

const DecisionHub = ({ options, name }: Props) => (
  <div>
    {options.map(option => (
      <DecisionOption name={name} option={option} key={`row-${option.value}`} />
    ))}
  </div>
);

DecisionHub.displayName = displayName;

export default DecisionHub;
