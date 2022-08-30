import { FieldArray, useField, useFormikContext } from 'formik';
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

import { FormSection, Input, TokenSymbolSelector } from '~core/Fields';
import { AnyUser, Colony, useMembersSubscription } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { filterUserSelection } from '~core/SingleUserPicker';
import { supRenderAvatar } from '~dashboard/ExpenditurePage/Recipient/Recipient';
import Icon from '~core/Icon';
import Slider from '~core/Slider';
import Button from '~core/Button';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { initalRecipient } from '../constants';

import styles from './SplitUnequal.css';

const MSG = defineMessages({
  reserve: {
    id: 'dashboard.ExpenditurePage.Split.SplitUnequal.reserve',
    defaultMessage: 'Reserve',
  },
  amountLabel: {
    id: 'dashboard.ExpenditurePage.Split.SplitUnequal.amountLabel',
    defaultMessage: 'Amount',
  },
  deleteIconTitle: {
    id: 'dashboard.ExpenditurePage.Split.SplitUnequal.deleteIconTitle',
    defaultMessage: 'Delete recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.ExpenditurePage.Split.SplitUnequal.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
  recipient: {
    id: 'dashboard.ExpenditurePage.Split.SplitUnequal.recipient',
    defaultMessage: 'Recipient',
  },
});

const displayName = 'dashboard.ExpenditurePage.Split.SplitUnequal';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const SplitUnequal = ({ colony, sidebarRef }: Props) => {
  const { setFieldValue } = useFormikContext<ValuesType>();

  const { tokens: colonyTokens } = colony || {};

  const [, { value: recipients }] = useField<
    { user: AnyUser; amount: number; percent: number; key: string }[]
  >('split.recipients');
  const [, { value: amount }] = useField<{
    value?: string;
    tokenAddress?: string;
  }>('split.amount');

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
    const sum = recipients.reduce((acc, recipient) => {
      return acc + Number(recipient.percent);
    }, 0);

    const remainingAmount = 100 - sum;

    const remainingStake = recipients.map((recipient) =>
      new Decimal(100 - (sum - recipient.percent)).div(100),
    );

    const usersAmount = recipients.map(
      (recipient) =>
        amount.value && (recipient.percent / 100) * Number(amount.value),
    );

    return {
      sum,
      remainingAmount,
      remainingStake,
      usersAmount,
    };
  }, [amount.value, recipients]);

  return (
    <>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.valueContainer}>
          <div className={styles.inputContainer}>
            <Input
              name="split.amount.value"
              appearance={{
                theme: 'underlined',
                size: 'small',
              }}
              label={MSG.amountLabel}
              placeholder="Not set"
              formattingOptions={{
                numeral: true,
                numeralDecimalScale: 10,
              }}
              maxButtonParams={{
                setFieldValue,
                // mock, needs to be changed to the actual value
                maxAmount: '0',
                fieldName: 'split.amount.value',
              }}
            />
          </div>
          <div className={styles.tokenWrapper}>
            <div>
              <TokenSymbolSelector
                label={MSG.amountLabel}
                tokens={colonyTokens}
                name="split.amount.tokenAddress"
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
              style={{ width: `${calculated.remainingAmount}%` }}
            />
          </div>
          <span className={styles.percent}>{calculated.remainingAmount}%</span>
        </div>
      </FormSection>
      <FieldArray
        name="split.recipients"
        render={({ push, remove }) => (
          <>
            {recipients?.map((recipient, index) => {
              return (
                <FormSection
                  appearance={{ border: 'bottom' }}
                  key={recipient?.key}
                >
                  <div className={styles.recipientWrapper}>
                    <div>
                      <UserPickerWithSearch
                        data={colonyMembers?.subscribedUsers || []}
                        label={MSG.recipient}
                        name={`split.recipients[${index}].user`}
                        filter={filterUserSelection}
                        renderAvatar={supRenderAvatar}
                        placeholder="Search"
                        sidebarRef={sidebarRef}
                        elementOnly
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
                      value={recipients?.[index].percent || 0}
                      name={`split.recipients[${index}].percent`}
                      step={1}
                      min={0}
                      max={100}
                      limit={calculated.remainingStake[index]}
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
                      {recipients[index].percent}%
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
                        <Numeral
                          unit={getTokenDecimalsWithFallback(0)}
                          value={calculated.usersAmount[index] || 0}
                        />{' '}
                        {token.symbol}
                      </div>
                    </div>
                  )}
                </FormSection>
              );
            })}
            <Button
              onClick={() => push({ ...initalRecipient, key: nanoid() })}
              appearance={{ theme: 'blue' }}
            >
              <div className={styles.addRecipientLabel}>
                <Icon name="plus-circle" className={styles.circlePlusIcon} />
                <FormattedMessage {...MSG.addRecipientLabel} />
              </div>
            </Button>
          </>
        )}
      />
    </>
  );
};

SplitUnequal.displayName = displayName;

export default SplitUnequal;
