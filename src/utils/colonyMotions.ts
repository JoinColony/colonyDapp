import { defineMessage } from 'react-intl';
import { BigNumber, bigNumberify } from 'ethers/utils';
import { Decimal } from 'decimal.js';
import { isNil } from 'lodash';
import { ColonyRoles } from '@colony/colony-js';

import { getRolesForUserAndDomain } from '~modules/transformers';
import { AnyUser } from '~data/index';
import { ActionUserRoles } from '~types/index';

export enum MotionState {
  Staked = 'Staked',
  Staking = 'Staking',
  Voting = 'Voting',
  Reveal = 'Reveal',
  Objection = 'Objection',
  Motion = 'Motion',
  Failed = 'Failed',
  Passed = 'Passed',
  FailedNoFinalizable = 'FailedNoFinalizable',
  Invalid = 'Invalid',
  Escalation = 'Escalation',
  Forced = 'Forced',
  Notice = 'Notice',
}

export enum MotionVote {
  Yay = 1,
  Nay = 0,
}

const MSG = defineMessage({
  stakedTag: {
    id: 'dashboard.ActionsPage.stakedTag',
    defaultMessage: 'Staked',
  },
  stakingTag: {
    id: 'dashboard.ActionsPage.stakingTag',
    defaultMessage: 'Staking',
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
  motionTag: {
    id: 'dashboard.ActionsPage.motionTag',
    defaultMessage: 'Motion',
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
  escalateTag: {
    id: 'dashboard.ActionsPage.escalateTag',
    defaultMessage: 'Escalate',
  },
  forcedTag: {
    id: 'dashboard.ActionsPage.forcedTag',
    defaultMessage: 'Forced',
  },
  noticeTag: {
    id: 'dashboard.ActionsPage.noticeTag',
    defaultMessage: 'Notice',
  },
});

export const MOTION_TAG_MAP = {
  [MotionState.Staked]: {
    theme: 'primary',
    colorSchema: 'fullColor',
    name: MSG.stakedTag,
    tagName: 'motionTag',
  },
  [MotionState.Notice]: {
    theme: 'blue',
    colorSchema: 'fullColor',
    name: MSG.noticeTag,
    tagName: 'motionTag',
  },
  [MotionState.Staking]: {
    theme: 'pink',
    colorSchema: 'inverted',
    name: MSG.stakingTag,
    tagName: 'stakingTag',
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
  [MotionState.Motion]: {
    theme: 'primary',
    colorSchema: 'fullColor',
    name: MSG.motionTag,
    tagName: 'motionTag',
  },
  [MotionState.Failed]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: MSG.failedTag,
    tagName: 'failedTag',
  },
  [MotionState.FailedNoFinalizable]: {
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
  [MotionState.Escalation]: {
    theme: 'dangerGhost',
    colorSchema: 'plain',
    name: MSG.escalateTag,
    tagName: 'escalateTag',
  },
  [MotionState.Forced]: {
    theme: 'blue',
    colorSchema: 'inverted',
    name: MSG.forcedTag,
    tagName: 'forcedTag',
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

const ONE_SECOND = 1000;
export const getEarlierEventTimestamp = (
  currentTimestamp: number,
  subTime = ONE_SECOND,
) => {
  return currentTimestamp - subTime;
};

export const shouldDisplayMotion = (
  currentStake: string,
  requiredStake: string,
): boolean => {
  if (requiredStake === '0') return true;
  return new Decimal(currentStake)
    .div(new Decimal(requiredStake))
    .times(100)
    .gte(10);
};

export interface MotionValue {
  motionId: number;
}

export const getUpdatedDecodedMotionRoles = (
  recipient: AnyUser,
  fromDomain: number,
  currentRoles: ColonyRoles = [],
  setRoles: ActionUserRoles[],
) => {
  const currentUserRoles = getRolesForUserAndDomain(
    currentRoles,
    recipient.id,
    fromDomain,
  );
  const updatedRoles = setRoles.filter((role) => {
    const foundCurrentRole = currentUserRoles.find(
      (currentRole) => currentRole === role.id,
    );
    if (!isNil(foundCurrentRole)) {
      return !role.setTo;
    }
    return role.setTo;
  });

  return updatedRoles;
};
