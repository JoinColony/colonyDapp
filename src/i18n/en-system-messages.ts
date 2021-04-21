/* eslint-disable max-len */

import { SystemMessagesName } from '~dashboard/ActionsPageFeed';

const systemMessagesMessageDescriptors = {
  'systemMessage.title': `{name, select,
      ${SystemMessagesName.EnoughExitRecoveryApprovals} {Enough permission holders have now signed to exit recovery mode. As long as no further storage slots are updated, a recovery permission holder may now sign a transaction to reactivate the colony.}
      ${SystemMessagesName.MotionHasPassed} {{motionTag} has {passedTag} and may be finalized.}
      ${SystemMessagesName.MotionRevealPhase} {It's time to {revealTag} votes to the world!}
      other {Generic system message}
    }`,
};

export default systemMessagesMessageDescriptors;
