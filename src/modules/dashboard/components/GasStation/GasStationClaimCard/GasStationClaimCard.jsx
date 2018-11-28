/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Card from '~core/Card';
import Heading from '~core/Heading';

const MSG = defineMessages({
  headingText: {
    id: 'dashboard.GasStationClaimCard.headingText',
    defaultMessage:
      'Step {numberOfSteps}/{numberOfSteps}: Sign your first transaction',
  },
  bodyText: {
    id: 'dashboard.GasStationClaimCard.bodyText',
    defaultMessage: `This is your wallet. You’ll use it to sign transactions
and pay transaction fees to the Ethereum blockchain. Click confirm below to
sign your first transaction and finish setting up your account.`,
  },
});

/*
 * @TODO: get number of steps from Claim Profile and use here.
 * This should always be the last step.
 */
type Props = {
  numberOfSteps?: number,
};

const displayName = 'dashboard.GasStationClaimCard';

/*
 * @NOTE Don't wrap this component in any extra elements, just return the `Card`
 *
 * Otherwise, when dismissed, it will still render the wrapper (without any content)
 * and the `CardList` grid will add gaps and styles to it
 */
const GasStationClaimCard = ({ numberOfSteps = 3 }: Props) => (
  /* eslint-disable-next-line no-console */
  <Card isDismissible onCardDismissed={() => console.log('Dismissed')}>
    <Heading
      appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
      text={MSG.headingText}
      textValues={{
        numberOfSteps,
      }}
    />
    <FormattedMessage {...MSG.bodyText} />
  </Card>
);

GasStationClaimCard.displayName = displayName;

export default GasStationClaimCard;
