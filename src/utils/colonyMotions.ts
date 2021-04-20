import { defineMessage } from 'react-intl';
import { BigNumber, bigNumberify } from 'ethers/utils';

export enum MotionVote {
  NAY = 0,
  YAY = 1,
}

export enum MotionState {
  Motion = 'Motion',
  StakeRequired = 'StakeRequired',
  Voting = 'Voting',
  Reveal = 'Reveal',
  Objection = 'Objection',
  Failed = 'Failed',
  Passed = 'Passed',
  Invalid = 'Invalid',
}

export enum MotionVote {
  Yay = 1,
  Nay = 0,
}

const MSG = defineMessage({
  motionTag: {
    id: 'dashboard.ActionsPage.motionTag',
    defaultMessage: 'Motion',
  },
  stakeRequiredTag: {
    id: 'dashboard.ActionsPage.stakeRequiredTag',
    defaultMessage: 'Stake required',
  },
  votingTag: {
    id: 'dashboard.ActionsPage.votingTag',
    defaultMessage: 'Voting',
  },
  revealTag: {
    id: 'dashboard.ActionsPage.revealTag',
    defaultMessage: 'Reveal',
  },
  objectionTag: {
    id: 'dashboard.ActionsPage.objectionTag',
    defaultMessage: 'Objection',
  },
  failedTag: {
    id: 'dashboard.ActionsPage.failedTag',
    defaultMessage: 'Failed',
  },
  passedTag: {
    id: 'dashboard.ActionsPage.passedTag',
    defaultMessage: 'Passed',
  },
  invalidTag: {
    id: 'dashboard.ActionsPage.invalidTag',
    defaultMessage: 'Invalid',
  },
});

export const MOTION_TAG_MAP = {
  [MotionState.Motion]: {
    theme: 'primary',
    colorSchema: 'fullColor',
    name: MSG.motionTag,
    tagName: 'motionTag',
  },
  [MotionState.StakeRequired]: {
    theme: 'pink',
    colorSchema: 'fullColor',
    name: MSG.stakeRequiredTag,
    tagName: 'stakeRequiredTag',
  },
  [MotionState.Voting]: {
    theme: 'golden',
    colorSchema: 'fullColor',
    name: MSG.votingTag,
    tagName: 'votingTag',
  },
  [MotionState.Reveal]: {
    theme: 'blue',
    colorSchema: 'fullColor',
    name: MSG.revealTag,
    tagName: 'revealTag',
  },
  [MotionState.Objection]: {
    theme: 'pink',
    colorSchema: 'fullColor',
    name: MSG.objectionTag,
    tagName: 'objectionTag',
  },
  [MotionState.Failed]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: MSG.failedTag,
    tagName: 'failedTag',
  },
  [MotionState.Passed]: {
    theme: 'primary',
    colorSchema: 'plain',
    name: MSG.passedTag,
    tagName: 'passedTag',
  },
  [MotionState.Invalid]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: MSG.invalidTag,
    tagName: 'invalidTag',
  },
};

export const getMotionRequiredStake = (
  skillRep: BigNumber,
  totalStakeFraction: BigNumber,
  decimals: number,
): BigNumber => {
  const requiredStake = skillRep
    .mul(totalStakeFraction)
    .div(bigNumberify(10).pow(decimals));

  return requiredStake;
};
