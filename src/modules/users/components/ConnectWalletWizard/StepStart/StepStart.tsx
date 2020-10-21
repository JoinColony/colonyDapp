import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { WizardProps } from '~core/Wizard';
import { WalletMethod } from '~immutable/index';
import { isDev } from '~utils/debug';
import Heading from '~core/Heading';
import { Form } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';
import DecisionHub, { DecisionOption } from '~core/DecisionHub';
import { CREATE_WALLET_ROUTE } from '~routes/index';
import styles from './StepStart.css';
import { useAutoLogin } from '~utils/autoLogin';
import { SpinnerLoader } from '~core/Preloaders';
import { DEFAULT_NETWORK_INFO } from '~constants';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepStart.heading',
    defaultMessage: 'Connect Wallet to Log in',
  },
  subTitle: {
    id: 'users.ConnectWalletWizard.StepStart.subTitle',
    defaultMessage: `Each Colony account is accessed through an associated {networkName} wallet. You can use an existing wallet that you own, or create a new wallet below.`,
  },
  createWalletTitle: {
    id: 'users.ConnectWalletWizard.StepStart.createWalletTitle',
    defaultMessage: 'Need a wallet? Let us help.',
  },
  createWalletSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.createWalletSubtitle',
    defaultMessage: 'Create an Etherum wallet to join',
  },
  ganacheTitle: {
    id: 'users.ConnectWalletWizard.StepStart.ganacheTitle',
    defaultMessage: 'Ganache',
  },
  mnemonicTitle: {
    id: 'users.ConnectWalletWizard.StepStart.mnemonicTitle',
    defaultMessage: 'Mnemonic Phrase',
  },
  metaMaskSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.metaMaskSubtitle',
    defaultMessage: 'Requires MetaMask browser extension',
  },
  mnemonicSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.mnemonicSubtitle',
    defaultMessage: 'Access with your mnemonic',
  },
  ganacheSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.ganacheSubtitle',
    defaultMessage: 'Use wallet from Ganache (dev mode only)',
  },
  agreeToUseDapp: {
    id: 'users.ConnectWalletWizard.StepStart.agreeToUseDapp',
    defaultMessage: 'By using our App, you agree to our {tos}.',
  },
  termsOfService: {
    id: 'users.ConnectWalletWizard.StepStart.termsOfService',
    defaultMessage: 'Terms and Conditions',
  },
  agreeToUseDappSimplified: {
    id: 'users.ConnectWalletWizard.StepStart.agreeToUseDappSimplified',
    defaultMessage: 'By signing in I accept {tos}.',
  },
});

type FormValues = {
  method: WalletMethod;
};

const displayName = 'users.ConnectWalletWizard.StepStart';

const options = [
  {
    value: WalletMethod.MetaMask,
    title: { id: 'wallet.metamask' },
    subtitle: MSG.metaMaskSubtitle,
    icon: 'metamask',
  },
  {
    value: WalletMethod.Mnemonic,
    title: MSG.mnemonicTitle,
    subtitle: MSG.mnemonicSubtitle,
    icon: 'wallet',
  },
];

// process.env.DEV is set by the QA server in case we want to have a debug build. We don't have access to ganache then
if (isDev && !process.env.DEV) {
  options.push({
    value: WalletMethod.Ganache,
    title: MSG.ganacheTitle,
    subtitle: MSG.ganacheSubtitle,
    icon: 'wallet',
  });
}

const createWalletOption = {
  value: null,
  title: MSG.createWalletTitle,
  subtitle: MSG.createWalletSubtitle,
  icon: 'hugging',
};

type Props = {
  simplified?: boolean;
} & WizardProps<FormValues>;

const StepStart = ({ nextStep, wizardValues, simplified = false }: Props) => {
  const attemptingAutoLogin = useAutoLogin();
  const tos = (
    <ExternalLink
      text={MSG.termsOfService}
      href="https://colony.io/pdf/terms.pdf"
    />
  );
  return (
    <Form onSubmit={nextStep} initialValues={wizardValues}>
      <main className={styles.content}>
        {attemptingAutoLogin && (
          <div className={styles.autoLoginOverlay}>
            <div className={styles.autoLoginSpinner}>
              <SpinnerLoader appearance={{ size: 'large' }} />
            </div>
          </div>
        )}
        <div className={simplified ? styles.titleSimplified : styles.title}>
          <Heading
            appearance={{ size: 'medium', weight: 'thin' }}
            text={MSG.heading}
          />
        </div>
        {!simplified && (
          <div className={styles.subtitle}>
            <Heading
              appearance={{ size: 'normal', weight: 'thin' }}
              text={MSG.subTitle}
              textValues={{ networkName: DEFAULT_NETWORK_INFO.name }}
            />
          </div>
        )}
        {!simplified && (
          <div className={styles.subtitle}>
            <Heading appearance={{ size: 'normal', weight: 'thin' }}>
              <FormattedMessage {...MSG.agreeToUseDapp} values={{ tos }} />
            </Heading>
          </div>
        )}
        <DecisionHub name="method" options={options} />
        <div className={styles.createWalletLink} data-test="createWalletLink">
          <DecisionOption
            appearance={{ theme: 'alt' }}
            name="method"
            option={createWalletOption}
            link={CREATE_WALLET_ROUTE}
          />
        </div>
        {simplified && (
          <div className={styles.tosSimplified}>
            <Heading appearance={{ size: 'normal', weight: 'thin' }}>
              <FormattedMessage
                {...MSG.agreeToUseDappSimplified}
                values={{ tos }}
              />
            </Heading>
          </div>
        )}
      </main>
    </Form>
  );
};

StepStart.displayName = displayName;

export default StepStart;
