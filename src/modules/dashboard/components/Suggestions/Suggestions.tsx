import React from 'react';
import { Address } from '~types/index';

interface Props {
  colonyAddress: Address;
}

const displayName = 'dashboard.Suggestions';

const Suggestions = ({ colonyAddress }: Props) => <div>{colonyAddress}</div>;

Suggestions.displayName = displayName;

export default Suggestions;
