/* @flow */

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
  titleBox: {
    id: 'CreateWallet.DragAndDropPhrase.titleBox',
    defaultMessage: 'Drag your Mnemonic Phrase in the right order',
  },
});

class DragAndDropPhrase extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  state = {
    nextStep: this.props.nextStep,
    previousStep: this.props.previousStep,
    handleSubmit: this.props.handleSubmit,
    passphrase: this.props.passphrase,
  };

  checkCorrectSorting = () => {
    this.child.current.checkSorting();
  };

  render() {
    return (
      <section className={`${styles.content}`}>
        <div className={`${styles.title}`}>
          <Heading appearance={{ size: 'thinner' }} text={MSG.heading} />
        </div>
        <div className={`${styles.subtitle}`}>
          <Heading appearance={{ size: 'thinNormal' }} text={MSG.subTitle} />
        </div>
        <Heading
          appearance={{ size: 'boldSmall' }}
          text={MSG.titleBox}
          className={`${styles.heading}`}
        />
        <div className={`${styles.wordContainer}`}>
          <DragAndDropArea
            ref={this.child}
            phrase={this.state.passphrase}
            text={MSG.dragAndDropBox.defaultMessage}
          />
        </div>
        <div className={`${styles.buttonsForBox}`}>
          <Button
            appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
            value={MSG.backButton}
            onClick={this.state.handleSubmit(this.state.previousStep)}
          />
          <Button
            onClick={() => {
              this.state.handleSubmit(this.state.nextStep);
              this.checkCorrectSorting();
            }}
            value={MSG.nextButton}
          />
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
