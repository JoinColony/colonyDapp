import React, { useCallback, useState } from 'react';
import { useParams, useHistory, Redirect } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import parse from 'html-react-parser';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { nanoid } from 'nanoid';

import Heading from '~core/Heading';
import Button from '~core/Button';
import Tag from '~core/Tag';
import { useDialog } from '~core/Dialog';
import HookedUserAvatar from '~users/HookedUserAvatar';
import DecisionDialog from '~dashboard/Dialogs/DecisionDialog';
import ConfirmDeleteDialog from '~dashboard/Dialogs/ConfirmDeleteDialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { LOCAL_STORAGE_DECISION_KEY } from '~constants';
import {
  useUser,
  useLoggedInUser,
  useColonyFromNameQuery,
  AnyUser,
  OneDomain,
} from '~data/index';
import { ColonyMotions, DecisionDetails } from '~types/index';
import { NOT_FOUND_ROUTE } from '~routes/index';
import LoadingTemplate from '~pages/LoadingTemplate';

import DetailsWidget from '../ActionsPage/DetailsWidget';

import styles from './DecisionPreview.css';

const MSG = defineMessages({
  preview: {
    id: 'dashboard.DecisionPreview.preview',
    defaultMessage: `Preview`,
  },
  loadingText: {
    id: 'dashboard.DecisionPreview.loadingText',
    defaultMessage: 'Loading Decision',
  },
  noDecisionText: {
    id: 'dashboard.DecisionPreview.noDecisionText',
    defaultMessage: 'No draft Decision found.',
  },
  createDecision: {
    id: 'dashboard.DecisionPreview.createDecision',
    defaultMessage: 'Create a new Decision',
  },
  decision: {
    id: 'dashboard.DecisionPreview.decision',
    defaultMessage: 'Decision',
  },
});

const displayName = 'dashboard.DecisionPreview';

const DecisionPreview = () => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  const history = useHistory();
  const { walletAddress, username } = useLoggedInUser();
  const userProfile = useUser(walletAddress) as AnyUser;
  const [decisionData] = useState<DecisionDetails | undefined>(
    localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) === null
      ? undefined
      : JSON.parse(localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) || ''),
  );
  const { data: colonyData, error, loading } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  const openDecisionDialog = useDialog(DecisionDialog);
  const openConfirmDeleteDialog = useDialog(ConfirmDeleteDialog);

  const deleteDecision = () => {
    localStorage.removeItem(LOCAL_STORAGE_DECISION_KEY);
    history.push(`/colony/${colonyName}/decisions`);
  };

  const transform = useCallback(
    pipe(
      mapPayload(() => ({
        colonyAddress: colonyData?.processedColony?.colonyAddress || '',
        colonyName,
        decisionTitle: decisionData?.title,
        decisionDescription: decisionData?.description,
        motionDomainId: decisionData?.motionDomainId,
      })),
      withMeta({ history }),
    ),
    [colonyData],
  );

  if (
    loading ||
    (colonyData?.colonyAddress &&
      !colonyData.processedColony &&
      !((colonyData.colonyAddress as any) instanceof Error))
  ) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (!colonyName || error || !colonyData?.processedColony) {
    console.error('error', error);
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  const { processedColony: colony } = colonyData;

  const UserAvatar = HookedUserAvatar({ fetchUser: false });

  const actionAndEventValues = {
    actionType: ColonyMotions.CreateDecisionMotion,
    fromDomain: colonyData.processedColony.domains.find(
      ({ ethDomainId }) => ethDomainId === decisionData?.motionDomainId,
    ) as OneDomain,
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperContainer}>
        <p className={styles.tagWrapper}>
          <Tag text={MSG.preview} appearance={{ theme: 'light' }} />
        </p>
      </div>
      <hr className={styles.dividerTop} />
      <div className={styles.contentContainer}>
        <div
          className={decisionData ? styles.decisionContent : styles.noContent}
        >
          {decisionData && decisionData.userAddress === walletAddress ? (
            <>
              <span className={styles.userinfo}>
                <UserAvatar
                  colony={colony}
                  size="s"
                  notSet={false}
                  user={userProfile}
                  address={walletAddress || ''}
                  showInfo
                  popperOptions={{
                    showArrow: false,
                    placement: 'left',
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 10],
                        },
                      },
                    ],
                  }}
                />
                <span className={styles.userName}>{`@${username}`}</span>
              </span>
              <div className={styles.title}>
                <Heading
                  tagName="h3"
                  appearance={{
                    size: 'medium',
                    margin: 'small',
                    theme: 'dark',
                  }}
                  text={decisionData.title}
                />
              </div>
              {parse(decisionData.description)}
            </>
          ) : (
            <>
              <FormattedMessage {...MSG.noDecisionText} />
              <Button
                text={MSG.createDecision}
                appearance={{ theme: 'blue' }}
                onClick={() =>
                  openDecisionDialog({
                    colony,
                    ethDomainId: ROOT_DOMAIN_ID,
                  })
                }
              />
            </>
          )}
        </div>
        <div className={styles.rightContent}>
          <div className={styles.buttonContainer}>
            {decisionData && decisionData.userAddress === walletAddress && (
              <Button
                appearance={{ theme: 'blue', size: 'large' }}
                onClick={() =>
                  openConfirmDeleteDialog({
                    itemName: (
                      <FormattedMessage {...MSG.decision} key={nanoid()} />
                    ),
                    deleteCallback: deleteDecision,
                  })
                }
                text={{ id: 'button.delete' }}
              />
            )}
            {decisionData && decisionData.userAddress === walletAddress && (
              <Button
                appearance={{ theme: 'blue', size: 'large' }}
                // appearance={{ theme: 'secondary', size: 'large' }}
                onClick={() =>
                  openDecisionDialog({
                    colony,
                    ethDomainId: decisionData.motionDomainId,
                  })
                }
                text={{ id: 'button.edit' }}
              />
            )}
            <ActionForm
              initialValues={{}}
              submit={ActionTypes.MOTION_CREATE_DECISION}
              error={ActionTypes.MOTION_CREATE_DECISION_ERROR}
              success={ActionTypes.MOTION_CREATE_DECISION_SUCCESS}
              transform={transform}
            >
              {({ handleSubmit, isSubmitting }) => (
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  onClick={() => handleSubmit()}
                  text={{ id: 'button.publish' }}
                  loading={isSubmitting}
                  disabled={isSubmitting || decisionData === undefined}
                />
              )}
            </ActionForm>
          </div>
          <div className={styles.details}>
            <DetailsWidget
              actionType={ColonyMotions.CreateDecisionMotion}
              recipient={userProfile}
              colony={colony}
              values={{
                ...actionAndEventValues,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

DecisionPreview.displayName = displayName;

export default DecisionPreview;
