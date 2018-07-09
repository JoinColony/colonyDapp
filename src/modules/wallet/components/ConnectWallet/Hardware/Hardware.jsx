/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
import HardwareIcon from '../../../../../img/icons/wallet.svg';
import styles from './Hardware.css';

const MSG = defineMessages({
  heading: {
    id: 'ConnectWallet.providers.Hardware.heading',
    defaultMessage: 'Which wallet would you like to use to access Colony?',
  },
  instructionText: {
    id: 'ConnectWallet.providers.Hardware.instructionText',
    defaultMessage: 'Select an address',
  },
  balanceText: {
    id: 'ConnectWallet.providers.Hardware.balanceText',
    defaultMessage: 'Balance',
  },
  errorHeading: {
    id: 'ConnectWallet.providers.Hardware.errorHeading',
    defaultMessage: 'Oops, we couldn\'t find your hardware wallet',
  },
  errorDescription: {
    id: 'ConnectWallet.providers.Hardware.errorDescription',
    defaultMessage: 'Please check that your hardware wallet is connected and try again.',
  },
  buttonAdvance: {
    id: 'ConnectWallet.providers.Hardware.button.advance',
    defaultMessage: 'Go to Colony',
  },
  buttonBack: {
    id: 'ConnectWallet.providers.Hardware.button.back',
    defaultMessage: 'Back',
  },
  buttonRetry: {
    id: 'ConnectWallet.providers.Hardware.button.retry',
    defaultMessage: 'Try Again',
  },
});

type Props = {}

type State = {
  isValid: boolean,
  walletChoices: Array<Object>,
} 

class Hardware extends Component<Props, State> {
  
  state = { 
    isValid: true,
    walletChoices: [],
  }

  componentDidMount() {
    this.getWalletChoices();
  }

  getWalletChoices = () => {
    this.setState({
      walletChoices: [
        {value: 1, label: '0x20ejAJDSIOenoc0DJ0wefkl032ru09jae09tj'},
        {value: 2, label: '98qweasdsjFUq000faJFwef'},
        {value: 3, label: '4x0E0FJ9E0JJjoadfif024jDF'},
      ]
    }) 
  }

  render() {

    return (
      <Fragment>
        <div className={styles.content}>
          {this.state.isValid
            ? <Fragment>
                <Heading text={MSG.heading} />
                <Heading text={MSG.instructionText} appearance={{ size: 'small' }} />
                <Heading text={MSG.balanceText} appearance={{ size: 'small' }} />
              </Fragment>
            : <Fragment>
                <HardwareIcon />
                <Heading text={MSG.errorHeading} />
                <Heading text={MSG.errorDescription} />
              </Fragment>
          }
          {/* radio field will go here */}
          
        </div>
        <div className={styles.actions}>
          <Button 
            value={MSG.buttonBack}
            appearance={{ theme: 'ghost', colorSchema: 'noBorder' }} 
          />
          {this.state.isValid
            ? <Button
                value={MSG.buttonAdvance} 
                appearance={{ theme: 'primary' }}
              />
            : <Button 
                value={MSG.buttonRetry}
                appearance={{ theme: 'primary' }}
              />
          }
        </div>
      </Fragment>
    )
  }
}

export default Hardware;