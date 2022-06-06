/* eslint-disable max-len */

import { ExpenditureActions } from '~types/index';

const eventsMessageDescriptors = {
  [`expenditure.${ExpenditureActions.Staked}`]: `{user} {reputation} staked {amount} to create a draft expenditure; they can change parameters until they lock the expenditure.`,
  [`expenditure.${ExpenditureActions.CreatingDraft}`]: `{user} {reputation} created a draft expenditure; they can change parameters until they lock the expenditure.`,
  [`expenditure.${ExpenditureActions.CancelingDraft}`]: `{user} {reputation} cancelled this draft expenditure and may reclaim their stake.`,
  [`expenditure.${ExpenditureActions.ReclaimedTheStake}`]: `{user} {reputation} reclaimed their stake.`,
  [`expenditure.${ExpenditureActions.LockingTheExpenditure}`]: `{user} {reputation} locked the expenditure. Parameters can be modified by either a motion, or a member with the 'Arbitration' permission until the funds have been claimed.`,
  [`expenditure.${ExpenditureActions.ChangingTheExpenditure}`]: `{user} {reputation} changed the expenditure. {changes}`,
  [`expenditure.${ExpenditureActions.CreatingAMotion}`]: `{user} {reputation} created a motion to change the expenditure.`,
  [`expenditure.${ExpenditureActions.ChangingOwner}`]: `{user} {reputation} changed the owner of this expenditure to {recipient}`,
  [`expenditure.${ExpenditureActions.CreatingMotionToChangingOwner}`]: `{user} {reputation} created a motion to change the owner of this expenditure to {recipient}.`,
  [`expenditure.${ExpenditureActions.AddingFounds}`]: `{user} {reputation} added funding of {funds}`,
  [`expenditure.${ExpenditureActions.Founded}`]: `The expenditure is fully funded. {user} may release the funds when appropriate.`,
  // [`expenditure.${ExpenditureActions.EndingTheExpenditure}`]: `{user} {reputation} `,
  [`expenditure.${ExpenditureActions.RealisingTheFounds}`]: `{user} {reputation} released the funds. Funds may be claimed after the security delay.`,
  [`expenditure.${ExpenditureActions.ClaimingFounds}`]: `{user} {reputation} claimed their funds of {claimedFounds}`,
  [`expenditure.${ExpenditureActions.ClaimedFounds}`]: `All funds have been claimed.`,
  'expenditure.change': `{changeType, select,
    ${ExpenditureActions.Recipient} {{prevState} recipient was changed to {recipient} }
    ${ExpenditureActions.Value} {value was changed to {value} }
    ${ExpenditureActions.ClaimDelay} {claim delay was changed to {value} }
    other {{eventNameDecorated} emmited by {clientOrExtensionType} }
    }`,
};

export default eventsMessageDescriptors;
