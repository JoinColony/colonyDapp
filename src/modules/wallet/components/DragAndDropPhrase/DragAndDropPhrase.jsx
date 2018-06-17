/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import PropTypes from 'prop-types';
import type { FormProps } from '~types/forms';

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

type Props = FormProps<CustomProps>;


const DragAndDropPhrase = ({
  nextStep,
  handleSubmit,
  submitting,
  onDragEnd,
}: Props) => (
  <section className={`${styles.content}`}>
    <div className={`${styles.title}`}>
      <Heading appearance={{ size: 'thinner' }} text={MSG.heading} />
    </div>
    <div className={`${styles.subtitle}`}>
      <Heading appearance={{ size: 'thinNormal' }} text={MSG.subTitle} />
    </div>
    <div className={`${styles.greyBox}`}>
      {MSG.dragAndDropBox.defaultMessage}
    </div>
    <div className={`${styles.wordContainer}`}>
      <DragAndDropArea />
    </div>
    <div className={`${styles.buttonsForBox}`}>
      <Button
        appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
        value={MSG.backButton}
      />
      <Button onClick={handleSubmit(nextStep)} value={MSG.nextButton} />
    </div>
  </section>
);

export default DragAndDropPhrase;
