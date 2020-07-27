import { FormikBag } from 'formik';
import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { defineMessages } from 'react-intl';
import { messages as metaMaskMessages, open } from '@purser/metamask';

import { WizardProps } from '~core/Wizard';
import { mergePayload } from '~utils/actions';
import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { ActionForm } from '~core/Fields';
import WalletInteraction from '~users/GasStation/WalletInteraction';
import { ActionTypes } from '~redux/index';
import { WalletKind } from '~immutable/index';
import styles from './StepMetaMask.css';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepMetaMask.heading',
    defaultMessage: "You're connected to MetaMask",
  },
  subHeading: {
    id: 'users.ConnectWalletWizard.StepMetaMask.subHeading',
    defaultMessage: 'Would you like to access Colony with that?',
  },
  errorHeading: {
    id: 'users.ConnectWalletWizard.StepMetaMask.errorHeading',
    defaultMessage: `{metamaskError, select,
      notAuthorized {MetaMask is not authorized to access this domain.}
      cancelSign {Signing of the MetaMask authorization message was cancelled.}
      notAvailable {The MetaMask extension is not available.}
      other {Oops! We were unable to detect MetaMask.}
    }`,
  },
  errorOpenMetamask: {
    id: 'users.ConnectWalletWizard.StepMetaMask.errorOpenMetamask',
    defaultMessage: 'We could not connect to MetaMask',
  },
  buttonAdvance: {
    id: 'users.ConnectWalletWizard.StepMetaMask.button.advance',
    defaultMessage: 'Continue',
  },
  buttonBack: {
    id: 'users.ConnectWalletWizard.StepMetaMask.button.back',
    defaultMessage: 'Back',
  },
  buttonRetry: {
    id: 'users.ConnectWalletWizard.StepMetaMask.button.retry',
    defaultMessage: 'Try Again',
  },
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FormValues {}

type Props = {
  simplified?: boolean;
} & WizardProps<FormValues>;

interface State {
  isLoading: boolean;
  isValid: boolean;
  metamaskError: string | null;
}

const displayName = 'users.ConnectWalletWizard.StepMetaMask';

const MetaMask = ({
  nextStep,
  resetWizard,
  wizardForm,
  wizardValues,
  simplified = false,
}: Props) => {
  const timerHandle = useRef<number>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [metamaskError, setMetamaskError] = useState<string | null>(null);

  const connectMetaMask = useCallback(async () => {
    const {
      didNotAuthorize,
      cancelMessageSign,
      metamaskNotAvailable,
    } = metaMaskMessages;
    let mmError;
    let wallet;
    try {
      wallet = await open();
    } catch (error) {
      mmError = error.message;
      if (error.message.includes(didNotAuthorize)) {
        mmError = 'notAuthorized';
      }
      if (error.message.includes(cancelMessageSign)) {
        mmError = 'cancelSign';
      }
      if (error.message.includes(metamaskNotAvailable)) {
        mmError = 'notAvailable';
      }
    }
    setIsValid(!mmError || !!(wallet && wallet.ensAddress));
    setIsLoading(false);
    setMetamaskError(mmError);
  }, []);

  const handleRetryClick = useCallback(
    (evt: SyntheticEvent<HTMLButtonElement>) => {
      evt.preventDefault();
      setIsLoading(true);

      /*
       * This is here only to show a spinner on the button after being clicked
       * Without this, the user can't tell if the click actually registered
       */
      if (window) {
        timerHandle.current = window.setTimeout(async () => {
          await connectMetaMask();
        }, 500);
      }
    },
    [connectMetaMask],
  );

  useEffect(() => {
    const connect = async () => {
      try {
        await connectMetaMask();
      } catch (err) {
        console.error(err);
      }
    };

    connect();

    // Cleanup timeout
    return () => {
      if (window) {
        window.clearTimeout(timerHandle.current);
      }
    };
  }, [connectMetaMask]);

  return (
    <ActionForm
      submit={ActionTypes.WALLET_CREATE}
      success={ActionTypes.USER_CONTEXT_SETUP_SUCCESS}
      error={ActionTypes.WALLET_CREATE_ERROR}
      onError={(_: string, { setStatus }: FormikBag<object, FormValues>) => {
        setStatus({ error: MSG.errorOpenMetamask });
      }}
      onSuccess={(values) => nextStep({ ...values })}
      transform={mergePayload(wizardValues)}
      {...wizardForm}
    >
      {({ isSubmitting, status }) => (
        <main>
          <div
            className={simplified ? styles.contentSimplified : styles.content}
          >
            <div className={styles.iconContainer}>
              <Icon
                name="metamask"
                title={{ id: 'wallet.metamask' }}
                appearance={{ size: 'medium' }}
              />
            </div>
            {isValid ? (
              <>
                <Heading
                  text={MSG.heading}
                  appearance={{ size: 'medium', margin: 'none' }}
                />
                <Heading
                  text={MSG.subHeading}
                  appearance={{ size: 'medium', margin: 'none' }}
                />
              </>
            ) : (
              <Heading
                text={status && status.error ? status.error : MSG.errorHeading}
                textValues={{ metamaskError }}
                appearance={{ size: 'medium', margin: 'none' }}
              />
            )}
          </div>
          {isValid && (
            <div className={styles.interactionPrompt}>
              <WalletInteraction walletKind={WalletKind.MetaMask} />
            </div>
          )}
          <div className={styles.actions}>
            <Button
              text={MSG.buttonBack}
              appearance={{ theme: 'secondary', size: 'large' }}
              onClick={resetWizard}
            />
            {isValid ? (
              <Button
                text={MSG.buttonAdvance}
                appearance={{ theme: 'primary', size: 'large' }}
                type="submit"
                loading={isLoading || isSubmitting}
              />
            ) : (
              <Button
                text={MSG.buttonRetry}
                appearance={{ theme: 'primary', size: 'large' }}
                onClick={handleRetryClick}
                loading={isLoading || isSubmitting}
              />
            )}
          </div>
        </main>
      )}
    </ActionForm>
  );
};

MetaMask.displayName = displayName;

export default MetaMask;
