import React from 'react';

import { ColonyType } from '~immutable/index';

import Transactions from '~admin/Transactions';

interface Props {
  colony: ColonyType;
}

const TabTransactions = ({ colony }: Props) => (
  <Transactions colonyAddress={colony.colonyAddress} />
);

export default TabTransactions;
