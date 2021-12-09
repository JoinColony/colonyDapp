import React, { useState, useMemo, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import { useLoggedInUser } from '~data/index';
import { Address } from '~types/index';

import styles from './SynapsKYCDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CoinMachine.SynapsKYCEmailCaptureDialog.title',
    defaultMessage: 'Notification Address',
  },
  description: {
    id: 'dashboard.CoinMachine.SynapsKYCEmailCaptureDialog.description',
    defaultMessage: `This address is used to inform you in the event of your KYC application failing or requiring more data from you.`,
  },
  note: {
    id: 'dashboard.CoinMachine.SynapsKYCEmailCaptureDialog.note',
    defaultMessage: `Note that Colony does not store these addresses and providing one is completely optional on your part. The KYC process will be the same even if you haven't provided one.`,
  },
});

const displayName = 'dashboard.CoinMachine.SynapsKYCEmailCaptureDialog';

interface CustomDialogProps {
  colonyAddress: Address;
  onClose?: ({
    colonyAddress,
    emailAddress,
  }: {
    colonyAddress: string;
    emailAddress?: string;
  }) => void;
}

const validationSchema = yup.object({
  email: yup.string().email().nullable(),
});

type Props = DialogProps & CustomDialogProps;

const LOCALSTORAGE_KEY = 'kycData';

const SynapsKYCEmailCaptureDialog = ({
  cancel,
  close,
  colonyAddress,
  onClose,
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const getLocalStorageValues = useCallback(() => {
    const potentialStorageValues = localStorage.getItem(LOCALSTORAGE_KEY);
    if (potentialStorageValues && typeof potentialStorageValues === 'string') {
      try {
        return JSON.parse(potentialStorageValues);
      } catch (error) {
        return {};
      }
    }
    return {};
  }, []);
  const setLocalStorageValues = useCallback(
    (address, email) => {
      const existingValues = getLocalStorageValues();
      localStorage.setItem(
        LOCALSTORAGE_KEY,
        JSON.stringify({
          ...existingValues,
          [address]: email,
        }),
      );
    },
    [getLocalStorageValues],
  );

  const availableEmailAddress = useMemo(() => {
    const existingValues = getLocalStorageValues();
    return existingValues[walletAddress] || '';
  }, [getLocalStorageValues, walletAddress]);

  const [emailAddressValue, setEmailAddressValue] = useState(
    availableEmailAddress,
  );

  const handleOpenSynapseKYCDialog = () => {
    if (emailAddressValue) {
      setLocalStorageValues(walletAddress, emailAddressValue);
    }
    close();
    if (onClose) {
      onClose({ colonyAddress, emailAddress: emailAddressValue });
    }
  };

  return (
    <Form
      onSubmit={() => {}}
      initialValues={{
        email: availableEmailAddress,
      }}
      validationSchema={validationSchema}
      validateOnChange
    >
      {({ isValid, validateField }) => (
        <Dialog cancel={cancel}>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.modalHeading}>
              <Heading
                appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
                text={MSG.title}
              />
            </div>
          </DialogSection>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.emailContent}>
              <div className={styles.emailDescription}>
                <FormattedMessage {...MSG.description} />
              </div>
              <Input
                label={{ id: 'label.email' }}
                name="email"
                appearance={{ colorSchema: 'grey', theme: 'fat' }}
                help={{ id: 'label.optional' }}
                placeholder="Your email address"
                onChange={(event) => {
                  setEmailAddressValue(event.target.value);
                  validateField('email');
                }}
              />
              <div className={styles.emailNote}>
                <FormattedMessage {...MSG.note} />
              </div>
            </div>
          </DialogSection>
          <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              text={{ id: 'button.next' }}
              onClick={handleOpenSynapseKYCDialog}
              disabled={!isValid}
              // type="submit"
            />
          </DialogSection>
        </Dialog>
      )}
    </Form>
  );
};

SynapsKYCEmailCaptureDialog.displayName = displayName;

export default SynapsKYCEmailCaptureDialog;
