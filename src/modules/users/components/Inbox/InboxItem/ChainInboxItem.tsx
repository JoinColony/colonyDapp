import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { UserDocument } from '~data/index';

import InboxItem, { Props } from './InboxItem';

const ChainInboxItem = ({
  item: { initiator, targetUser },
  item,
  ...props
}: Props) => {
  const { data: initiatorData } = useQuery(UserDocument, {
    variables: { address: initiator },
  });
  const { data: targetUserData } = useQuery(UserDocument, {
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
