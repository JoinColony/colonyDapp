import React from 'react';

interface Props {
  options: any[];
}

const displayName = 'RadioButtons';

const RadioButtons = ({ options }: Props) => {
  return <div>{options}</div>;
};

RadioButtons.displayName = displayName;

export default RadioButtons;
