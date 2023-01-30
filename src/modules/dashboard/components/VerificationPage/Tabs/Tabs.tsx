import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { Step, StepObject } from '~pages/VerificationPage/types';

import styles from './Tabs.css';

const MSG = defineMessages({
  step: {
    id: 'dashboard.VerificationPage.Tabs.step',
    defaultMessage: 'Step {nr}',
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages';

export interface Props {
  steps: StepObject[];
  activeId: Step;
}

const Tabs = ({ steps, activeId }: Props) => {
  return (
    <div className={styles.tabsWrapper}>
      {steps.map((step, index) =>
        step?.label ? (
          <div
            className={classNames(styles.stepItem, {
              [styles.stepActive]: step.id === activeId,
            })}
          >
            <div
              className={classNames(styles.label, {
                [styles.labelActive]: step.id === activeId,
              })}
            >
              <FormattedMessage {...MSG.step} values={{ nr: index + 1 }} />
            </div>
            <FormattedMessage {...step.label} />
          </div>
        ) : null,
      )}
    </div>
  );
};

Tabs.displayName = displayName;

export default Tabs;
