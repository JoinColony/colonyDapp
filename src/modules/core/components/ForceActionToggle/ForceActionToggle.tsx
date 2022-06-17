import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Toggle } from '~core/Fields';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import styles from './ForceActionToggle.css';

const ForceActionToggle = () => {
  return (
    <div className={styles.forceContainer}>
      <FormattedMessage id="tooltip.forceActionLabel" />
      <div className={styles.toggleContainer}>
        <Toggle name="force" appearance={{ theme: 'danger' }} />
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
};

ForceActionToggle.displayName = 'core.components.ForceActionToggle';

export default ForceActionToggle;
