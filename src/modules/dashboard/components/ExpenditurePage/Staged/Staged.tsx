import Decimal from 'decimal.js';
import { FieldArray, useField, useFormikContext } from 'formik';
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';

import { FormSection, Input, TokenSymbolSelector } from '~core/Fields';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { filterUserSelection } from '~core/SingleUserPicker';
import Slider from '~core/Slider';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { supRenderAvatar } from '~dashboard/ExpenditurePage/Recipient/Recipient';
import { Colony, useMembersSubscription } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import Button from '~core/Button';

import { initalMilestone } from './constants';
import styles from './Staged.css';

const MSG = defineMessages({
  staged: {
    id: 'dashboard.ExpenditurePage.Staged.staged',
    defaultMessage: 'Staged',
  },
  to: {
    id: 'dashboard.ExpenditurePage.Staged.to',
    defaultMessage: 'To',
  },
  amount: {
    id: 'dashboard.ExpenditurePage.Staged.amount',
    defaultMessage: 'Amount',
  },
  reserve: {
    id: 'dashboard.ExpenditurePage.Staged.reserve',
    defaultMessage: 'Reserve',
  },
  addMilestone: {
    id: 'dashboard.ExpenditurePage.Staged.addMilestone',
    defaultMessage: 'Add milestone',
  },
  deleteIconTitle: {
    id: 'dashboard.ExpenditurePage.Staged.deleteIconTitle',
    defaultMessage: 'Delete milestone',
  },
  placeholder: {
    id: 'dashboard.ExpenditurePage.Staged.placeholder',
    defaultMessage: 'Enter Milestone name',
  },
});

const displayName = 'dashboard.ExpenditurePage.Staged';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const Staged = ({ colony, sidebarRef }: Props) => {
  const { setFieldValue, setFieldTouched } = useFormikContext<ValuesType>();
  const [, { value: amount }] = useField<{
    value?: string;
    tokenAddress?: string;
  }>('staged.amount');
  const [, { value: milestones }] = useField<
    { name: string; amount: number; percent: number; id: string }[]
  >('staged.milestones');
  const { tokens: colonyTokens } = colony || {};

  const token = useMemo(() => {
    return colonyTokens?.find(
      (tokenItem) =>
        amount?.tokenAddress && tokenItem.address === amount?.tokenAddress,
    );
  }, [amount, colonyTokens]);

  const { colonyAddress } = colony || {};
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colonyAddress || '' },
  });

  const calculated = useMemo(() => {
    const sum = milestones?.reduce((acc, milestone) => {
      return acc + Number(milestone.percent);
    }, 0);

    const reserve = 100 - (sum || 0);

    const remainingStake = milestones?.map((milestone) =>
      new Decimal(100 - (sum - milestone.percent)).div(100),
    );

    const milestoneAmount = milestones?.map(
      (milestone) =>
        amount?.value && (milestone.percent / 100) * Number(amount?.value),
    );

    return {
      sum,
      reserve,
      remainingStake,
      milestoneAmount,
    };
  }, [amount, milestones]);

  return (
    <div className={styles.stagedContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.staged} />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.user}>
          <UserPickerWithSearch
            data={colonyMembers?.subscribedUsers || []}
            label={MSG.to}
            name="staged.user"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            placeholder="Search"
            sidebarRef={sidebarRef}
          />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.valueContainer}>
          <div className={styles.inputContainer}>
            <Input
              name="staged.amount.value"
              appearance={{
                theme: 'underlined',
                size: 'small',
              }}
              label={MSG.amount}
              placeholder="Not set"
              formattingOptions={{
                numeral: true,
                numeralDecimalScale: 10,
              }}
              maxButtonParams={{
                setFieldValue,
                // mock, needs to be changed to the actual value
                maxAmount: '100',
                fieldName: 'staged.amount.value',
              }}
            />
          </div>
          <div className={styles.tokenWrapper}>
            <div>
              <TokenSymbolSelector
                label=""
                tokens={colonyTokens}
                name="staged.amount.tokenAddress"
                appearance={{ alignOptions: 'right', theme: 'grey' }}
                elementOnly
              />
            </div>
          </div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.reserveWrapper}>
          <FormattedMessage {...MSG.reserve} />
          <div className={styles.reserveBar}>
            <div
              className={styles.reserveIndicator}
              style={{ width: `${calculated.reserve}%` }}
            />
          </div>
          <span className={styles.percent}>{calculated.reserve}%</span>
        </div>
      </FormSection>
      <FieldArray
        name="staged.milestones"
        render={({ push, remove }) => (
          <>
            {milestones?.map((milestone, index) => (
              <FormSection
                appearance={{ border: 'bottom' }}
                key={milestone?.id}
              >
                <div className={styles.nameWrapper}>
                  <div>
                    <Input
                      name={`staged.milestones[${index}].name`}
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
                  <span className={styles.percent}>
                    {milestones[index].percent}%
                  </span>
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
            ))}
            <Button
              onClick={() => {
                push({ ...initalMilestone, id: nanoid() });
                setFieldTouched(`staged.milestones[${milestones.length}].name`);
              }}
              appearance={{ theme: 'blue' }}
            >
              <div className={styles.addLabel}>
                <Icon name="plus-circle" className={styles.circlePlusIcon} />
                <FormattedMessage {...MSG.addMilestone} />
              </div>
            </Button>
          </>
        )}
      />
    </div>
  );
};

Staged.displayName = displayName;

export default Staged;
