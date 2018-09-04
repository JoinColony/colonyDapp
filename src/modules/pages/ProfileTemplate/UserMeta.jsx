/* @flow */
import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import copy from 'copy-to-clipboard';

import type { UserType } from '../../users/types';

import Button from '../../core/components/Button';
import Heading from '../../core/components/Heading';
import Link from '../../core/components/Link';
import UserAvatar from '../../core/components/UserAvatar';

import styles from './UserMeta.css';

const MSG = defineMessages({
  buttonCopy: {
    id: 'pages.ProfileTemplate.UserMeta.buttonCopy',
    defaultMessage: `{copiedAddress, select,
      true {Copied}
      false {Copy}
    }`,
  },
});

type Props = {
  user: UserType,
};

type State = {
  copiedAddress: boolean,
};

class UserMeta extends Component<Props, State> {
  timeout: TimeoutID;

  state = {
    copiedAddress: false,
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleCopyAddress = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const {
      user: { walletAddress },
    } = this.props;
    copy(walletAddress);
    this.setState({ copiedAddress: true });
    this.timeout = setTimeout(() => {
      this.setState({
        copiedAddress: false,
      });
    }, 2000);
  };

  formatWalletAddress = () => {
    const {
      user: { walletAddress },
    } = this.props;
    const firstPart = walletAddress.slice(0, 6);
    const lastPart = walletAddress.slice(
      walletAddress.length - 4,
      walletAddress.length,
    );
    return `${firstPart} ... ${lastPart}`;
  };

  render() {
    const {
      user: { avatar, ensName, displayName, bio, website, location },
    } = this.props;
    const { copiedAddress } = this.state;

    const walletAddress = this.formatWalletAddress();

    return (
      <div className={styles.main}>
        <UserAvatar avatarURL={avatar} username={ensName} size="xl" />
        <Heading
          appearance={{ margin: 'none', size: 'large' }}
          text={displayName}
        />
        <Link text={ensName} to="/" />
        <p>
          {walletAddress}
          <Button
            appearance={{ size: 'small', theme: 'blue' }}
            disabled={copiedAddress}
            onClick={this.handleCopyAddress}
            text={{ ...MSG.buttonCopy }}
            textValues={{ copiedAddress }}
          />
        </p>
        {bio && (
          <div className={styles.bioContainer}>
            <p>{bio}</p>
          </div>
        )}
        {website && (
          <div className={styles.websiteContainer}>
            <a href={website} rel="noopener noreferrer" target="_blank">
              {website}
            </a>
          </div>
        )}
        {location && (
          <div className={styles.locationContainer}>
            <Heading
              appearance={{ size: 'normal', weight: 'thin' }}
              text={location}
            />
          </div>
        )}
      </div>
    );
  }
}

export default UserMeta;
