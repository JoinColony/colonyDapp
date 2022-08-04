import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Heading from '~core/Heading';
// import Button from '~core/Button';
import Tag from '~core/Tag';

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

const displayName = 'dashboard.ColonyDecisions.DecisionPreview';

const DecisionPreview = () => {
  return (
    <div className={styles.main}>
      <Tag text="Preview" appearance={{ theme: 'light' }} />
      <hr className={styles.dividerTop} />
      <div className={styles.container}>
        <div className={styles.content}>
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
      </div>
    </div>
  );
};

DecisionPreview.displayName = displayName;

export default DecisionPreview;
