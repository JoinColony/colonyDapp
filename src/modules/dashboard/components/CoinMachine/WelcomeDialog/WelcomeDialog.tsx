import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import ExternalLink from '~core/ExternalLink';
import Heading from '~core/Heading';

import styles from './WelcomeDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CoinMachine.WelcomeDialog.title',
    defaultMessage: 'Welcome to the Metacolony Coin Machine',
  },
  description: {
    id: 'dashboard.CoinMachine.WelcomeDialog.description',
    defaultMessage: `This Coin Machine sells a maximum of 36,000 CLNY every eight hours at a fixed price.\n\nIf the number of tokens sold are above the target, price will go up in the next sale, if it’s below the target, price will go down in the next sale. <a>Learn more.</a>`,
  },
  buttonText: {
    id: 'dashboard.CoinMachine.WelcomeDialog.buttonText',
    defaultMessage: 'Got it!',
  },
  saleLengthLabel: {
    id: 'dashboard.CoinMachine.WelcomeDialog.saleLengthLabel',
    defaultMessage: 'Sale length',
  },
  targetLabel: {
    id: 'dashboard.CoinMachine.WelcomeDialog.targetLabel',
    defaultMessage: 'Target',
  },
  limitLabel: {
    id: 'dashboard.CoinMachine.WelcomeDialog.limitLabel',
    defaultMessage: 'Limit',
  },
});

const displayName = 'dashboard.CoinMachine.WelcomeDialog';
const COIN_MACHINE_HELP_LINK = '#';

const WelcomeDialog = ({ cancel }: DialogProps) => {
  const saleData = [
    {
      title: MSG.saleLengthLabel,
      value: '8 hours',
    },
    {
      title: MSG.targetLabel,
      value: '18,000 CLNY',
    },
    {
      title: MSG.limitLabel,
      value: '36,000 CLNY',
    },
  ];

  return (
    <Dialog cancel={cancel}>
      <div className={styles.container}>
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.modalHeading}>
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
          </div>
          <div className={styles.modalContent}>
            <FormattedMessage
              {...MSG.description}
              values={{
                a: (chunks) => (
                  <ExternalLink
                    href={COIN_MACHINE_HELP_LINK}
                    className={styles.link}
                  >
                    {chunks}
                  </ExternalLink>
                ),
              }}
            />
          </div>
        </DialogSection>
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.dataContainer}>
            {saleData.map((data) => (
              <div className={styles.dataItem}>
                <Heading
                  appearance={{ size: 'normal', margin: 'none', theme: 'dark' }}
                  text={data.title}
                />
                <span className={styles.itemValue}>{data.value}</span>
              </div>
            ))}
          </div>
        </DialogSection>
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.confirmButtonContainer}>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              text={MSG.buttonText}
              onClick={cancel}
            />
          </div>
        </DialogSection>
      </div>
    </Dialog>
  );
};

WelcomeDialog.displayName = displayName;

export default WelcomeDialog;
