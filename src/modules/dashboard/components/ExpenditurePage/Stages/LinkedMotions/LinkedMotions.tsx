import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Link from '~core/Link';
import Tag from '~core/Tag';

import { MotionStatus } from '../types';

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
  const tagOptions = useMemo(() => {
    switch (status) {
      case MotionStatus.Pending:
        return { text: MSG.motion, color: undefined };
      case MotionStatus.Passed:
        return { text: MSG.passed, color: styles.passedColor };
      case MotionStatus.Failed:
        return { text: MSG.failed, color: styles.failedColor };
      default:
        return { text: '', color: undefined };
    }
  }, [status]);

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
        {motionLink ? (
          <Link to={motionLink} className={styles.link}>
            <FormattedMessage {...MSG.foundExp} values={{ motion, id }} />
          </Link>
        ) : (
          <FormattedMessage {...MSG.foundExp} values={{ motion, id }} />
        )}
        <Tag
          text={tagOptions.text}
          style={{
            color: tagOptions.color,
          }}
          appearance={{
            theme: status === MotionStatus.Pending ? 'primary' : 'light',
          }}
        />
      </div>
    </div>
  );
};

LinkedMotions.displayName = displayName;

export default LinkedMotions;
