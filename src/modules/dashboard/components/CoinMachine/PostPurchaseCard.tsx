import React, { SetStateAction, Dispatch, useMemo } from 'react';
import {
  defineMessages,
  MessageDescriptor,
  FormattedMessage,
} from 'react-intl';

import Button, { Appearance as ButtonAppearance } from '~core/Button/Button';
import Card from '~core/Card';
import Heading from '~core/Heading';
import { PurchaseStatus } from './types';
import Countdown from '~core/Countdown';
import Link from '~core/Link';
import GroupList from '~core/GroupList';
import Numeral from '~core/Numeral';
import { OneToken } from '~data/index';

import styles from './PostPurchaseCard.css';
import ExternalLink from '~core/ExternalLink';

const MSG = defineMessages({
  rowTitlePurchasePrice: {
    id: 'dashboard.CoinMachine.PostPurchaseCard.rowTitlePurchasePrice',
    defaultMessage: 'For',
  },
});

interface MessageSetItem {
  body: MessageDescriptor;
  button: MessageDescriptor;
  buttonAdjacent?: MessageDescriptor;
  rowTitlePurchaseNumber: MessageDescriptor;
  title: MessageDescriptor;
}

const MSG_SET: Record<PurchaseStatus, MessageSetItem> = {
  [PurchaseStatus.Failure]: defineMessages({
    body: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Failure}.body`,
      defaultMessage: `Unfortunately, something went wrong and your
        transaction failed.
        {br}
        {br}
        Try increasing your gas price.
      `,
    },
    button: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Failure}.button`,
      defaultMessage: 'Try Again',
    },
    rowTitlePurchaseNumber: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Failure}.rowTitlePurchaseNumber`,
      defaultMessage: 'You tried to buy',
    },
    title: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Failure}.title`,
      defaultMessage: 'Transaction failed',
    },
  }),
  [PurchaseStatus.PartialSuccess]: defineMessages({
    body: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.PartialSuccess}.body`,
      defaultMessage: `Unfortunately, you didn't get quite as many
        tokens as you wanted. 😢 
        {br}
        {br}
        Better luck next time!
      `,
    },
    button: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.PartialSuccess}.button`,
      defaultMessage: '{timeUntilNextSale}',
    },
    buttonAdjacent: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.PartialSuccess}.buttonAdjacent`,
      defaultMessage: 'Next sale starts in',
    },
    rowTitlePurchaseNumber: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.PartialSuccess}.rowTitlePurchaseNumber`,
      defaultMessage: 'You bought',
    },
    title: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.PartialSuccess}.title`,
      defaultMessage: 'Partial success...',
    },
  }),
  [PurchaseStatus.Pending]: defineMessages({
    body: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Pending}.body`,
      defaultMessage: `Please don't leave this screen. 
        {br}
        {br}
        We're waiting for your transaction to be confirmed.
      `,
    },
    button: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Pending}.button`,
      defaultMessage: 'Pending',
    },
    rowTitlePurchaseNumber: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Pending}.rowTitlePurchaseNumber`,
      defaultMessage: 'You are trying to buy',
    },
    title: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Pending}.title`,
      defaultMessage: 'Please wait...',
    },
  }),
  [PurchaseStatus.Success]: defineMessages({
    body: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Success}.body`,
      defaultMessage: `Congratulations! You have made a considerably
        wise purchase.
        {br}
        {br}
        Now deposit them in <a>Locking</a> so they're ready to use.
      `,
    },
    button: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Success}.button`,
      defaultMessage: 'Buy Again',
    },
    rowTitlePurchaseNumber: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Success}.rowTitlePurchaseNumber`,
      defaultMessage: 'You bought',
    },
    title: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.Success}.title`,
      defaultMessage: 'Success! 🎉',
    },
  }),
  [PurchaseStatus.SuccessNetZero]: defineMessages({
    body: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.SuccessNetZero}.body`,
      defaultMessage: `Unfortunately, someone else was a little quicker. 😢
        {br}
        {br}
        Don't worry, you can try again in...
      `,
    },
    button: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.SuccessNetZero}.button`,
      defaultMessage: '{timeUntilNextSale}',
    },
    buttonAdjacent: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.SuccessNetZero}.buttonAdjacent`,
      defaultMessage: 'Next sale starts in',
    },
    rowTitlePurchaseNumber: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.SuccessNetZero}.rowTitlePurchaseNumber`,
      defaultMessage: 'You tried to buy',
    },
    title: {
      id: `dashboard.CoinMachine.PostPurchaseCard.${PurchaseStatus.SuccessNetZero}.title`,
      defaultMessage: `You didn't get any {symbol} this time`,
    },
  }),
};

interface Props {
  msRemaining: number;
  purchaseStatus: PurchaseStatus;
  setPurchaseStatus: Dispatch<SetStateAction<PurchaseStatus | null>>;
  token: OneToken;
}

const BUTTON_THEME: Record<PurchaseStatus, ButtonAppearance['theme']> = {
  [PurchaseStatus.Failure]: 'primary',
  [PurchaseStatus.PartialSuccess]: 'danger',
  [PurchaseStatus.Pending]: 'primary',
  [PurchaseStatus.Success]: 'primary',
  [PurchaseStatus.SuccessNetZero]: 'danger',
};

const displayName = 'dashboard.CoinMachine.PostPurchaseCard';

const PostPurchaseCard = ({
  msRemaining,
  purchaseStatus,
  setPurchaseStatus,
  token: { decimals, symbol },
}: Props) => {
  const statusMessages = MSG_SET[purchaseStatus];
  const listItems = useMemo(
    () => [
      {
        id: '1',
        title: statusMessages.rowTitlePurchaseNumber,
        // fixme use real `value` here
        extra: (
          <Numeral suffix={` ${symbol}`} unit={decimals} value={1 * 10 ** 18} />
        ),
      },
      {
        id: '2',
        title: MSG.rowTitlePurchasePrice,
        // fixme use real `value` here
        extra: <Numeral suffix=" ETH" unit="ether" value={1 * 10 ** 18} />,
      },
    ],
    [decimals, statusMessages.rowTitlePurchaseNumber, symbol],
  );

  return (
    <Card>
      <div className={styles.mainContent}>
        <div>
          <div className={styles.headingRow}>
            <div>
              <Heading
                appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}
                text={statusMessages.title}
                textValues={{ symbol }}
              />
            </div>
            <div>
              {/* fixme use real url here */}
              <ExternalLink href="https://etherscan.io" text="Etherscan" />
            </div>
          </div>
          <GroupList
            appearance={{ layout: 'compact', margin: 'none' }}
            items={listItems}
          />
          <div className={styles.bodyContainer}>
            <FormattedMessage
              {...statusMessages.body}
              values={{
                // fixme actually link to locking page once it exists
                a: (chunks) => <Link to="/">{chunks}</Link>,
                br: <br />,
              }}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          {statusMessages.buttonAdjacent && (
            <div className={styles.buttonAdjacent}>
              <Heading
                appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
                text={statusMessages.buttonAdjacent}
              />
            </div>
          )}
          <Button
            appearance={{ size: 'large', theme: BUTTON_THEME[purchaseStatus] }}
            loading={purchaseStatus === PurchaseStatus.Pending}
            onClick={() => setPurchaseStatus(null)}
          >
            <FormattedMessage
              {...statusMessages.button}
              values={{
                timeUntilNextSale: <Countdown msRemaining={msRemaining} />,
              }}
            />
          </Button>
        </div>
      </div>
    </Card>
  );
};

PostPurchaseCard.displayName = displayName;

export default PostPurchaseCard;
