import React, { useMemo } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import Link from '~core/Link';
import Tag from '~core/Tag';
import {
  Motion,
  MotionStatus,
  MotionType,
} from '~pages/IncorporationPage/constants';
import { LANDING_PAGE_ROUTE } from '~routes/routeConstants';

import styles from './LinkedMotions.css';

const MSG = defineMessages({
  linkedMotion: {
    id: 'dashboard.Incorporation.LinkedMotions.linkedMotion',
    defaultMessage: 'Relates to motion',
  },
  passed: {
    id: 'dashboard.Incorporation.LinkedMotions.passed',
    defaultMessage: 'Passed',
  },
  failed: {
    id: 'dashboard.Incorporation.LinkedMotions.failed',
    defaultMessage: 'Failed',
  },
  motion: {
    id: 'dashboard.Incorporation.LinkedMotions.motion',
    defaultMessage: 'Motion',
  },
  payment: {
    id: 'dashboard.Incorporation.LinkedMotions.motion',
    defaultMessage: 'Pay Incorporation Fee',
  },
  edit: {
    id: 'dashboard.Incorporation.LinkedMotions.edit',
    defaultMessage: 'Edit Incorporation',
  },
  cancel: {
    id: 'dashboard.Incorporation.LinkedMotions.cancel',
    defaultMessage: 'Cancel Incorporation',
  },
  motionText: {
    id: 'dashboard.Incorporation.LinkedMotions.motionText',
    defaultMessage: '{text} {count}',
  },
});

const displayName = 'dashboard.Incorporation.LinkedMotions';

type MotionSettins = {
  text?: MessageDescriptor;
  tagText?: MessageDescriptor;
  tagColor?: string;
};

interface Props {
  motions: Motion[];
}

const LinkedMotions = ({ motions }: Props) => {
  const motionSettings = useMemo(
    () => (motion: Motion) => {
      const settings: MotionSettins = {
        text: undefined,
        tagText: undefined,
        tagColor: undefined,
      };

      switch (motion.type) {
        case MotionType.Payment:
          settings.text = MSG.payment;
          break;
        case MotionType.Edit:
          settings.text = MSG.edit;
          break;
        case MotionType.Cancel:
          settings.text = MSG.cancel;
          break;
        default:
          break;
      }

      switch (motion.status) {
        case MotionStatus.Pending:
          settings.tagText = MSG.motion;
          settings.tagColor = undefined;
          break;
        case MotionStatus.Passed:
          settings.tagText = MSG.passed;
          settings.tagColor = styles.passedColor;
          break;
        case MotionStatus.Failed:
          settings.tagText = MSG.failed;
          settings.tagColor = styles.failedColor;
          break;
        default:
          break;
      }

      return settings;
    },
    [],
  );

  // mocks, needed to display correct UI, must be adjusted to display data from the backend
  const multiplePayments =
    motions.filter((motionItem) => motionItem.type === MotionType.Payment)
      ?.length > 1;
  let paymentCount = 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.line} />
        <div className={styles.dot} />
        <div className={styles.line} />
        <div className={styles.title}>
          <FormattedMessage {...MSG.linkedMotion} />
        </div>
      </div>
      {/* The link is hardcoded. Link should redirect to the motion page */}
      {motions.map((motionItem) => {
        const motion = motionSettings(motionItem);
        if (motionItem.type === MotionType.Payment) paymentCount += 1;

        return (
          <div className={styles.statusWrapper}>
            <Link to={LANDING_PAGE_ROUTE} className={styles.link}>
              {motion.text && (
                <FormattedMessage
                  {...MSG.motionText}
                  values={{
                    text: <FormattedMessage {...motion.text} />,
                    count: (
                      <span>
                        {multiplePayments &&
                          paymentCount > 1 &&
                          `#${paymentCount}`}
                      </span>
                    ),
                  }}
                />
              )}
            </Link>
            <Tag
              text={motion.tagText}
              style={{
                color: motion.tagColor,
              }}
              appearance={{
                theme:
                  motionItem.status === MotionStatus.Pending
                    ? 'primary'
                    : 'light',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

LinkedMotions.displayName = displayName;

export default LinkedMotions;
