import { defineMessage } from 'react-intl';

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
  Nay = 2,
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
  },
  [MotionState.StakeRequired]: {
    theme: 'pink',
    colorSchema: 'fullColor',
    name: MSG.stakeRequiredTag,
  },
  [MotionState.Voting]: {
    theme: 'golden',
    colorSchema: 'fullColor',
    name: MSG.votingTag,
  },
  [MotionState.Reveal]: {
    theme: 'blue',
    colorSchema: 'fullColor',
    name: MSG.revealTag,
  },
  [MotionState.Objection]: {
    theme: 'pink',
    colorSchema: 'fullColor',
    name: MSG.objectionTag,
  },
  [MotionState.Failed]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: MSG.failedTag,
  },
  [MotionState.Passed]: {
    theme: 'primary',
    colorSchema: 'plain',
    name: MSG.passedTag,
  },
  [MotionState.Invalid]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: MSG.invalidTag,
  },
};
