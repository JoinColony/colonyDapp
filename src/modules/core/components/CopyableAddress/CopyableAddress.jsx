/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import copy from 'copy-to-clipboard';

import { getMainClasses } from '~utils/css';

import MaskedAddress from '~core/MaskedAddress';

import styles from './CopyableAddress.css';

import Button from '../Button';

const MSG = defineMessages({
  buttonCopy: {
    id: 'CopyableAddress.buttonCopy',
    defaultMessage: `{copiedAddress, select,
      true {Copied}
      false {Copy}
    }`,
  },
  buttonCopyLong: {
    id: 'CopyableAddress.buttonCopyLong',
    defaultMessage: `{copiedAddress, select,
      true {Copied Wallet Address}
      false {Copy Wallet Address}
    }`,
  },
});

type Appearance = {
  theme: 'big',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Address to display */
  children: string,
  /** Indicates that the full address should be shown instead of an abbreviated one */
  full?: boolean,
  /** In some occasions we want to show the button to copy only */
  hideAddress?: boolean,
};

type State = {
  copiedAddress: boolean,
};

class CopyableAddress extends Component<Props, State> {
  timeout: TimeoutID;

  static defaultProps = {
    hideAddress: false,
  };

  state = {
    copiedAddress: false,
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleCopyAddress = (evt: SyntheticEvent<HTMLButtonElement>) => {
    const { children: address } = this.props;
    evt.preventDefault();
    copy(address);
    this.setState({ copiedAddress: true });
    this.timeout = setTimeout(() => {
      this.setState({
        copiedAddress: false,
      });
    }, 2000);
  };

  getAddress = () => {
    const { children: address, full } = this.props;
    if (full) {
      return address;
    }
    return <MaskedAddress address={address} />;
  };

  render() {
    const { appearance, hideAddress } = this.props;
    const { copiedAddress } = this.state;

    return (
      <div className={getMainClasses(appearance, styles)}>
        {!hideAddress && this.getAddress()}
        <Button
          appearance={{ size: 'small', theme: 'blue' }}
          disabled={copiedAddress}
          onClick={this.handleCopyAddress}
          text={hideAddress ? { ...MSG.buttonCopyLong } : { ...MSG.buttonCopy }}
          textValues={{ copiedAddress }}
        />
      </div>
    );
  }
}

export default CopyableAddress;
