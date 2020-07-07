import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Numeral from '~core/Numeral';
import Dialog, { DialogSection, DialogProps } from '~core/Dialog';
import OverviewList, { OverviewListItem } from '~core/OverviewList';
import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CoinMachine.CoinMachineWelcomeDialog.title',
    defaultMessage: 'Welcome to the {colonyDisplayName} Coin Machine',
  },
  welcomeText: {
    id: 'dashboard.CoinMachine.CoinMachineWelcomeDialog.welcomeText',
    defaultMessage: `This Coin Machine sells a maximum of 36,000 CLNY every eight hours at a fixed price. If the number of tokens sold are above the target, price will go up in the next sale, if it’s below the target, price will go down in the next sale. {link}`,
  },
  saleLengthTitle: {
    id: 'dashboard.CoinMachine.CoinMachineWelcomeDialog.saleLengthTitle',
    defaultMessage: `Sale length`,
  },
  saleLengthText: {
    id: 'dashboard.CoinMachine.CoinMachineWelcomeDialog.saleLengthText',
    defaultMessage: `8 hours`,
  },
  targetTitle: {
    id: 'dashboard.CoinMachine.CoinMachineWelcomeDialog.targetTitle',
    defaultMessage: `Target`,
  },
  limitTitle: {
    id: 'dashboard.CoinMachine.CoinMachineWelcomeDialog.limitTitle',
    defaultMessage: `Limit`,
  },
});

const LEARN_MORE_LINK = 'https://help.colony.io/docs/en/coinmachine';

interface Props extends DialogProps {
  colonyDisplayName: string;
  tokenSymbol: string;
}

const CoinMachineWelcomeDialog = ({
  cancel,
  close,
  colonyDisplayName,
  tokenSymbol,
}: Props) => {
  // @TODO get from somewhere
  const targetAmount = 18000;
  const limitAmount = 36000;
  return (
    <Dialog cancel={cancel}>
      <DialogSection>
        <Heading
          appearance={{ margin: 'none', size: 'medium' }}
          text={MSG.title}
          textValues={{ colonyDisplayName }}
        />
      </DialogSection>
      <DialogSection appearance={{ border: 'top' }}>
        <FormattedMessage
          {...MSG.welcomeText}
          values={{
            link: (
              <ExternalLink
                text={{ id: 'text.learnMore' }}
                href={LEARN_MORE_LINK}
              />
            ),
          }}
        />
      </DialogSection>
      <DialogSection>
        <OverviewList>
          <OverviewListItem title={MSG.saleLengthTitle}>
            <FormattedMessage {...MSG.saleLengthText} />
          </OverviewListItem>
          <OverviewListItem title={MSG.targetTitle}>
            <Numeral value={targetAmount} suffix={` ${tokenSymbol}`} />
          </OverviewListItem>
          <OverviewListItem title={MSG.limitTitle}>
            <Numeral value={limitAmount} suffix={` ${tokenSymbol}`} />
          </OverviewListItem>
        </OverviewList>
      </DialogSection>
      <DialogSection appearance={{ align: 'center' }}>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={{ id: 'button.ok' }}
          onClick={close}
        />
      </DialogSection>
    </Dialog>
  );
};

export default CoinMachineWelcomeDialog;
