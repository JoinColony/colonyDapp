import { useField } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { isNaN } from 'lodash';

import { FormSection, Toggle } from '~core/Fields';
import { Colony } from '~data/index';

import SplitUnequal from './SplitUnequal';
import SplitEqual from './SplitEqual';
import { Split as SplitType } from './types';
import styles from './Split.css';

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
  const [, { value: amount }] = useField('split.amount');
  const [, { value: recipients }, { setValue }] = useField<
    SplitType['recipients']
  >('split.recipients');

  const onToggleChange = useCallback(
    (equal: boolean) => {
      if (equal) {
        const recipientsCount =
          recipients?.filter((recipient) => recipient?.user?.id !== undefined)
            .length || 1;

        const userAmount = isNaN(Number(amount?.value) / recipientsCount)
          ? 0
          : Number(amount?.value) / recipientsCount;

        return setValue(
          recipients?.map((recipient) => ({
            ...recipient,
            amount: {
              value: userAmount,
              tokenAddress: amount?.tokenAddress,
            },
          })),
        );
      }

      return setValue(
        recipients?.map((recipient) => ({
          ...recipient,
          amount: { value: 0, tokenAddress: amount?.tokenAddress },
          percent: 0,
        })),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amount, recipients],
  );

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
            <Toggle
              name="split.unequal"
              onChange={onToggleChange}
              elementOnly
            />
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
