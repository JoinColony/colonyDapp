import { FieldArray, useField, useFormikContext } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { FormSection, Input, TokenSymbolSelector } from '~core/Fields';
import { AnyUser, Colony, useMembersSubscription } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { filterUserSelection } from '~core/SingleUserPicker';
import { supRenderAvatar } from '~dashboard/ExpenditurePage/Recipient/Recipient';
import Icon from '~core/Icon';
import Button from '~core/Button';

import styles from './SplitEqual.css';

const MSG = defineMessages({
  amountLabel: {
    id: 'dashboard.ExpenditurePage.Split.amountLabel',
    defaultMessage: 'Amount',
  },
  recipientsCounterText: {
    id: 'dashboard.ExpenditurePage.Split.recipientsCounterText',
    defaultMessage: 'recipient{s}',
  },
  each: {
    id: 'dashboard.ExpenditurePage.Split.each',
    defaultMessage: 'each',
  },
  deleteIconTitle: {
    id: 'dashboard.ExpenditurePage.Split.deleteIconTitle',
    defaultMessage: 'Delete recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.ExpenditurePage.Split.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
});

const displayName = 'dashboard.ExpenditurePage.Split.SplitEqual';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const SplitEqual = ({ colony, sidebarRef }: Props) => {
  const { formatMessage } = useIntl();
  const { setFieldValue } = useFormikContext<ValuesType>();
  const [, { value: recipients }] = useField<
    { user?: AnyUser; amount?: number }[]
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
    return (
      recipients?.filter((recipient) => recipient?.user?.id !== undefined)
        .length || 0
    );
  }, [recipients]);

  const calculatedAmount = useMemo(() => {
    return !amount.value ? 0 : Number(amount?.value) / (recipientsCount || 1);
  }, [amount, recipientsCount]);

  useEffect(() => {
    setFieldValue(
      'split.recipients',
      recipients.map((recipient) => {
        return { ...recipient, amount: calculatedAmount };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculatedAmount, setFieldValue]);

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
                numeralDecimalScale: getTokenDecimalsWithFallback(
                  selectedToken && selectedToken.decimals,
                ),
                numeralPositiveOnly: true,
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
            {recipientsCount}{' '}
            {formatMessage(MSG.recipientsCounterText, {
              s: recipientsCount === 1 ? '' : 's',
            })}
          </span>
          {token && (
            <div className={styles.tokenCounterWrapper}>
              <TokenIcon
                className={styles.tokenIcon}
                token={token}
                name={token?.name || token?.address}
              />{' '}
              <Numeral
                unit={getTokenDecimalsWithFallback(0)}
                value={calculatedAmount}
              />{' '}
              {token?.symbol} {formatMessage(MSG.each)}
            </div>
          )}
        </div>
      </FormSection>
      <FormSection>
        <FieldArray
          name="split.recipients"
          render={({ push, remove }) => (
            <>
              <div className={styles.recipientsWrapper}>
                {recipients?.map((recipient, index) => {
                  return (
                    <div
                      className={styles.recipientWrapper}
                      key={recipient?.user?.id || index}
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
                        onClick={() => remove(index)}
                        title={MSG.deleteIconTitle}
                      />
                    </div>
                  );
                })}
              </div>
              <Button onClick={() => push({})} appearance={{ theme: 'blue' }}>
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
