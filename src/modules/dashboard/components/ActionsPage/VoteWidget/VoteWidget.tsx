import React from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { ActionForm, CustomRadioGroup, CustomRadioProps } from '~core/Fields';
import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import MemberReputation from '~core/MemberReputation';

import { Colony, useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { ColonyMotions } from '~types/index';
import { mapPayload } from '~utils/actions';
import { useTransformer } from '~utils/hooks';

import styles from './VoteWidget.css';

export interface FormValues {
  vote: string;
}

interface Props {
  colony: Colony;
  actionType: string;
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
      other {Generic Action}
    }" be approved?`,
  },
  votingMethodLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.votingMethodLabel',
    defaultMessage: `Voting method`,
  },
  votingMethodValue: {
    id: 'dashboard.ActionsPage.VoteWidget.votingMethodValue',
    defaultMessage: `Reputation-weighted`,
  },
  votingMethodTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.votingMethodTooltip',
    defaultMessage: `Colony makes it possible to utilize different voting methods. Selected vothing method depends on installed extensions. You can change voting method in Governance Policy.`,
  },
  reputationTeamLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.reputationTeamLabel',
    defaultMessage: `Reputation in team`,
  },
  reputationTeamTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.reputationTeamTooltip',
    defaultMessage: `Displays users own reputation in a domain. For example, for reputation 3.5%, user vote is going to be counted as 3.5. Users without reputation, couldn’t vote.`,
  },
  rewardLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.rewardLabel',
    defaultMessage: `Reward`,
  },
  rewardTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.rewardTooltip',
    defaultMessage: `Displays possible reward range for an individual user. If prediction aligns with the winning outcome, than user receives reward. Final value depends on [TO BE ADDED]`,
  },
  rulesLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.rulesLabel',
    defaultMessage: `Rules`,
  },
  rulesTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.rulesTooltip',
    defaultMessage: `Voting process goes in stages. User selects option to vote upon. Than reveals the own vote before the ‘Reveal’ stage passes. Later on, user has to claim tokens and finalize transaction.`,
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
  colony: { colonyAddress, tokens, nativeTokenAddress },
  colony,
  actionType,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  // const transform = useCallback(
  //   mapPayload(({ storageSlotLocation, newStorageSlotValue }) => ({
  //     colonyAddress,
  //     walletAddress,
  //     startBlock,
  //     storageSlotLocation,
  //     storageSlotValue: newStorageSlotValue,
  //   })),
  //   [],
  // );

  const hasRegisteredProfile = !!username && !ethereal;

  const options: CustomRadioProps[] = [
    {
      value: '1',
      label: { id: 'button.yes' },
      name: 'vote',
      appearance: {
        theme: 'primary',
      },
      checked: false,
      icon: 'circle-thumbs-up',
    },
    {
      value: '0',
      label: { id: 'button.no' },
      name: 'vote',
      appearance: {
        theme: 'danger',
      },
      checked: false,
      icon: 'circle-thumbs-down',
    },
  ];

  return (
    <ActionForm
      initialValues={{}}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      // transform={transform}
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
            options={options}
            currentlyCheckedValue={values.vote}
            name="vote"
          />
          <div>
            <div className={styles.item}>
              <div className={styles.label}>
                <div>
                  <FormattedMessage {...MSG.votingMethodLabel} />
                  <QuestionMarkTooltip
                    tooltipText={MSG.votingMethodTooltip}
                    className={styles.help}
                    tooltipClassName={styles.tooltip}
                    tooltipPopperProps={{
                      placement: 'right',
                    }}
                  />
                </div>
              </div>
              <div className={styles.value}>
                {/*
                 * @TODO This needs to be dynamic, once we'll have more voting methods:
                 * - reputation based
                 * - token based
                 * - hybrid
                 */}
                <FormattedMessage {...MSG.votingMethodValue} />
              </div>
            </div>
            {hasRegisteredProfile && (
              <>
                <div className={styles.item}>
                  <div className={styles.label}>
                    <div>
                      <FormattedMessage {...MSG.reputationTeamLabel} />
                      <QuestionMarkTooltip
                        tooltipText={MSG.reputationTeamTooltip}
                        className={styles.help}
                        tooltipClassName={styles.tooltip}
                        tooltipPopperProps={{
                          placement: 'right',
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.value}>
                    <MemberReputation
                      walletAddress={walletAddress}
                      colonyAddress={colonyAddress}
                    />
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.label}>
                    <div>
                      <FormattedMessage {...MSG.rewardLabel} />
                      <QuestionMarkTooltip
                        tooltipText={MSG.rewardTooltip}
                        className={styles.help}
                        tooltipClassName={styles.tooltip}
                        tooltipPopperProps={{
                          placement: 'right',
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.value}>
                    {`123 ${nativeToken?.symbol}`}
                  </div>
                </div>
              </>
            )}
            <div className={styles.item}>
              <div className={styles.label}>
                <div>
                  <FormattedMessage {...MSG.rulesLabel} />
                  <QuestionMarkTooltip
                    tooltipText={MSG.rulesTooltip}
                    className={styles.help}
                    tooltipClassName={styles.tooltip}
                    tooltipPopperProps={{
                      placement: 'right',
                    }}
                  />
                </div>
              </div>
              <div className={styles.value}>
                <Button
                  appearance={{ theme: 'primary', size: 'medium' }}
                  text={MSG.buttonVote}
                  disabled={!isValid || !hasRegisteredProfile}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </ActionForm>
  );
};

VoteWidget.displayName = 'dashboard.ActionsPage.VoteWidget';

export default VoteWidget;
