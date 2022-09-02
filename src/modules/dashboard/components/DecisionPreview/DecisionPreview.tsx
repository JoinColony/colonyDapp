import React, { useCallback } from 'react';
import { useParams, useHistory, Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import Tag from '~core/Tag';
import { useDialog } from '~core/Dialog';
import HookedUserAvatar from '~users/HookedUserAvatar';
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
import DecisionDialog from '~dashboard/Dialogs/DecisionDialog';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';

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
});

/* mock data */
const decisionData: DecisionDetails = {
  title: 'Should we build a Discord Bot?',
  description: `I think we should build a Discord bot that integrates
  with the Dapp and provides our community with greater transperency
  and also provides more convienience for us to be notified of things
  happening in our Colony.`,
  /* Using an HTML string for the dialog content ensures the dirty prop works as expected */
  htmlDescription: `<p>I think we should build a Discord bot that
   integrates with the Dapp and provides our community with greater
    transperency and also provides more convienience for us to be
    notified of things happening in our Colony.</p>`,
  domainId: 1,
};

const displayName = 'dashboard.DecisionPreview';

const DecisionPreview = () => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  const history = useHistory();
  const { walletAddress, username } = useLoggedInUser();
  const userProfile = useUser(walletAddress) as AnyUser;

  const { data: colonyData, error, loading } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  const openDecisionDialog = useDialog(DecisionDialog);

  const transform = useCallback(
    pipe(
      mapPayload(() => ({
        colonyAddress: colonyData?.processedColony?.colonyAddress || '',
        colonyName,
        decisionTitle: decisionData.title,
        decisionDescription: decisionData.description,
        domainId: decisionData.domainId,
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
      ({ ethDomainId }) => ethDomainId === decisionData.domainId,
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
        <div className={styles.leftContent}>
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
          {decisionData.description}
        </div>
        <div className={styles.rightContent}>
          <div className={styles.buttonContainer}>
            <Button
              appearance={{ theme: 'secondary', size: 'large' }}
              onClick={() =>
                openDecisionDialog({
                  colony,
                  ethDomainId: decisionData.domainId,
                  title: decisionData.title,
                  description: decisionData.htmlDescription,
                })
              }
              text={{ id: 'button.edit' }}
            />
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
                  disabled={isSubmitting}
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
