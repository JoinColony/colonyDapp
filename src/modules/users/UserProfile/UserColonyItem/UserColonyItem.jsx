/* @flow */
import React from 'react';

import ColonyAvatar from '../../../core/components/ColonyAvatar';

type Props = {
  colony: Object,
};

const UserColonyItem = ({ colony: { colonyAddress, displayName } }: Props) => (
  <div>
    <ColonyAvatar colonyAddress={colonyAddress} colonyName={displayName} />
  </div>
);

export default UserColonyItem;
