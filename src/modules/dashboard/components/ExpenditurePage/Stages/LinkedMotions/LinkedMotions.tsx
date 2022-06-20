import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Tag from '~core/Tag';
import styles from './LinkedMotions.css';

const MSG = defineMessages({
  linkedMotions: {
    id: 'dashboard.Expenditures.Stages.linkedMotions',
    defaultMessage: 'Linked motions',
  },
  foundExp: {
    id: 'dashboard.Expenditures.Stages.foundExp',
    defaultMessage: 'Fund Exp',
  },
  passed: {
    id: 'dashboard.Expenditures.Stages.passed',
    defaultMessage: 'Passed',
  },
  failed: {
    id: 'dashboard.Expenditures.Stages.failed',
    defaultMessage: 'Failed',
  },
});

interface Props {
  status: 'passed' | 'failed';
}

const LinkedMotions = ({ status }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.line} />
        <div className={styles.dot} />
        <div className={styles.line} />
        <span className={styles.title}>
          <FormattedMessage {...MSG.linkedMotions} />
        </span>
      </div>
      <div className={styles.statusWrapper}>
        <FormattedMessage {...MSG.foundExp} /> - 25
        <Tag
          text={status === 'passed' ? MSG.passed : MSG.failed}
          data-test="deprecatedStatusTag"
          style={{
            color:
              status === 'passed' ? styles.passedColor : styles.failedColor,
          }}
          appearance={{ theme: 'light' }}
        />
      </div>
    </div>
  );
};

export default LinkedMotions;
