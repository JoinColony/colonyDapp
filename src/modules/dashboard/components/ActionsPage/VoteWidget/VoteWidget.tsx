import React, { useCallback, RefObject, useState, useEffect } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Button from '~core/Button';
import { ActionForm, CustomRadioGroup, CustomRadioProps } from '~core/Fields';
import Heading from '~core/Heading';

import {
  Colony,
  useLoggedInUser,
  useUserReputationQuery,
  useMotionCurrentUserVotedQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { ColonyExtendedMotions, ColonyMotions } from '~types/index';
import { mapPayload } from '~utils/actions';
import { MotionState } from '~utils/colonyMotions';

import VoteDetails from './VoteDetails';

import styles from './VoteWidget.css';

export interface FormValues {
  vote: string;
}

interface Props {
  colony: Colony;
  actionType: string;
  motionId: number;
  motionState: MotionState;
  transactionTitle: string;
  motionDomain?: number;
  scrollToRef?: RefObject<HTMLInputElement>;
}

const MSG = defineMessages({
  /*
   * @NOTE I didn't want to create a mapping for this, since they will only
   * be used in this instance
   *
   * If by chance we end up having to use this mapping elsewhere, feel free
   * to create it's own map
   */
  title: {
    id: 'dashboard.ActionsPage.VoteWidget.title',
    /* eslint-disable max-len */
    defaultMessage: `Should "{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint tokens}
      ${ColonyMotions.PaymentMotion} {Payment}
      ${ColonyMotions.UnlockTokenMotion} {Unlock token}
      ${ColonyMotions.CreateDomainMotion} {Create Team}
      ${ColonyMotions.EditDomainMotion} {Edit Team}
      ${ColonyMotions.ColonyEditMotion} {Colony Edit}
      ${ColonyMotions.SetUserRolesMotion} {Permission Management}
      ${ColonyMotions.MoveFundsMotion} {Move Funds}
      ${ColonyMotions.VersionUpgradeMotion} {Version Upgrade}
      ${ColonyMotions.EmitDomainReputationPenaltyMotion} {Smite}
      ${ColonyMotions.EmitDomainReputationRewardMotion} {Award}
      ${ColonyMotions.CreateDecisionMotion} {Decision}
      ${ColonyExtendedMotions.SafeTransactionInitiatedMotion} {{transactionTitle}}
      other {Generic Action}
    }" be approved?`,
    /* eslint-enable max-len */
  },
  buttonVote: {
    id: 'dashboard.ActionsPage.VoteWidget.buttonVote',
    defaultMessage: `Vote`,
  },
  buttonChangeVote: {
    id: 'dashboard.ActionsPage.VoteWidget.buttonChangeVote',
    defaultMessage: `Change Vote`,
  },
  voteHidden: {
    id: 'dashboard.ActionsPage.VoteWidget.voteHidden',
    defaultMessage: `Your vote is hidden from others.\nYou can change your vote.`,
  },
});

const validationSchema = yup.object().shape({
  vote: yup.number().required(),
});

const VoteWidget = ({
  colony: { colonyAddress },
  colony,
  actionType,
  motionId,
  motionDomain = ROOT_DOMAIN_ID,
  scrollToRef,
  motionState,
  transactionTitle,
}: Props) => {
  const [hasUserVoted, setHasUserVoted] = useState(false);

  const { walletAddress, username, ethereal } = useLoggedInUser();

  const { data: userReputationData } = useUserReputationQuery({
    variables: {
      address: walletAddress,
      colonyAddress,
      domainId: motionDomain,
    },
  });

  const { data: userVoteData, refetch } = useMotionCurrentUserVotedQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (userVoteData) {
      setHasUserVoted(userVoteData.motionCurrentUserVoted);
    }
  }, [userVoteData]);

  const transform = useCallback(
    mapPayload(({ vote }) => ({
      colonyAddress,
      userAddress: walletAddress,
      vote: parseInt(vote, 10),
      motionId,
    })),
    [walletAddress],
  );

  const handleSuccess = useCallback(
    (_, { setFieldValue, resetForm }) => {
      resetForm({});
      setFieldValue('vote', undefined);
      scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
      refetch();
      setHasUserVoted(true);
    },
    [scrollToRef, refetch],
  );

  const hasRegisteredProfile = !!username && !ethereal;
  const hasReputationToVote = bigNumberify(
    userReputationData?.userReputation || 0,
  ).gt(0);

  const inputDisabled = !hasRegisteredProfile || !hasReputationToVote;

  const options: (checkedValue: string) => CustomRadioProps[] = (
    checkedValue,
  ) => [
    {
      value: '1',
      label: { id: 'button.yes' },
      name: 'vote',
      appearance: {
        theme: 'primary',
      },
      checked: false,
      /* the `fill` css property is not working for these svgs */
      icon: inputDisabled
        ? 'circle-thumbs-up-grey'
        : `circle-thumbs-up${checkedValue === '1' ? '' : '-outlined'}`,
      dataTest: 'yesVoteButton',
    },
    {
      value: '0',
      label: { id: 'button.no' },
      name: 'vote',
      appearance: {
        theme: 'danger',
      },
      checked: false,
      /* the `fill` css property is not working for these svgs */
      icon: inputDisabled
        ? 'circle-thumbs-down-grey'
        : `circle-thumbs-down${checkedValue === '0' ? '' : '-outlined'}`,
    },
  ];

  return (
    <>
      {hasUserVoted && (
        <p className={styles.voteHiddenContainer}>
          <FormattedMessage {...MSG.voteHidden} />
        </p>
      )}
      <ActionForm
        initialValues={{
          vote: undefined,
        }}
        validationSchema={validationSchema}
        submit={ActionTypes.MOTION_VOTE}
        error={ActionTypes.MOTION_VOTE_ERROR}
        success={ActionTypes.MOTION_VOTE_SUCCESS}
        transform={transform}
        onSuccess={handleSuccess}
      >
        {({
          handleSubmit,
          isSubmitting,
          isValid,
          values,
        }: FormikProps<FormValues>) => (
          <div className={styles.main}>
            <Heading
              text={MSG.title}
              textValues={{ actionType, transactionTitle }}
              appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
            />
            <CustomRadioGroup
              options={options(values.vote)}
              currentlyCheckedValue={values.vote}
              name="vote"
              disabled={inputDisabled || isSubmitting}
            />
            <VoteDetails
              colony={colony}
              motionId={motionId}
              motionState={motionState}
              showReward={hasReputationToVote}
              buttonComponent={
                <Button
                  appearance={{ theme: 'primary', size: 'medium' }}
                  text={hasUserVoted ? MSG.buttonChangeVote : MSG.buttonVote}
                  disabled={
                    !isValid ||
                    !hasRegisteredProfile ||
                    !values.vote ||
                    !hasReputationToVote ||
                    isSubmitting
                  }
                  onClick={() => handleSubmit()}
                  loading={isSubmitting}
                  dataTest="voteButton"
                />
              }
            />
          </div>
        )}
      </ActionForm>
    </>
  );
};

VoteWidget.displayName = 'dashboard.ActionsPage.VoteWidget';

export default VoteWidget;
