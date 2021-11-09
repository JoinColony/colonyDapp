import React, { useCallback, RefObject } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Button from '~core/Button';
import { ActionForm, CustomRadioGroup, CustomRadioProps } from '~core/Fields';
import Heading from '~core/Heading';

import { Colony, useLoggedInUser, useUserReputationQuery } from '~data/index';
import { ActionTypes } from '~redux/index';
import { ColonyMotions } from '~types/index';
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
  motionDomain?: number;
  scrollToRef?: RefObject<HTMLInputElement>;
  motionState: MotionState;
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
    defaultMessage: `Should "{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint tokens}
      ${ColonyMotions.PaymentMotion} {Payment}
      ${ColonyMotions.CreateDomainMotion} {Create Team}
      ${ColonyMotions.EditDomainMotion} {Edit Team}
      ${ColonyMotions.ColonyEditMotion} {Colony Edit}
      ${ColonyMotions.SetUserRolesMotion} {Permission Management}
      ${ColonyMotions.MoveFundsMotion} {Move Funds}
      ${ColonyMotions.VersionUpgradeMotion} {Version Upgrade}
      ${ColonyMotions.EmitDomainReputationRewardMotion} {Award}
      other {Generic Action}
    }" be approved?`,
  },
  buttonVote: {
    id: 'dashboard.ActionsPage.VoteWidget.buttonVote',
    defaultMessage: `Vote`,
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
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const { data: userReputationData } = useUserReputationQuery({
    variables: {
      address: walletAddress,
      colonyAddress,
      domainId: motionDomain,
    },
  });

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
    },
    [scrollToRef],
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
    <ActionForm
      initialValues={{
        vote: undefined,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_MOTION_VOTE}
      error={ActionTypes.COLONY_MOTION_VOTE_ERROR}
      success={ActionTypes.COLONY_MOTION_VOTE_SUCCESS}
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
            textValues={{ actionType }}
            appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
          />
          <CustomRadioGroup
            options={options(values.vote)}
            currentlyCheckedValue={values.vote}
            name="vote"
            disabled={inputDisabled}
          />
          <VoteDetails
            colony={colony}
            motionId={motionId}
            motionState={motionState}
            showReward={hasReputationToVote}
            buttonComponent={
              <Button
                appearance={{ theme: 'primary', size: 'medium' }}
                text={MSG.buttonVote}
                disabled={
                  !isValid ||
                  !hasRegisteredProfile ||
                  !values.vote ||
                  !hasReputationToVote
                }
                onClick={() => handleSubmit()}
                loading={isSubmitting}
              />
            }
          />
        </div>
      )}
    </ActionForm>
  );
};

VoteWidget.displayName = 'dashboard.ActionsPage.VoteWidget';

export default VoteWidget;
