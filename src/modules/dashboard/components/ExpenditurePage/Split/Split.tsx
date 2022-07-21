import { useField } from 'formik';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FormSection, Toggle } from '~core/Fields';
import { Colony } from '~data/index';

import SplitEqual from './SplitEqual';
import styles from './Split.css';
import { SplitUnequal } from '.';

const MSG = defineMessages({
  split: {
    id: 'dashboard.ExpenditurePage.Split.split',
    defaultMessage: 'Split',
  },
  equal: {
    id: 'dashboard.ExpenditurePage.Split.equal',
    defaultMessage: 'Equal',
  },
  unequal: {
    id: 'dashboard.ExpenditurePage.Split.unequal',
    defaultMessage: 'Unequal',
  },
});

const displayName = 'dashboard.ExpenditurePage.Split';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const Split = ({ colony, sidebarRef }: Props) => {
  const [, { value: splitUnequal }] = useField('split.unequal');
  return (
    <div className={styles.splitContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.split}>
          <FormattedMessage {...MSG.split} />
          <div className={styles.splitToggle}>
            <div
              className={classNames(styles.splitLabel, {
                [styles.activeOption]: !splitUnequal,
              })}
            >
              <FormattedMessage {...MSG.equal} />
            </div>
            <Toggle name="split.unequal" elementOnly />
            <div
              className={classNames(styles.splitLabel, {
                [styles.activeOption]: splitUnequal,
              })}
            >
              <FormattedMessage {...MSG.unequal} />
            </div>
          </div>
        </div>
      </FormSection>
      {splitUnequal ? (
        <SplitUnequal {...{ colony, sidebarRef }} />
      ) : (
        <SplitEqual {...{ colony, sidebarRef }} />
      )}
    </div>
  );
};

Split.displayName = displayName;

export default Split;
