import React from 'react';
import { FieldArrayRenderProps, useField } from 'formik';
import Decimal from 'decimal.js';
import { defineMessages } from 'react-intl';
import classNames from 'classnames';

import { FormSection, Input } from '~core/Fields';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import Slider from '~core/Slider';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { AnyToken } from '~data/index';

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
  milestone: {
    id: string;
    name: string;
    percent: number;
    amount: number;
  };
  index: number;
  remove: FieldArrayRenderProps['remove'];
  token?: AnyToken;
  amount?: string;
  calculated: {
    sum: number;
    reserve: number;
    remainingStake: Decimal[];
    milestoneAmount: (number | '' | undefined)[];
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
  const [, { value: milestones }] = useField<
    { name: string; amount: number; percent: number; id: string }[]
  >('staged.milestones');
  const [, { error }] = useField(name);

  return (
    <FormSection appearance={{ border: 'bottom' }}>
      <div
        className={classNames(styles.nameWrapper, {
          [styles.nameError]: error,
        })}
      >
        <div>
          <Input
            name={name}
            placeholder={MSG.placeholder}
            appearance={{ theme: 'underlined' }}
          />
        </div>
        <Icon
          name="trash"
          className={styles.deleteIcon}
          onClick={() => remove(index)}
          title={MSG.deleteIconTitle}
        />
      </div>
      <div className={styles.sliderWrapper}>
        <Slider
          value={milestones?.[index].percent || 0}
          name={`staged.milestones[${index}].percent`}
          limit={calculated.remainingStake[index]}
          step={1}
          min={0}
          max={100}
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
        <span className={styles.percent}>{milestones[index].percent}%</span>
      </div>
      {token && amount && (
        <div className={styles.amountWrapper}>
          <div className={styles.value}>
            <TokenIcon
              className={styles.tokenIcon}
              token={token}
              name={token.name || token.address}
            />
            <Numeral value={calculated.milestoneAmount[index] || 0} />
            {token.symbol}
          </div>
        </div>
      )}
    </FormSection>
  );
};

Milestone.displayName = displayName;

export default Milestone;
