/* @flow */

// FIXME: This should be done by this component (MnemonicDnDSorter.onAllDropped prop)
// checkSorting = () => {
//   const { items } = this.state;
//   const { passphrase } = this.props;
//   this.setState({ checked: true });
//   const passPhraseToCheck = items.map(element => element.content).join(' ');

//   const matches = passPhraseToCheck === passphrase;
//   if (matches) {
//     this.setState({ hasError: false });
//   } else {
//     this.setState({ hasError: true });
//   }

//   return matches;
// };

// FIXME: Remove redux-form

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import styles from './DragAndDropPhrase.css';

import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';
import DragAndDropArea from './DragAndDropArea.jsx';

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.DragAndDropPhrase.heading',
    defaultMessage: 'Did you really back up your mnemoic phrase. Prove it!',
  },
  subTitle: {
    id: 'CreateWallet.DragAndDropPhrase.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'We do not store your mnemonic phrase anywhere which means we cannot recover it for any reason. Make an alternative backup to keep it extra safe.',
  },
  nextButton: {
    id: 'CreateWallet.DragAndDropPhrase.confirmButton',
    defaultMessage: 'Next',
  },
  backButton: {
    id: 'CreateWallet.DragAndDropPhrase.backButton',
    defaultMessage: 'Back',
  },
  backupButton: {
    id: 'CreateWallet.DragAndDropPhrase.backupButton',
    defaultMessage: 'Backup Mnemonic',
  },
  dragAndDropBox: {
    id: 'CreateWallet.DragAndDropPhrase.dragAndDropBox',
    defaultMessage: 'Drag & Drop Mnemonics Here',
  },
});

type Props = {
  nextStep: () => void,
  previousStep: () => void,
  handleSubmit: (handler: () => void) => void,
  passphrase: string,
};

type State = {
  allowSubmit: boolean,
};

class DragAndDropPhrase extends Component<Props, State> {
  child: { current: null | DragAndDropArea };

  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  state = {
    allowSubmit: false,
  };

  checkCorrectSorting = () => {
    if (this.child.current) {
      this.child.current.checkSorting();
    }
  };

  enableSubmit = () => {
    this.setState({ allowSubmit: true });
  };

  render() {
    const { allowSubmit } = this.state;
    const { passphrase, previousStep, nextStep, handleSubmit } = this.props;
    return (
      <section className={styles.content}>
        <div className={styles.title}>
          <Heading
            appearance={{ size: 'mediumL', width: 'thin' }}
            text={MSG.heading}
          />
        </div>
        <div className={styles.subtitle}>
          <Heading
            appearance={{ size: 'normal', width: 'thin' }}
            text={MSG.subTitle}
          />
        </div>
        <div className={styles.wordContainer}>
          <DragAndDropArea
            ref={this.child}
            onAllDropped={this.enableSubmit}
            passphrase={passphrase}
            text={MSG.dragAndDropBox.defaultMessage}
          />
        </div>
        <div className={styles.buttonsForBox}>
          <Button
            appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
            value={MSG.backButton}
            onClick={handleSubmit(previousStep)}
          />
          {allowSubmit ? (
            <Button
              appearance={{ theme: 'primary' }}
              onClick={() => {
                handleSubmit(nextStep);
                this.checkCorrectSorting();
              }}
              value={MSG.nextButton}
            />
          ) : (
            <Button
              appearance={{ theme: 'tertiary' }}
              onClick={() => {
                handleSubmit(nextStep);
                this.checkCorrectSorting();
              }}
              value={MSG.nextButton}
            />
          )}
        </div>
      </section>
    );
  }
}

// get pass phrase from previous step
// will be passed in as props
const selector = formValueSelector('create_wallet');
const ConnectedDragAndDropPhrase = connect(state => ({
  passphrase: selector(state, 'pass_phrase_outer'),
}))(DragAndDropPhrase);

export default ConnectedDragAndDropPhrase;

export const reduxFormOpts = {};
