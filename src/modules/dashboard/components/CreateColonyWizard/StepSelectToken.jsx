/* @flow */

import type { FormikBag } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import FileUpload from '~core/FileUpload';

import styles from './StepSelectToken.css';

import TokenSelector from './TokenSelector.jsx';

type TokenData = ?{
  name: string,
  symbol: string,
};

type FormValues = {
  tokenAddress: string,
  tokenSymbol?: string,
  tokenName?: string,
  iconUpload?: string,
  tokenData: ?TokenData,
};

type Bag = FormikBag<Object, FormValues>;
type SetFieldValue = $PropertyType<Bag, 'setFieldValue'>;

type State = {
  tokenData: ?TokenData,
};

type Props = WizardProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.heading',
    defaultMessage: 'Select an existing ERC20 Token',
  },
  symbolHint: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.symbolHint',
    defaultMessage: 'Max of 6 characters',
  },
  tokenName: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.tokenName',
    defaultMessage: 'Token Name',
  },
  tokenSymbol: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.tokenSymbol',
    defaultMessage: 'Token Symbol',
  },
  cancel: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.back',
    defaultMessage: 'Back',
  },
  next: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.next',
    defaultMessage: 'Next',
  },
  invalidAddress: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.invalidAddress',
    defaultMessage:
      'Not a valid token address. Check: https://etherscan.io/tokens',
  },
  fileUploadTitle: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.fileUpload',
    defaultMessage: 'Token Icon (.svg or .png)',
  },
  fileUploadHint: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.fileUploadHint',
    defaultMessage: 'Recommended size for .png file is 60px by 60px, up to 1MB',
  },
});

export const validationSchema = yup.object({
  tokenAddress: yup.string().address(MSG.invalidAddress),
  tokenSymbol: yup.string().max(6),
  tokenName: yup.string(),
});

// TODO in #453 - show inputs for minimal ERC20 contracts
class StepSelectToken extends Component<Props, State> {
  static displayName = 'dashboard.CreateColonyWizard.StepSelectToken';

  constructor(props: Props) {
    super(props);
    this.state = { tokenData: undefined };
  }

  handleTokenSelect = (tokenData: TokenData, setFieldValue: SetFieldValue) => {
    this.setState({ tokenData });
    if (tokenData) {
      setFieldValue('tokenName', tokenData.name);
      setFieldValue('tokenSymbol', tokenData.symbol);
    }
  };

  render() {
    const { nextStep, previousStep, wizardForm } = this.props;
    const { tokenData } = this.state;
    return (
      <section className={styles.main}>
        <div className={styles.title}>
          <Heading
            appearance={{ size: 'medium', weight: 'thin' }}
            text={MSG.heading}
          />
        </div>
        <Form
          className={styles.nameForm}
          onSubmit={nextStep}
          validationSchema={validationSchema}
          {...wizardForm}
        >
          {({ isValid, setFieldValue, values }) => (
            <div>
              <TokenSelector
                tokenAddress={values.tokenAddress}
                onTokenSelect={data =>
                  this.handleTokenSelect(data, setFieldValue)
                }
                tokenData={tokenData}
              />
              {values.tokenAddress &&
                tokenData === null && (
                  <Fragment>
                    <div className={styles.tokenDetails}>
                      <Input name="tokenName" label={MSG.tokenName} />
                    </div>
                    <div className={styles.tokenDetails}>
                      <Input
                        name="tokenSymbol"
                        label={MSG.tokenSymbol}
                        hint={
                          <Heading
                            appearance={{ size: 'small', weight: 'thin' }}
                            text={MSG.symbolHint}
                          />
                        }
                      />
                    </div>
                    <div className={styles.tokenDetails}>
                      <FileUpload
                        accept={['svg', 'png']}
                        label={MSG.fileUploadTitle}
                        name="iconUpload"
                        status={MSG.fileUploadHint}
                        maxFilesLimit={1}
                      />
                    </div>
                  </Fragment>
                )}
              <div className={styles.buttons}>
                <Button
                  appearance={{ theme: 'secondary' }}
                  text={MSG.cancel}
                  onClick={() => previousStep(values)}
                />
                <Button
                  appearance={{ theme: 'primary' }}
                  type="submit"
                  disabled={!isValid}
                  text={MSG.next}
                />
              </div>
            </div>
          )}
        </Form>
      </section>
    );
  }
}

export default StepSelectToken;
