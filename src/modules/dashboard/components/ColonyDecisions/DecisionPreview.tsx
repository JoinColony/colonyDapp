import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Tag from '~core/Tag';
import HookedUserAvatar from '~users/HookedUserAvatar';

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
});
interface Props {
  back;
  handleSubmit;
  username: string;
}

const displayName = 'dashboard.ColonyDecisions.DecisionPreview';

const DecisionPreview = ({ back, handleSubmit, username }: Props) => {
  const UserAvatar = HookedUserAvatar({ fetchUser: false });
  // eslint-disable-next-line no-param-reassign
  username = 'clashmoonpy';

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
              size="s"
              address="0x1afb213afa8729fa7908154b90e256f1be70987a"
            />
            {`@${username}`}
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
            onClick={back}
            text={{ id: 'button.edit' }}
          />
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            onClick={() => handleSubmit()}
            text={{ id: 'button.publish' }}
            style={{ minWidth: styles.wideButton }}
            data-test="decisionPublishButton"
          />
        </div>
      </div>
    </div>
  );
};

DecisionPreview.displayName = displayName;

export default DecisionPreview;
