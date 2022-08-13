import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import Tag from '~core/Tag';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { useColonyFromNameQuery } from '~data/index';

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
  placeholder: {
    id: 'dashboard.ColonyDecisions.DecisionPreview.publish',
    defaultMessage: `I think we should build a Discord bot that integrates with the Dapp and provides our community with greater transperency and also provides more convienience for us to be notified of things happening in our Colony.`,
  },
  decisionType: {
    id: 'dashboard.ColonyDecisions.DecisionPreview.decisionType',
    defaultMessage: `Decision`,
  },
});

/* temp data */
const decisionData = {
  title: 'Update the actions design',
  username: 'clashmoonpy',
  userAddress: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
  isDecision: true,
  actionType: undefined,
  amount: '0',
  blockNumber: 853,
  commentCount: 0,
  createdAt: new Date(
    'Sun Aug 18 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
  ),
  ending: new Date(
    'Sun Aug 28 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
  ),
  decimals: '18',
  fromDomain: '2',
  id: `0xeabe562c979679dc4023dd23e8c6aa782448c2e7_motion_0xa1e73506f3ef6dc19dc27b750adf585fd0f30c63_3`,
  initiator: '0xb77d57f4959eafa0339424b83fcfaf9c15407461',
  motionId: '1',
  motionState: 'Staked',
  recipient: '0x0000000000000000000000000000000000000000',
  reputationChange: '0',
  requiredStake: '1010101010101010101',
  status: undefined,
  symbol: '???',
  timeoutPeriods: undefined,
  toDomain: '2',
  tokenAddress: '0x0000000000000000000000000000000000000000',
  totalNayStake: '0',
  transactionHash:
    '0x9c742b1392fadb48c0bc0d2cebdd518e7b11c0c1ab426c084a06c68ea77f8f70',
  transactionTokenAddress: undefined,
};
const handleEdit = () => {};
const handleSubmit = () => {};

// type Props = RouteChildrenProps<{ colonyName: string }>;

const displayName = 'dashboard.ColonyDecisions.DecisionPreview';

const DecisionPreview = () => {
  const { colonyName } = useParams<{
    transactionHash?: string;
    colonyName: string;
  }>();

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
              <UserAvatar size="s" address={decisionData.userAddress} />
              {`@${decisionData.username}`}
            </span>
            <div className={styles.title}>
              <Heading
                tagName="h3"
                appearance={{
                  size: 'medium',
                  margin: 'small',
                  theme: 'dark',
                }}
                text="Should we build a Discord Bot?"
              />
            </div>
            <FormattedMessage
              {...MSG.placeholder}
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
            <Button
              appearance={{ theme: 'secondary', size: 'large' }}
              onClick={handleEdit}
              text={{ id: 'button.edit' }}
            />
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              onClick={() => handleSubmit()}
              text={{ id: 'button.publish' }}
              style={{ minWidth: styles.wideButton }}
              data-test="decisionPublishButton"
            />
            <div className={styles.details}>
              <DetailsWidget
                decisionType={MSG.decisionType}
                domain={colony.domains[0]}
                colony={colony}
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
