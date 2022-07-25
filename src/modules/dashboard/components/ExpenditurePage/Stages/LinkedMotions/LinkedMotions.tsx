import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import Link from '~core/Link';

import Tag from '~core/Tag';
import { MotionStatus } from '../constants';
import styles from './LinkedMotions.css';

const MSG = defineMessages({
  linkedMotions: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedMotions.linkedMotions',
    defaultMessage: 'Linked motions',
  },
  foundExp: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedMotions.foundExp',
    defaultMessage: '{motion} Exp - {id}',
  },
  passed: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedMotions.passed',
    defaultMessage: 'Passed',
  },
  failed: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedMotions.failed',
    defaultMessage: 'Failed',
  },
  motion: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedMotions.motion',
    defaultMessage: 'Motion',
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages.LinkedMotions';

interface Props {
  status: MotionStatus;
  motionLink?: string;
  motion: string;
  id: string;
}

const LinkedMotions = ({ status, motionLink, motion, id }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.line} />
        <div className={styles.dot} />
        <div className={styles.line} />
        <div className={styles.title}>
          <FormattedMessage {...MSG.linkedMotions} />
        </div>
      </div>
      <div className={styles.statusWrapper}>
        {formatMessage(MSG.foundExp, { motion, id })}
        {status === MotionStatus.Pending && motionLink ? (
          <Link to={motionLink} className={styles.link}>
            <FormattedMessage {...MSG.motion} />
          </Link>
        ) : (
          <Tag
            text={status === MotionStatus.Passed ? MSG.passed : MSG.failed}
            data-test="deprecatedStatusTag"
            style={{
              color:
                status === MotionStatus.Passed
                  ? styles.passedColor
                  : styles.failedColor,
            }}
            appearance={{ theme: 'light' }}
          />
        )}
      </div>
    </div>
  );
};

LinkedMotions.displayName = displayName;

export default LinkedMotions;
