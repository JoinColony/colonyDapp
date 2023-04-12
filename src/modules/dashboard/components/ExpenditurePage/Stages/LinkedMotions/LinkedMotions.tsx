import React, { useMemo } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import Link from '~core/Link';
import Tag from '~core/Tag';

import { Motion, MotionStatus, MotionType } from '../constants';

import styles from './LinkedMotions.css';
import { LANDING_PAGE_ROUTE } from '~routes/routeConstants';

const MSG = defineMessages({
  linkedMotionExpenditure: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedMotions.linkedMotions',
    defaultMessage: 'Linked motions',
  },
  linkedMotionIncorporation: {
    id: 'dashboard.Incorporation.LinkedMotions.linkedMotion',
    defaultMessage: 'Relates to motion',
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
  payment: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedMotions.motion',
    defaultMessage: 'Pay Incorporation Fee',
  },
  edit: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedMotions.edit',
    defaultMessage: 'Edit Incorporation',
  },
  cancel: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedMotions.cancel',
    defaultMessage: 'Cancel Incorporation',
  },
  motionText: {
    id: 'dashboard.ExpenditurePage.Stages.LinkedMotions.motionText',
    defaultMessage: '{text} {count}',
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages.LinkedMotions';

export enum ViewFor {
  INCORPORATION = 'incorporation',
  EXPENDITURE = 'expenditure',
}

type MotionSettins = {
  text?: MessageDescriptor;
  tagText?: MessageDescriptor;
  tagColor?: string;
};

interface Props {
  motion: Motion | Motion[];
  viewFor?: ViewFor;
}

const LinkedMotions = ({ motion, viewFor = ViewFor.EXPENDITURE }: Props) => {
  const motionSettings = useMemo(
    () => (motionItem: Motion) => {
      const settings: MotionSettins = {
        text: undefined,
        tagText: undefined,
        tagColor: undefined,
      };

      switch (motionItem.type) {
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

      switch (motionItem.status) {
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
    Array.isArray(motion) &&
    motion.filter((motionItem) => motionItem.type === MotionType.Payment)
      ?.length > 1;
  let paymentCount = 0;
  const motionsArr = Array.isArray(motion) ? motion : [motion];

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.line} />
        <div className={styles.dot} />
        <div className={styles.line} />
        <div className={styles.title}>
          <FormattedMessage
            {...(viewFor === ViewFor.EXPENDITURE
              ? MSG.linkedMotionExpenditure
              : MSG.linkedMotionIncorporation)}
          />
        </div>
      </div>
      {/* The link is hardcoded. Link should redirect to the motion page */}
      {motionsArr.map((motionItem) => {
        const motionData = motionSettings(motionItem);
        if (motionItem.type === MotionType.Payment) paymentCount += 1;

        return (
          <div className={styles.statusWrapper}>
            <Link to={LANDING_PAGE_ROUTE} className={styles.link}>
              {motionData.text && (
                <FormattedMessage
                  {...MSG.motionText}
                  values={{
                    text: <FormattedMessage {...motionData.text} />,
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
              text={motionData.tagText}
              style={{
                color: motionData.tagColor,
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
