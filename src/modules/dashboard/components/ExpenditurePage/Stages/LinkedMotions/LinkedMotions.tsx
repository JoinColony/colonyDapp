import React, { useMemo } from 'react';
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

  const tagText = useMemo(() => {
    switch (status) {
      case MotionStatus.Pending:
        return MSG.motion;
      case MotionStatus.Passed:
        return MSG.passed;
      case MotionStatus.Failed:
        return MSG.failed;
      default:
        return '';
    }
  }, [status]);

  const tagColor = useMemo(() => {
    switch (status) {
      case MotionStatus.Passed:
        return styles.passedColor;
      case MotionStatus.Failed:
        return styles.failedColor;
      default:
        return undefined;
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
            {formatMessage(MSG.foundExp, { motion, id })}
          </Link>
        ) : (
          formatMessage(MSG.foundExp, { motion, id })
        )}
        <Tag
          text={tagText}
          style={{
            color: tagColor,
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
