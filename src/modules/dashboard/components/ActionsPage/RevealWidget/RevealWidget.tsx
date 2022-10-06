import React, { useCallback, RefObject, useState, useEffect } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { ActionForm, CustomRadio } from '~core/Fields';
import Heading from '~core/Heading';

import {
  Colony,
  useLoggedInUser,
  useMotionUserVoteRevealedQuery,
  useMotionCurrentUserVotedQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';
import { MotionVote, MotionState } from '~utils/colonyMotions';

import VoteDetails from '../VoteWidget/VoteDetails';

import styles from './RevealWidget.css';

export interface FormValues {
  vote: string;
}

interface Props {
  colony: Colony;
  motionId: number;
  motionState: MotionState;
  scrollToRef?: RefObject<HTMLInputElement>;
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.ActionsPage.RevealWidget.title',
    defaultMessage: `{revealed, select,
      true {Waiting for other voters to reveal their votes.}
      other {Reveal your vote to others to claim your reward.}
    }`,
  },
  titleNotVoted: {
    id: 'dashboard.ActionsPage.RevealWidget.titleNotVoted',
    defaultMessage: `Please wait for the voters to reveal their vote.`,
  },
  voteHiddenInfo: {
    id: 'dashboard.ActionsPage.RevealWidget.voteHiddenInfo',
    defaultMessage: `Your vote is hidden from others.`,
  },
  buttonReveal: {
    id: 'dashboard.ActionsPage.RevealWidget.buttonReveal',
    defaultMessage: `Reveal`,
  },
  buttonRevealed: {
    id: 'dashboard.ActionsPage.RevealWidget.buttonRevealed',
    defaultMessage: `Revealed`,
  },
});

const RevealWidget = ({
  colony: { colonyAddress },
  colony,
  motionId,
  scrollToRef,
  motionState,
}: Props) => {
  const [userVoteRevealed, setUserVoteRevealed] = useState(false);

  const { walletAddress, username, ethereal } = useLoggedInUser();

  const { data: voteRevealed, refetch } = useMotionUserVoteRevealedQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (voteRevealed) {
      setUserVoteRevealed(voteRevealed.motionUserVoteRevealed.revealed);
    }
  }, [voteRevealed]);

  const { data: userVoted } = useMotionCurrentUserVotedQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    })),
    [walletAddress],
  );

  const handleSuccess = useCallback(
    (_, { resetForm }) => {
      resetForm({});
      scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
      refetch();
      setUserVoteRevealed(true);
    },
    [scrollToRef, refetch],
  );

  const hasRegisteredProfile = !!username && !ethereal;
  const vote = voteRevealed?.motionUserVoteRevealed?.vote;

  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.MOTION_REVEAL_VOTE}
      error={ActionTypes.MOTION_REVEAL_VOTE_ERROR}
      success={ActionTypes.MOTION_REVEAL_VOTE_SUCCESS}
      transform={transform}
      onSuccess={handleSuccess}
    >
      {({ handleSubmit, isSubmitting }: FormikProps<FormValues>) => (
        <div className={styles.main}>
          {userVoted?.motionCurrentUserVoted ? (
            <Heading
              text={MSG.title}
              textValues={{ revealed: userVoteRevealed }}
              appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
            />
          ) : (
            <Heading
              text={MSG.titleNotVoted}
              appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
            />
          )}

          {userVoteRevealed ? (
            <>
              {vote === MotionVote.Yay ? (
                <CustomRadio
                  /*
                   * @NOTE This is just for display purposes, we don't actually
                   * want to use it as radio button
                   */
                  value=""
                  name="voteYes"
                  label={{ id: 'button.yes' }}
                  appearance={{ theme: 'primary' }}
                  icon="circle-thumbs-up"
                  checked
                />
              ) : (
                <CustomRadio
                  /*
                   * @NOTE This is just for display purposes, we don't actually
                   * want to use it as radio button
                   */
                  value=""
                  name="voteNo"
                  label={{ id: 'button.no' }}
                  appearance={{ theme: 'danger' }}
                  icon="circle-thumbs-down"
                  checked
                />
              )}
            </>
          ) : (
            <>
              {userVoted?.motionCurrentUserVoted && (
                <div className={styles.voteHiddenInfo}>
                  <FormattedMessage {...MSG.voteHiddenInfo} />
                </div>
              )}
            </>
          )}
          <VoteDetails
            colony={colony}
            motionId={motionId}
            motionState={motionState}
            showReward={userVoted?.motionCurrentUserVoted}
            buttonComponent={
              <Button
                appearance={{ theme: 'primary', size: 'medium' }}
                text={userVoteRevealed ? MSG.buttonRevealed : MSG.buttonReveal}
                disabled={
                  !hasRegisteredProfile ||
                  userVoteRevealed ||
                  !userVoted?.motionCurrentUserVoted ||
                  isSubmitting
                }
                onClick={() => handleSubmit()}
                loading={isSubmitting}
                dataTest="revealButton"
              />
            }
          />
        </div>
      )}
    </ActionForm>
  );
};

RevealWidget.displayName = 'dashboard.ActionsPage.RevealWidget';

export default RevealWidget;
