import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Toggle } from '~core/Fields';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import styles from './ForceActionToggle.css';

const MSG = defineMessages({
  label: {
    id: 'core.ForceActionToggle.label',
    defaultMessage: 'Force',
  },
});

interface Props {
  name: string;
}

const ForceActionToggle = ({ name }: Props) => (
  <div className={styles.forceContainer}>
    <FormattedMessage {...MSG.label} />
    <div className={styles.toggleContainer}>
      <Toggle name={name} appearance={{ theme: 'danger' }} />
    </div>
    <Tooltip
      content={
        <div className={styles.tooltip}>
          <FormattedMessage id="tooltip.forceAction" />
        </div>
      }
      trigger="hover"
      placement="top-end"
    >
      <Icon name="question-mark" className={styles.questionIcon} />
    </Tooltip>
  </div>
);

ForceActionToggle.displayName = 'core.ForceActionToggle';

export default ForceActionToggle;
