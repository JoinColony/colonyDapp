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
});

declare module 'DragDropArea' {
  declare module.exports: any;
}

type Function = () => void;
type DragProps = {
  nextStep: Function,
  previousStep: Function,
  handleSubmit: Function,
  passphrase: string,
};
type DragState = {
  nextStep: Function,
  previousStep: Function,
  handleSubmit: Function,
  passphrase: string,
  child?: any,
  allowSubmit: boolean,
};

class DragAndDropPhrase extends Component<DragProps, DragState> {
  constructor(props) {
    super(props);
    // $FlowFixMe
    this.child = React.createRef();
  }

  state = {
    nextStep: this.props.nextStep,
    previousStep: this.props.previousStep,
    handleSubmit: this.props.handleSubmit,
    passphrase: this.props.passphrase,
    allowSubmit: false,
  };

  checkCorrectSorting = () => {
    // $FlowFixMe
    this.child.current.checkSorting();
  };

  enableSubmit = () => {
    this.setState({ allowSubmit: true });
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
        <div className={`${styles.wordContainer}`}>
          <DragAndDropArea
            // $FlowFixMe
            ref={this.child}
            onAllDropped={this.enableSubmit}
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
          {this.state.allowSubmit ? (
            <Button
              appearance={{ theme: 'primary' }}
              onClick={() => {
                this.state.handleSubmit(this.state.nextStep);
                this.checkCorrectSorting();
              }}
              value={MSG.nextButton}
            />
          ) : (
            <Button
              appearance={{ theme: 'tertiary' }}
              onClick={() => {
                this.state.handleSubmit(this.state.nextStep);
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
