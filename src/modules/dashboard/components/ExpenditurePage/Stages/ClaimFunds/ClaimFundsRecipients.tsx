import React, { useMemo } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';

import TimeRelativeShort from '~dashboard/ExpenditurePage/TimeRelativeShort';
import { getRecipientTokens } from '~dashboard/ExpenditurePage/utils';
import { useCalculateTokens } from '~dashboard/ExpenditurePage/hooks';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';
import { Colony } from '~data/index';

import ClaimFunds from './ClaimFunds';

const displayName = 'dashboard.ExpenditurePage.Stages.ClaimFundsRecipients';

const MSG = defineMessages({
  claim: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFundsRecipients.claim',
    defaultMessage: 'Next claim {claimDate}',
  },
  nothingToClaim: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFundsRecipients.nothingToClaim',
    defaultMessage: 'Nothing to claim',
  },
  now: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFundsRecipients.now',
    defaultMessage: 'Now',
  },
});

export type TokensAmount = Record<string, number>;

interface Props {
  buttonAction?: () => void;
  buttonText?: string | MessageDescriptor;
  recipients?: Recipient[];
  colony?: Colony;
  isDisabled?: boolean;
}

const ClaimFundsRecipients = ({
  buttonAction,
  buttonText,
  recipients,
  colony,
  isDisabled,
}: Props) => {
  const { formatMessage } = useIntl();

  const recipientsWithTokens = useMemo(() => {
    return recipients?.map((recipient) => {
      const token = getRecipientTokens(recipient, colony);
      return { ...recipient, value: token };
    });
  }, [colony, recipients]);

  const { nextClaim, ...claimData } = useCalculateTokens(
    recipientsWithTokens as Recipient[],
  );

  const nextClaimLabel = useMemo(() => {
    if (!nextClaim || !nextClaim.claimDate) {
      return <FormattedMessage {...MSG.nothingToClaim} />;
    }
    if (nextClaim?.claimDate < new Date().getTime() && !nextClaim.claimed) {
      // if the claim date has passed and the amount hasn't been claimed yet
      return <FormattedMessage {...MSG.now} />;
    }
    return formatMessage(MSG.claim, {
      claimDate: <TimeRelativeShort value={new Date(nextClaim.claimDate)} />,
    });
  }, [formatMessage, nextClaim]);

  return (
    <ClaimFunds
      buttonAction={buttonAction}
      buttonText={buttonText}
      claimData={claimData}
      nextClaimLabel={nextClaimLabel}
      isDisabled={isDisabled}
    />
  );
};

ClaimFundsRecipients.displayName = displayName;

export default ClaimFundsRecipients;
