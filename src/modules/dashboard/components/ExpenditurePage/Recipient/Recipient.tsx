import { FieldArray, useFormikContext } from 'formik';
import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Button from '~core/Button';
import { FormSection, Input, Select, TokenSymbolSelector } from '~core/Fields';
import Icon from '~core/Icon';
import { ItemDataType } from '~core/OmniPicker';
import { Tooltip } from '~core/Popover';
import { filterUserSelection } from '~core/SingleUserPicker';
import UserAvatar from '~core/UserAvatar';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { AnyUser, Colony } from '~data/index';
import { Address } from '~types/index';

import { Recipient as RecipientType } from '../Payments/types';
import styles from './Recipient.css';

export const MSG = defineMessages({
  recipientLabel: {
    id: 'dashboard.ExpenditurePage.Recipient.recipientLabel',
    defaultMessage: 'Recipient',
  },
  valueLabel: {
    id: 'dashboard.ExpenditurePage.Recipient.valueLabel',
    defaultMessage: 'Value',
  },
  delayLabel: {
    id: 'dashboard.ExpenditurePage.Recipient.delayLabel',
    defaultMessage: 'Claim delay',
  },
  tooltipMessageTitle: {
    id: 'dashboard.ExpenditurePage.Recipient.tooltipMessageTitle',
    defaultMessage: 'Security delay for claiming funds.',
  },
  tooltipMessageDescription: {
    id: 'dashboard.ExpenditurePage.Recipient.tooltipMessageDescription',
    defaultMessage: `For example, once the work is finished, recipient has to wait before funds can be claimed.`,
  },
  addTokenText: {
    id: 'dashboard.ExpenditurePage.Recipient.addTokenText',
    defaultMessage: 'Another token',
  },
  removeTokenText: {
    id: 'dashboard.ExpenditurePage.Recipient.removeTokenText',
    defaultMessage: 'Discard',
  },
  hoursLabel: {
    id: 'dashboard.ExpenditurePage.Recipient.hoursLabel',
    defaultMessage: 'hours',
  },
  daysLabel: {
    id: 'dashboard.ExpenditurePage.Recipient.daysLabel',
    defaultMessage: 'days',
  },
  monthsLabel: {
    id: 'dashboard.ExpenditurePage.Recipient.monthsLabel',
    defaultMessage: 'months',
  },
});

const displayName = 'dashboard.ExpenditurePage.Recipient';

export const supRenderAvatar = (
  address: Address,
  item: ItemDataType<AnyUser>,
) => <UserAvatar address={address} user={item} size="xs" notSet={false} />;
interface Props {
  recipient: RecipientType;
  index: number;
  subscribedUsers: AnyUser[];
  sidebarRef: HTMLElement | null;
  isLast?: boolean;
  colony: Colony;
}

export const newToken = {
  id: nanoid(),
  amount: undefined,
  tokenAddress: undefined,
};

const Recipient = ({
  recipient,
  index,
  subscribedUsers,
  sidebarRef,
  isLast,
  colony,
}: Props) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const { isExpanded, value: tokens } = recipient;
  const { tokens: colonyTokens } = colony || {};

  const newTokenData = useMemo(() => {
    return {
      ...newToken,
      tokenAddress: colony?.nativeTokenAddress,
    };
  }, [colony]);

  return (
    <div className={styles.container}>
      {isExpanded && (
        <div
          className={classNames(
            styles.formContainer,
            !isLast && styles.marginBottom,
          )}
        >
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.singleUserContainer}>
              <UserPickerWithSearch
                data={subscribedUsers}
                label={MSG.recipientLabel}
                name={`recipients[${index}].recipient`}
                filter={filterUserSelection}
                renderAvatar={supRenderAvatar}
                dataTest="paymentRecipientPicker"
                itemDataTest="paymentRecipientItem"
                placeholder="Search"
                sidebarRef={sidebarRef}
              />
            </div>
          </FormSection>
          <FieldArray
            name={`recipients[${index}].value`}
            render={(arrayHelpers) => (
              <FormSection appearance={{ border: 'bottom' }}>
                {tokens?.map((token, idx) => (
                  <div className={styles.valueContainer} key={token.id}>
                    <div className={styles.inputContainer}>
                      <Input
                        name={`recipients[${index}].value[${idx}].amount`}
                        appearance={{
                          theme: 'underlined',
                          size: 'small',
                        }}
                        label={MSG.valueLabel}
                        placeholder="Not set"
                        formattingOptions={{
                          numeral: true,
                          numeralDecimalScale: 10,
                        }}
                        maxButtonParams={{
                          setFieldValue,
                          // mock, needs to be changed to the actual value
                          maxAmount: '0',
                          fieldName: `recipients[${index}].value[${idx}].amount`,
                        }}
                      />
                    </div>
                    <div className={styles.tokenWrapper}>
                      <div className={styles.removeWrapper}>
                        {tokens.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => arrayHelpers.remove(idx)}
                            appearance={{ theme: 'dangerLink' }}
                          >
                            <FormattedMessage {...MSG.removeTokenText} />
                          </Button>
                        )}
                      </div>
                      <div>
                        <TokenSymbolSelector
                          label=""
                          tokens={colonyTokens || []}
                          // eslint-disable-next-line max-len
                          name={`recipients[${index}].value[${idx}].tokenAddress`}
                          appearance={{ alignOptions: 'right', theme: 'grey' }}
                          elementOnly
                        />
                      </div>
                      {/* if last */}
                      {tokens.length === idx + 1 && (
                        <Button
                          type="button"
                          onClick={() => {
                            arrayHelpers.push({
                              ...newTokenData,
                              id: nanoid(),
                            });
                            setFieldTouched(
                              `recipients[${index}].value[${idx + 1}].amount`,
                            );
                          }}
                          appearance={{ theme: 'blue' }}
                          style={{ margin: styles.buttonMargin }}
                        >
                          <FormattedMessage {...MSG.addTokenText} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </FormSection>
            )}
          />
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.delayContainer}>
              <div className={styles.delay}>
                <FormattedMessage {...MSG.delayLabel} />
                <Tooltip
                  content={
                    <div className={styles.tooltip}>
                      <FormattedMessage {...MSG.tooltipMessageTitle} />
                      {MSG.tooltipMessageDescription.defaultMessage && (
                        <div className={styles.tooltipDescription}>
                          <FormattedMessage
                            {...MSG.tooltipMessageDescription}
                          />
                        </div>
                      )}
                    </div>
                  }
                  trigger="hover"
                  placement="right-start"
                >
                  <Icon name="question-mark" className={styles.questionIcon} />
                </Tooltip>
              </div>

              <div className={styles.delayControlsContainer}>
                <Input
                  name={`recipients[${index}].delay.amount`}
                  appearance={{
                    colorSchema: 'grey',
                    size: 'small',
                  }}
                  label=""
                  formattingOptions={{ numericOnly: true }}
                  elementOnly
                />
                <Select
                  name={`recipients[${index}].delay.time`}
                  appearance={{
                    theme: 'grey',
                    alignOptions: 'left',
                  }}
                  label=""
                  options={[
                    {
                      label: MSG.hoursLabel,
                      value: 'hours',
                    },
                    {
                      label: MSG.daysLabel,
                      value: 'days',
                    },
                    {
                      label: MSG.monthsLabel,
                      value: 'months',
                    },
                  ]}
                  elementOnly
                />
              </div>
            </div>
          </FormSection>
        </div>
      )}
    </div>
  );
};

Recipient.displayName = displayName;

export default Recipient;
