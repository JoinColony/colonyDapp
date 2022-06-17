import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Toggle } from '~core/Fields';
import IconTooltip from '~core/IconTooltip';
import styles from './ForceActionToggle.css';

const MSG = defineMessages({
  label: {
    id: 'core.ForceActionToggle.label',
    defaultMessage: 'Force',
  },
  tooltip: {
    id: 'core.ForceActionToggle.tooltip',
    defaultMessage: `Toggle the "Force" button to perform this action 
      immediately and bypass governance. 
      You need the right permissions to do this.`,
  },
});

const ForceActionToggle = () => (
  <div className={styles.forceContainer}>
    <FormattedMessage {...MSG.label} />
    <div className={styles.toggleContainer}>
      <Toggle name="force" appearance={{ theme: 'danger' }} />
    </div>
    <IconTooltip
      icon="question-mark"
      tooltipText={MSG.tooltip}
      className={styles.questionIcon}
    />
  </div>
);

ForceActionToggle.displayName = 'core.ForceActionToggle';

export default ForceActionToggle;
