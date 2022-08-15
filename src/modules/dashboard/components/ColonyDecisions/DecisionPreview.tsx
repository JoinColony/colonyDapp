import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import Tag from '~core/Tag';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { useUser, useLoggedInUser, useColonyFromNameQuery } from '~data/index';

import DetailsWidget from './DetailsWidget/DetailsWidget';

import styles from './DecisionPreview.css';

const MSG = defineMessages({
  type: {
    id: 'dashboard.ColonyDecisions.DecisionPreview.type',
    defaultMessage: `Type`,
  },
  team: {
    id: 'dashboard.ColonyDecisions.DecisionPreview.team',
    defaultMessage: `Team`,
  },
  author: {
    id: 'dashboard.ColonyDecisions.DecisionPreview.author',
    defaultMessage: `Author`,
  },
  edit: {
    id: 'dashboard.ColonyDecisions.DecisionPreview.edit',
    defaultMessage: `Edit`,
  },
  publish: {
    id: 'dashboard.ColonyDecisions.DecisionPreview.publish',
    defaultMessage: `Publish`,
  },
  // this is mock data for the decision title until a later PR is created to retrieve this from local storage
  title: {
    id: 'dashboard.ColonyDecisions.DecisionPreview.title',
    defaultMessage: `Should we build a Discord Bot?`,
  },
  // this is mock data for the decision description until a later PR is created to retrieve this from local storage
  description: {
    id: 'dashboard.ColonyDecisions.DecisionPreview.description',
    defaultMessage: `I think we should build a Discord bot that integrates with the Dapp and provides our community with greater transperency and also provides more convienience for us to be notified of things happening in our Colony.`,
  },
  // this is a placeholder for the decision type until we have the data
  decisionType: {
    id: 'dashboard.ColonyDecisions.DecisionPreview.decisionType',
    defaultMessage: `Decision`,
  },
});

const handleEdit = () => {};
const handleSubmit = () => {};

const displayName = 'dashboard.ColonyDecisions.DecisionPreview';

const DecisionPreview = () => {
  const { colonyName } = useParams<{
    transactionHash?: string;
    colonyName: string;
  }>();
  const { walletAddress, username } = useLoggedInUser();
  const userProfile = useUser(walletAddress);

  const { data, error } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
    pollInterval: 5000,
  });

  if (error) console.error(error);

  if (data?.processedColony) {
    const { processedColony: colony } = data;

    const UserAvatar = HookedUserAvatar({ fetchUser: false });

    return (
      <div className={styles.main}>
        <div className={styles.upperContainer}>
          <p className={styles.tagWrapper}>
            <Tag text="Preview" appearance={{ theme: 'light' }} />
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
                text={MSG.title}
              />
            </div>
            <FormattedMessage
              {...MSG.description}
              values={{
                h4: (chunks) => (
                  <Heading
                    tagName="h4"
                    appearance={{ size: 'medium', margin: 'small' }}
                    text={chunks}
                  />
                ),
              }}
            />
          </div>
          <div className={styles.rightContent}>
            <div className={styles.buttonContainer}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                onClick={() => handleEdit()}
                text={{ id: 'button.edit' }}
                data-test="decisionEditButton"
              />
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                onClick={() => handleSubmit()}
                text={{ id: 'button.publish' }}
                style={{ minWidth: styles.wideButton }}
                data-test="decisionPublishButton"
              />
            </div>
            <div className={styles.details}>
              <DetailsWidget
                decisionType={MSG.decisionType}
                domain={colony.domains[0]}
                colony={colony}
                walletAddress={walletAddress}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

DecisionPreview.displayName = displayName;

export default DecisionPreview;
