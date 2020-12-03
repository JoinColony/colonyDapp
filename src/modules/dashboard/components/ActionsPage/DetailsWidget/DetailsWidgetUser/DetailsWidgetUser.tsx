import React from 'react';
import TextDecorator from '~lib/TextDecorator';
import UserMention from '~core/UserMention';
import { Address } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import MaskedAddress from '~core/MaskedAddress';
import styles from './DetailsWidgetUser.css';


const displayName = 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetUser';


interface Props {
  username?: string,
  walletAddress: Address,
}

const DetailsWidgetUser = ({
  walletAddress,
  username,
}: Props) => {
  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention username={usernameWithAtSign.slice(1)} />
    ),
  });
  const UserAvatar = HookedUserAvatar({ fetchUser: false });

  return (
    <div className={styles.main}>
      <UserAvatar size="s" address={walletAddress || ''} />
      {username && (
        <div className={styles.username}>
          <Decorate key={walletAddress}>{`@${username}`}</Decorate>
        </div>
      )}
      <div className={styles.address}>
        <MaskedAddress address={walletAddress} />
      </div>
    </div>
  );
};

DetailsWidgetUser.displayName = displayName;

export default DetailsWidgetUser;
