import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Button from '~core/Button';
import { FormSection } from '~core/Fields';

import styles from './StreamingStages.css';

const MSG = defineMessages({
  draft: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.draft',
    defaultMessage: 'Draft {text}',
  },
  notSaved: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.notSaved',
    defaultMessage: 'Not saved',
  },
  startStream: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.startStream',
    defaultMessage: 'Start Stream',
  },
  paidToDate: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.paidToDate',
    defaultMessage: 'Paid to date',
  },
  notStarted: {
    id: 'dashboard.ExpenditurePage.Stages.StreamingStages.notStarted',
    defaultMessage: 'Not started',
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages.StreamingStages';

export const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

export interface Props {
  handleSaveDraft?: () => void;
}

const StreamingStages = ({ handleSaveDraft }: Props) => {
  return (
    <div className={styles.stagesWrapper}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={classNames(styles.stagesRow, styles.paddingTopZero)}>
          <span className={classNames(styles.label, styles.dark)}>
            <FormattedMessage
              {...MSG.draft}
              values={{
                text: (
                  <span className={styles.notSaved}>
                    <FormattedMessage {...MSG.notSaved} />
                  </span>
                ),
              }}
            />
          </span>
          <Button
            text={MSG.startStream}
            onClick={handleSaveDraft}
            style={buttonStyles}
          />
        </div>
      </FormSection>
      <div className={styles.stagesRow}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.paidToDate} />
        </span>
        <span className={styles.value}>
          <FormattedMessage {...MSG.notStarted} />
        </span>
      </div>
    </div>
  );
};

StreamingStages.displayName = displayName;

export default StreamingStages;
