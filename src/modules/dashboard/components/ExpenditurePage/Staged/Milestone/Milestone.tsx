import React from 'react';
import { FieldArrayRenderProps, useField } from 'formik';
import Decimal from 'decimal.js';
import { defineMessages } from 'react-intl';
import classNames from 'classnames';

import { FormSection, Input, InputStatus } from '~core/Fields';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import Slider from '~core/Slider';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { AnyToken } from '~data/index';

import { Milestone as MilestoneType } from '../types';

import styles from './Milestone.css';

const MSG = defineMessages({
  deleteIconTitle: {
    id: 'dashboard.ExpenditurePage.Staged.Milestone.deleteIconTitle',
    defaultMessage: 'Delete milestone',
  },
  placeholder: {
    id: 'dashboard.ExpenditurePage.Staged.Milestone.placeholder',
    defaultMessage: 'Enter Milestone name',
  },
});

const displayName = 'dashboard.ExpenditurePage.Staged.Milestone';

interface Props {
  milestone: MilestoneType;
  index: number;
  remove: FieldArrayRenderProps['remove'];
  token?: AnyToken;
  amount?: string;
  calculated: {
    sum: number;
    reserve: number;
    remainingStake?: Decimal[];
  };
  name: string;
}

const Milestone = ({
  token,
  amount,
  remove,
  index,
  calculated,
  name,
}: Props) => {
  const [, { value: milestone }] = useField<MilestoneType>(name);
  const [, { value: milestoneAmount }, { setValue: setAmount }] = useField<
    MilestoneType['amount']
  >(`${name}.amount`);
  const [, { error }] = useField(name);

  const [, { error: milestonePercentError }] = useField(
    `staged.milestones[${index}].percent`,
  );

  const handleChange = (val: number) => {
    if (!amount || !val) {
      return null;
    }

    return setAmount({
      value: (Number(val) / 100) * Number(amount),
      tokenAddress: token?.address,
    });
  };

  return (
    <FormSection appearance={{ border: 'bottom' }}>
      <div
        className={classNames(styles.nameWrapper, {
          [styles.nameError]: error,
        })}
      >
        <div>
          <Input
            name={`${name}.name`}
            placeholder={MSG.placeholder}
            appearance={{ theme: 'underlined' }}
          />
        </div>
        <button
          type="button"
          className={styles.deleteIconBox}
          onClick={() => remove(index)}
        >
          <Icon
            name="trash"
            title={MSG.deleteIconTitle}
            className={styles.deleteIcon}
          />
        </button>
      </div>
      <div
        className={styles.sliderWrapper}
        aria-invalid={!!milestonePercentError}
      >
        <Slider
          value={milestone?.percent || 0}
          name={`${name}.percent`}
          limit={calculated.remainingStake?.[index]}
          step={1}
          min={0}
          max={100}
          onChange={handleChange}
          handleStyle={{
            height: 18,
            width: 18,
          }}
          trackStyle={{
            height: 14,
            width: 18,
            transform: 'translateY(-5px)',
            opacity: 0.85,
          }}
          railStyle={{
            backgroundColor: styles.white,
            height: 14,
            position: 'absolute',
            top: 0,
            backgroundImage: 'none',
            boxShadow: styles.boxShadow,
            border: styles.border,
          }}
          dotStyle={{
            backgroundColor: 'transparent',
          }}
        />
        <span className={styles.percent}>{milestone?.percent}%</span>
        {!!milestonePercentError && (
          <InputStatus error={milestonePercentError} />
        )}
      </div>
      {token && amount && (
        <div className={styles.amountWrapper}>
          <div className={styles.value}>
            <TokenIcon
              className={styles.tokenIcon}
              token={token}
              name={token.name || token.address}
            />
            <Numeral value={milestoneAmount?.value || 0} />
            {token.symbol}
          </div>
        </div>
      )}
    </FormSection>
  );
};

Milestone.displayName = displayName;

export default Milestone;
