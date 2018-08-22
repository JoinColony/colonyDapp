/* @flow */
import type { FormikBag, FormikErrors, FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import { withFormik } from 'formik';

import Textarea from '../../../../core/components/Fields/Textarea';
import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
import styles from './Mnemonic.css';

const MSG = defineMessages({
  heading: {
    id: 'ConnectWallet.providers.Mnemonic.heading',
    defaultMessage: 'Access Colony with your Mnemonic Phrase',
  },
  instructionText: {
    id: 'ConnectWallet.providers.Mnemonic.instructionText',
    defaultMessage: 'Your Mnemonic Phrase',
  },
  errorDescription: {
    id: 'ConnectWallet.providers.Mnemonic.errorDescription',
    defaultMessage: 'Oops, there is something wrong',
  },
  mnemonicRequired: {
    id: 'ConnectWallet.providers.Mnemonic.mnemonicRequired',
    defaultMessage: 'You must provide a mnemonic phrase.',
  },
  buttonAdvanceText: {
    id: 'ConnectWallet.providers.Mnemonic.button.advance',
    defaultMessage: 'Go to Colony',
  },
  buttonBackText: {
    id: 'ConnectWallet.providers.Mnemonic.button.back',
    defaultMessage: 'Back',
  },
});

type FormValues = {
  connectwalletmnemonic: string,
};

type Props = FormikProps<FormValues> & {
  handleDidConnectWallet: () => void,
  handleExit: (evt: SyntheticEvent<HTMLButtonElement>) => void,
};

const Mnemonic = ({
  handleSubmit,
  handleExit,
  isSubmitting,
  isValid,
}: Props) => (
  <form onSubmit={handleSubmit}>
    <div className={styles.content}>
      <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
      <Textarea label={MSG.instructionText} name="connectwalletmnemonic" />
    </div>
    <div className={styles.actions}>
      <Button
        appearance={{ theme: 'secondary', size: 'large' }}
        text={MSG.buttonBackText}
        onClick={handleExit}
      />
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        disabled={!isValid}
        text={MSG.buttonAdvanceText}
        type="submit"
        loading={isSubmitting}
      />
    </div>
  </form>
);

const enhance = withFormik({
  mapPropsToValues: () => ({
    connectwalletmnemonic: '',
  }),
  validate: (values: FormValues): FormikErrors<FormValues> => {
    const errors = {};
    if (!values.connectwalletmnemonic) {
      errors.connectwalletmnemonic = MSG.mnemonicRequired;
    }
    return errors;
  },
  handleSubmit: (values: FormValues, otherProps: FormikBag<Object, *>) => {
    const {
      props: { handleDidConnectWallet },
    } = otherProps;
    handleDidConnectWallet();
  },
});

export default enhance(Mnemonic);
