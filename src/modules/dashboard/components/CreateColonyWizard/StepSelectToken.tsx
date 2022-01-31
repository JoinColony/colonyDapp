import { $PropertyType } from 'utility-types';
import { FormikBag } from 'formik';
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';
import { AddressZero } from 'ethers/constants';

import { DEFAULT_NETWORK_TOKEN } from '~constants';
import { WizardProps } from '~core/Wizard';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { multiLineTextEllipsis } from '~utils/strings';
import ENS from '~lib/ENS';
import { OneToken } from '~data/index';

import TokenSelector from './TokenSelector';

import styles from './StepSelectToken.css';

interface FormValues {
  tokenAddress: string;
  tokenChoice: 'create' | 'select';
  tokenSymbol?: string;
  tokenName?: string;
  tokenIcon?: string;
  tokenData: OneToken | null;
  colonyName: string;
}

type Bag = FormikBag<object, FormValues>;
type SetFieldValue = $PropertyType<Bag, 'setFieldValue'>;

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.heading',
    defaultMessage: 'Which ERC20 token would you like to use for {colony}',
  },
  symbolHint: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.symbolHint',
    defaultMessage: 'Max of 5 characters',
  },
  tokenName: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.tokenName',
    defaultMessage: 'Token Name',
  },
  tokenSymbol: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.tokenSymbol',
    defaultMessage: 'Token Symbol',
  },
  continue: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.continue',
    defaultMessage: 'Continue',
  },
  invalidAddress: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.invalidAddress',
    defaultMessage:
      'Not a valid token. Only ERC20 tokens with 18 decimals are supported.',
  },
  addressZeroError: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.addressZeroError',
    defaultMessage:
      'You cannot use {symbol} token as a native token for colony.',
  },
  link: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.link',
    defaultMessage: 'I want to create a New Token',
  },
  fileUploadTitle: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.fileUpload',
    defaultMessage: 'Token Icon (optional)',
  },
  fileUploadHint: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.fileUploadHint',
    defaultMessage: 'Recommended format: .png or .svg',
  },
});

export const validationSchema = (addressZeroErrorMessage) =>
  yup.object({
    tokenAddress: yup
      .string()
      .address(() => MSG.invalidAddress)
      .test(
        'is-not-addressZero',
        addressZeroErrorMessage,
        (value) => value !== AddressZero,
      ),
    tokenSymbol: yup.string().max(10),
    tokenName: yup.string().max(256),
  });

const StepSelectToken = ({
  nextStep,
  previousStep,
  stepCompleted,
  wizardForm: { initialValues },
  wizardValues,
}: Props) => {
  const [tokenData, setTokenData] = useState<OneToken | undefined>();
  const { formatMessage } = useIntl();
  const [isCheckingAddress, setIsCheckingAddress] = useState<boolean>(false);
  const [tokenSelectorHasError, setTokenSelectorHasError] = useState<boolean>(
    true,
  );

  const handleCheckingAddress = (isChecking: boolean) => {
    setIsCheckingAddress(isChecking);
  };

  const handleTokenSelect = (token: OneToken, setFieldValue: SetFieldValue) => {
    setTokenData(token);
    if (token) {
      setFieldValue('tokenName', token.name);
      setFieldValue('tokenSymbol', token.symbol);
    }
  };

  const handleTokenSelectError = (hasError: boolean) => {
    setTokenSelectorHasError(hasError);
  };

  const goToTokenCreate = useCallback(() => {
    /* This is a custom link since it goes to a sibling step that appears
      to be parallel to this one after the wizard steps diverge,
      while making sure that the data form the previous wizard steps doesn't get lost
    */
    const wizardValuesCopy: FormValues = { ...wizardValues };
    previousStep();
    wizardValuesCopy.tokenChoice = 'create';
    nextStep(wizardValuesCopy);
  }, [wizardValues, nextStep, previousStep]);

  return (
    <section className={styles.main}>
      <div className={styles.title}>
        <Heading appearance={{ size: 'medium', weight: 'bold' }}>
          <FormattedMessage
            {...MSG.heading}
            values={{
              /*
               * @NOTE We need to use a JS string truncate here, rather then CSS,
               * since we're dealing with a string that needs to be truncated,
               * inside a sentence that does not
               */
              colony: (
                <span title={ENS.normalizeAsText(wizardValues.colonyName)}>
                  {multiLineTextEllipsis(
                    ENS.normalizeAsText(wizardValues.colonyName),
                    38,
                  )}
                </span>
              ),
            }}
          />
        </Heading>
      </div>
      <Form
        onSubmit={nextStep}
        validationSchema={validationSchema(
          formatMessage(MSG.addressZeroError, {
            symbol: DEFAULT_NETWORK_TOKEN.symbol,
          }),
        )}
        initialValues={initialValues}
      >
        {({ dirty, isValid, setFieldValue, values }) => (
          <div>
            <TokenSelector
              tokenAddress={values.tokenAddress}
              onTokenSelect={(token: OneToken) =>
                handleTokenSelect(token, setFieldValue)
              }
              onTokenSelectError={handleTokenSelectError}
              onCheckingAddress={handleCheckingAddress}
              tokenData={tokenData}
              extra={
                <button
                  type="button"
                  className={styles.linkToOtherStep}
                  tabIndex={-2}
                  onClick={goToTokenCreate}
                >
                  <FormattedMessage {...MSG.link} />
                </button>
              }
              appearance={{ theme: 'fat' }}
            />
            {values.tokenAddress && !tokenData && (
              <>
                <div className={styles.tokenDetails}>
                  <Input
                    name="tokenName"
                    label={MSG.tokenName}
                    appearance={{ theme: 'fat' }}
                  />
                </div>
                <div className={styles.tokenDetails}>
                  <Input
                    name="tokenSymbol"
                    label={MSG.tokenSymbol}
                    help={MSG.symbolHint}
                    formattingOptions={{ uppercase: true, blocks: [5] }}
                    appearance={{ theme: 'fat' }}
                  />
                </div>
              </>
            )}
            <div className={styles.buttons}>
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                type="submit"
                text={MSG.continue}
                disabled={
                  tokenSelectorHasError ||
                  !isValid ||
                  (!dirty && !stepCompleted) ||
                  isCheckingAddress
                }
              />
            </div>
          </div>
        )}
      </Form>
    </section>
  );
};

StepSelectToken.displayName = 'dashboard.CreateColonyWizard.StepSelectToken';

export default StepSelectToken;
