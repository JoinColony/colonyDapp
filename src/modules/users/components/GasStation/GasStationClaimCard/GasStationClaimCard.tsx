import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BigNumber from 'bn.js';

import Card from '~core/Card';
import Heading from '~core/Heading';
import { useLoggedInUser } from '~data/helpers';

import styles from './GasStationClaimCard.css';

const MSG = defineMessages({
  headingText: {
    id: 'users.GasStation.GasStationClaimCard.headingText',
    defaultMessage:
      'Step {numberOfSteps}/{numberOfSteps}: Sign your first transaction',
  },
  bodyText: {
    id: 'users.GasStation.GasStationClaimCard.bodyText',
    defaultMessage: `This is your wallet. You’ll use it to sign transactions
and pay transaction fees to the Ethereum blockchain. Click confirm below to
sign your first transaction and finish setting up your account.`,
  },
});

/*
 * TODO: get number of steps from Claim Profile and use here.
 * This should always be the last step.
 */
interface Props {
  numberOfSteps?: number;
}

const displayName = 'users.GasStation.GasStationClaimCard';

/*
 * @NOTE Don't wrap this component in any extra elements, just return the `Card`
 *
 * Otherwise, when dismissed, it will still render the wrapper (without any content)
 * and the `CardList` grid will add gaps and styles to it
 */
const GasStationClaimCard = ({ numberOfSteps = 3 }: Props) => {
  const { balance } = useLoggedInUser();
  const bigNumberBalance = new BigNumber(balance);
  return (
    <Card
      className={styles.main}
      isDismissible
      onCardDismissed={() => {
        /* eslint-disable-next-line no-console */
        console.log('Dismissed');
      }}
    >
      <Heading
        appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
        text={MSG.headingText}
        textValues={{
          numberOfSteps: bigNumberBalance.gt(new BigNumber(0))
            ? 2
            : numberOfSteps,
        }}
      />
      <FormattedMessage {...MSG.bodyText} />
    </Card>
  );
};

GasStationClaimCard.displayName = displayName;

export default GasStationClaimCard;
