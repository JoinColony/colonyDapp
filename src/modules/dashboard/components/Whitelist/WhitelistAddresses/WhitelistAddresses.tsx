import React from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages, MessageDescriptor } from 'react-intl';

import Heading from '~core/Heading';
import MembersList from '~core/MembersList';
import { AnyUser, Colony } from '~data/index';
import { SimpleMessageValues } from '~types/index';

import WhitelistMembersListExtraContent from './WhitelistMembersListExtraContent';

import styles from './WhitelistAddresses.css';

interface Props {
  colony: Colony;
  users: AnyUser[];
  canRemoveUser?: boolean;
  title?: MessageDescriptor;
  titleValues?: SimpleMessageValues;
}

const displayName = 'dashboard.Whitelist.WhitelistAddresses';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Whitelist.WhitelistAddresses.title',
    defaultMessage: 'List of whitelisted addresses',
  },
});

const WhitelistAddresses = ({
  colony,
  users,
  canRemoveUser = false,
  title = MSG.title,
  titleValues,
}: Props) => {
  if (!users?.length) {
    return null;
  }
  return (
    <div className={styles.main}>
      <Heading
        text={title}
        textValues={titleValues}
        appearance={{ margin: 'small', theme: 'dark', size: 'normal' }}
      />
      <MembersList
        colony={colony}
        domainId={ROOT_DOMAIN_ID}
        users={users}
        showUserReputation={false}
        extraItemContent={(props) => {
          return canRemoveUser ? (
            <WhitelistMembersListExtraContent
              userAddress={props.id}
              colonyAddress={colony.colonyAddress}
            />
          ) : null;
        }}
        listGroupAppearance={{ hoverColor: 'dark' }}
      />
    </div>
  );
};

WhitelistAddresses.displayName = displayName;

export default WhitelistAddresses;
