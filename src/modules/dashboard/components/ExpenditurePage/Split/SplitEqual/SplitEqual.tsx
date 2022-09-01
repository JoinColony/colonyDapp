import { FieldArray, useField, useFormikContext } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import { isNaN } from 'lodash';

import { FormSection, Input, TokenSymbolSelector } from '~core/Fields';
import { AnyUser, Colony, useMembersSubscription } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { ValuesType } from '~pages/ExpenditurePage/types';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { filterUserSelection } from '~core/SingleUserPicker';
import { supRenderAvatar } from '~dashboard/ExpenditurePage/Recipient/Recipient';
import Icon from '~core/Icon';
import Button from '~core/Button';

import { initalRecipient } from '../constants';

import styles from './SplitEqual.css';

const MSG = defineMessages({
  amountLabel: {
    id: 'dashboard.ExpenditurePage.Split.SplitEqual.amountLabel',
    defaultMessage: 'Amount',
  },
  recipientsCounterText: {
    id: 'dashboard.ExpenditurePage.Split.SplitEqual.recipientsCounterText',
    defaultMessage: `{count} {recipientsCount, plural, one {recipient} other {recipients}}`,
  },
  tokenCounter: {
    id: 'dashboard.ExpenditurePage.Split.SplitEqual.tokenCounter',
    defaultMessage: '{icon} {amount} {token} each',
  },
  deleteIconTitle: {
    id: 'dashboard.ExpenditurePage.Split.SplitEqual.deleteIconTitle',
    defaultMessage: 'Delete recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.ExpenditurePage.Split.SplitEqual.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
});

const displayName = 'dashboard.ExpenditurePage.Split.SplitEqual';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const SplitEqual = ({ colony, sidebarRef }: Props) => {
  const { setFieldValue } = useFormikContext<ValuesType>();
  const [, { value: recipients }, { setValue }] = useField<
    { user?: AnyUser; amount?: number; key: string }[]
  >('split.recipients');
  const { tokens: colonyTokens } = colony || {};
  const [, { value: amount }] = useField<{
    value: string;
    tokenAddress: string;
  }>('split.amount');
  const token = colony.tokens.find(
    (colonyToken) => colonyToken.address === amount?.tokenAddress,
  );
  const { colonyAddress } = colony || {};
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colonyAddress || '' },
  });

  const selectedToken = useMemo(
    () =>
      colonyTokens.find(
        (colonyToken) => colonyToken.address === amount.tokenAddress,
      ),
    [colonyTokens, amount.tokenAddress],
  );

  const recipientsCount = useMemo(() => {
    const recip = recipients?.filter(
      (recipient) => recipient?.user?.id !== undefined,
    );

    return recip.length || 0;
  }, [recipients]);

  const calculatedAmount = useMemo(() => {
    const result = !amount.value
      ? 0
      : Number(amount?.value) / (recipientsCount || 1);
    return isNaN(result) ? 0 : result;
  }, [amount, recipientsCount]);

  useEffect(() => {
    setValue(
      recipients.map((recipient) => ({
        ...recipient,
        amount: calculatedAmount,
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculatedAmount]);

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
                delimiter: ',',
                numeral: true,
                numeralDecimalScale: getTokenDecimalsWithFallback(
                  selectedToken && selectedToken.decimals,
                ),
              }}
              maxButtonParams={{
                setFieldValue,
                // mock, needs to be changed to the actual value
                maxAmount: '100',
                fieldName: 'split.amount.value',
              }}
            />
          </div>
          <div className={styles.tokenWrapper}>
            <div>
              <TokenSymbolSelector
                label=""
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
        <div className={styles.counterWrapper}>
          <span>
            <FormattedMessage
              {...MSG.recipientsCounterText}
              values={{
                recipientsCount,
                count: recipientsCount,
              }}
            />
          </span>
          {token && (
            <div className={styles.tokenCounterWrapper}>
              <FormattedMessage
                {...MSG.tokenCounter}
                values={{
                  icon: (
                    <TokenIcon
                      className={styles.tokenIcon}
                      token={token}
                      name={token?.name || token?.address}
                    />
                  ),
                  amount: (
                    <Numeral
                      unit={getTokenDecimalsWithFallback(0)}
                      value={calculatedAmount}
                    />
                  ),
                  token: token?.symbol,
                }}
              />
            </div>
          )}
        </div>
      </FormSection>
      <FormSection>
        <FieldArray
          name="split.recipients"
          render={({ push, remove }) => (
            <>
              {recipients?.length > 0 && (
                <div className={styles.recipientsWrapper}>
                  {recipients?.map((recipient, index) => (
                    <div
                      className={styles.recipientWrapper}
                      key={recipient?.key}
                    >
                      <div>
                        <UserPickerWithSearch
                          data={colonyMembers?.subscribedUsers || []}
                          label=""
                          name={`split.recipients[${index}].user`}
                          filter={filterUserSelection}
                          renderAvatar={supRenderAvatar}
                          placeholder="Search"
                          sidebarRef={sidebarRef}
                        />
                      </div>
                      <Icon
                        name="trash"
                        className={styles.deleteIcon}
                        onClick={() => {
                          remove(index);
                        }}
                        title={MSG.deleteIconTitle}
                      />
                    </div>
                  ))}
                </div>
              )}
              <Button
                onClick={() => push({ ...initalRecipient, id: nanoid() })}
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
      </FormSection>
    </>
  );
};

SplitEqual.displayName = displayName;

export default SplitEqual;
