import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { USER } from '../../../queries';
import InboxItem, { Props } from './InboxItem';

const ChainInboxItem = ({
  item: { initiator, targetUser },
  item,
  ...props
}: Props) => {
  const { data: initiatorData } = useQuery(USER, {
    variables: { address: initiator },
  });
  const { data: targetUserData } = useQuery(USER, {
    variables: { address: targetUser },
  });
  const enrichedItem = {
    ...item,
    initiator: initiatorData.user || initiator,
    targetUser: targetUserData.user || targetUser,
  };
  return <InboxItem item={enrichedItem} {...props} />;
};

export default ChainInboxItem;
