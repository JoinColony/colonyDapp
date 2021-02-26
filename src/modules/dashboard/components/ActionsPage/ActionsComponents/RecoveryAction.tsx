import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import FriendlyName from '~core/FriendlyName';
import PermissionsLabel from '~core/PermissionsLabel';
import ActionsPageFeed, {
  ActionsPageFeedItem,
  SystemInfo,
  ActionsPageFeedType,
} from '~dashboard/ActionsPageFeed';
import ActionsPageComment from '~dashboard/ActionsPageComment';

import {
  useLoggedInUser,
  Colony,
  ColonyActionQuery,
  TokenInfoQuery,
  AnyUser,
  useRecoveryEventsForSessionQuery,
} from '~data/index';
import { ColonyActions, ColonyAndExtensionsEvents } from '~types/index';

import MultisigWidget from '../MultisigWidget';
import InputStorageWidget from '../InputStorageWidget';
import DetailsWidget from '../DetailsWidget';

import styles from './DefaultAction.css';
import recoverySpecificStyles from './RecoveryAction.css';

const MSG = defineMessages({
  recoveryTag: {
    id: 'dashboard.ActionsPage.RecoveryAction.recovery',
    defaultMessage: `Recovery`,
  },
  tip: {
    id: 'dashboard.ActionsPage.RecoveryAction.tip',
    defaultMessage: `{tipTitle} While in recovery mode the colony is disabled
and no actions may be taken.

A {role} permission holder may update storage slots to rectify the issue that
caused {user} to take this action.

A majority of {role} permission holders must satisfy themselves that this issue
has been overcome and the colony is secure, and sign a transaction to approve
exiting recovery mode, and then reactivate the colony.

Approvals are reset each time storage slots are updated.`,
  },
  tipTitle: {
    id: 'dashboard.ActionsPage.RecoveryAction.tipTitle',
    defaultMessage: 'Tip:',
  },
});

const displayName = 'dashboard.ActionsPage.RecoveryAction';

interface Props {
  colony: Colony;
  colonyAction: ColonyActionQuery['colonyAction'];
  token: TokenInfoQuery['tokenInfo'];
  transactionHash: string;
  recipient: AnyUser;
  initiator: AnyUser;
}

const RecoveryAction = ({
  colony,
  colony: { colonyAddress },
  colonyAction: {
    events = [],
    createdAt,
    actionType,
    annotationHash,
    colonyDisplayName,
    blockNumber,
  },
  colonyAction,
  transactionHash,
  recipient,
  initiator: {
    profile: { walletAddress: initiatorWalletAddress },
  },
  initiator,
}: Props) => {
  const { username: currentUserName, ethereal } = useLoggedInUser();

  /*
   * @TODO Add load state for fetching all the events from the chain
   */
  const {
    data,
    loading: recoveryEventsLoading,
  } = useRecoveryEventsForSessionQuery({
    variables: {
      blockNumber,
      colonyAddress,
    },
  });

  const isInRecoveryMode = useMemo(() => {
    if (data?.recoveryEventsForSession) {
      return !data.recoveryEventsForSession.find(
        ({ name }) => name === ColonyAndExtensionsEvents.RecoveryModeExited,
      );
    }
    return false;
  }, [data]);

  /*
   * @NOTE We need to convert the action type name into a forced camel-case string
   *
   * This is because it might have a name that contains spaces, and ReactIntl really
   * doesn't like that...
   */
  const actionAndEventValues = {
    actionType,
    initiator: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={initiator} autoShrinkAddress />
      </span>
    ),
    colonyName: (
      <FriendlyName
        colony={{
          ...colony,
          ...(colonyDisplayName ? { displayName: colonyDisplayName } : {}),
        }}
        autoShrinkAddress
      />
    ),
  };

  const recoveryModeSystemInfo: SystemInfo = {
    type: ActionsPageFeedType.SystemInfo,
    text: MSG.tip,
    /*
     * Position in the feed array
     * This is because these can be inserted at any point the feed and are not
     * affected by creation time / date
     */
    position: 1,
    textValues: {
      tipTitle: (
        <span className={recoverySpecificStyles.tipTitle}>
          <FormattedMessage {...MSG.tipTitle} />
        </span>
      ),
      user: (
        <span className={styles.titleDecoration}>
          <FriendlyName user={initiator} autoShrinkAddress />
        </span>
      ),
      role: (
        <PermissionsLabel
          permission={ColonyRole.Recovery}
          name={{ id: `role.${ColonyRole.Recovery}` }}
        />
      ),
    },
    appearance: { theme: 'recovery' },
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <p className={styles.recoveryTag}>
          <FormattedMessage {...MSG.recoveryTag} />
        </p>
      </div>
      <hr className={styles.dividerTop} />
      <div className={styles.container}>
        <div className={styles.content}>
          {/*
           * @NOTE Can't use `Heading` here since it uses `formmatedMessage` internally
           * for message descriptors, and that doesn't support our complex text values
           */}
          <h1 className={styles.heading}>
            <FormattedMessage
              id="action.title"
              values={{
                ...actionAndEventValues,
              }}
            />
          </h1>
          {annotationHash && (
            <ActionsPageFeedItem
              createdAt={createdAt}
              user={initiator}
              annotation
              comment={annotationHash}
            />
          )}
          <ActionsPageFeed
            actionType={actionType}
            transactionHash={transactionHash as string}
            networkEvents={[
              ...events,
              ...(data?.recoveryEventsForSession || []),
            ]}
            systemInfos={[recoveryModeSystemInfo]}
            values={actionAndEventValues}
            actionData={colonyAction}
            colony={colony}
            loading={recoveryEventsLoading}
          />
          {/*
           *  @NOTE A user can comment only if he has a wallet connected
           * and a registered user profile
           */}
          {currentUserName && !ethereal && (
            <ActionsPageComment
              transactionHash={transactionHash}
              colonyAddress={colonyAddress}
            />
          )}
        </div>
        <div className={styles.details}>
          {isInRecoveryMode && (
            <>
              <InputStorageWidget />
              <MultisigWidget
                // Mocking for now
                membersAllowedForApproval={Array.from(
                  Array(10),
                  () => initiatorWalletAddress,
                )}
                requiredNumber={4}
                requiredPermission={ColonyRole.Recovery}
              >
                <Button
                  text={{ id: 'button.approve' }}
                  appearance={{
                    theme: 'primary',
                    size: 'medium',
                  }}
                />
              </MultisigWidget>
            </>
          )}
          <DetailsWidget
            actionType={actionType as ColonyActions}
            recipient={recipient}
            transactionHash={transactionHash}
            values={actionAndEventValues}
            colony={colony}
          />
        </div>
      </div>
    </div>
  );
};

RecoveryAction.displayName = displayName;

export default RecoveryAction;
