import React, { useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import parse from 'html-react-parser';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Heading from '~core/Heading';
import Button from '~core/Button';
import Tag from '~core/Tag';
import { useDialog } from '~core/Dialog';
import HookedUserAvatar from '~users/HookedUserAvatar';
import DecisionDialog, {
  LOCAL_STORAGE_DECISION_KEY,
  FormValues,
} from '~dashboard/Dialogs/DecisionDialog';
import DetailsWidget from '~dashboard/ActionsPage/DetailsWidget';

import {
  useUser,
  useLoggedInUser,
  useColonyFromNameQuery,
  AnyUser,
  OneDomain,
} from '~data/index';
import { ColonyActions } from '~types/index';
import { NOT_FOUND_ROUTE } from '~routes/index';
import LoadingTemplate from '~pages/LoadingTemplate';

import styles from './DecisionPreview.css';

const MSG = defineMessages({
  preview: {
    id: 'dashboard.DecisionPreview.preview',
    defaultMessage: 'Preview',
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
});

const displayName = 'dashboard.DecisionPreview';

const DecisionPreview = () => {
  const UserAvatar = HookedUserAvatar({ fetchUser: false });

  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  const { walletAddress, username } = useLoggedInUser();
  const userProfile = useUser(walletAddress) as AnyUser;

  const [decisionData, setDecisionData] = useState<FormValues | undefined>(
    localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) === null
      ? undefined
      : JSON.parse(localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) || ''),
  );

  const { data: colonyData, error, loading } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  const openDecisionDialog = useDialog(DecisionDialog);

  const handleSubmit = () => {
    // Temporary place - need to move to `onSuccess` method when ActionForm is added
    localStorage.removeItem(LOCAL_STORAGE_DECISION_KEY);
    setDecisionData(undefined);
    /* Add rerouting to the decision motion page */
  };

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

  const actionAndEventValues = {
    actionType: ColonyActions.Decision,
    fromDomain: colonyData.processedColony.domains.find(
      ({ ethDomainId }) =>
        ethDomainId ===
        (decisionData ? decisionData.motionDomainId : ROOT_DOMAIN_ID),
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
          {decisionData ? (
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
            {decisionData && (
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                onClick={() =>
                  openDecisionDialog({
                    colony,
                    ethDomainId: Number(decisionData?.motionDomainId),
                    title: decisionData?.title,
                    description: decisionData?.description,
                  })
                }
                text={{ id: 'button.edit' }}
              />
            )}
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              onClick={handleSubmit}
              text={{ id: 'button.publish' }}
              disabled={decisionData === undefined}
            />
          </div>
          <div className={styles.details}>
            <DetailsWidget
              actionType={ColonyActions.Decision}
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
