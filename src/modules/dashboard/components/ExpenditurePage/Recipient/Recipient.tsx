import { FieldArray, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Button from '~core/Button';
import { DialogSection } from '~core/Dialog';
import { Input, Select, TokenSymbolSelector } from '~core/Fields';
import Icon from '~core/Icon';
import { ItemDataType } from '~core/OmniPicker';
import { Tooltip } from '~core/Popover';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import UserAvatar from '~core/UserAvatar';
import { AnyUser } from '~data/index';
import { Address } from '~types/index';
import { userData } from '../ExpenditureSettings/consts';
import { tokensData } from './consts';

import styles from './Recipient.css';

const MSG = defineMessages({
  defaultRecipientLabel: {
    id: 'dashboard.Expenditures.Recipient.defaultRecipientLabel',
    defaultMessage: 'Recipient',
  },
  defaultValueLabel: {
    id: 'dashboard.Expenditures.Recipient.defaultValueLabel',
    defaultMessage: 'Value',
  },
  defaultDelayLabel: {
    id: 'dashboard.Expenditures.Recipient.defaultDelayLabel',
    defaultMessage: 'Claim delay',
  },
  tooltipMessageTitle: {
    id: 'dashboard.Expenditures.Recipient.tooltipMessageTitle',
    defaultMessage: 'Security delay for claiming funds.',
  },
  tooltipMessageDescription: {
    id: 'dashboard.Expenditures.Recipient.tooltipMessageDescription',
    defaultMessage:
      // eslint-disable-next-line max-len
      'F.ex. once the work is finished, recipient has to wait before funds can be claimed.',
  },
  addTokenText: {
    id: 'dashboard.Expenditures.Recipient.addTokenText',
    defaultMessage: 'Another token',
  },
  removeTokenText: {
    id: 'dashboard.Expenditures.Recipient.removeTokenText',
    defaultMessage: 'Discard',
  },
  hoursLabel: {
    id: 'dashboard.Expenditures.Recipient.daysOptionLabel',
    defaultMessage: 'hours',
  },
  daysLabel: {
    id: 'dashboard.Expenditures.Recipient.daysOptionLabel',
    defaultMessage: 'days',
  },
  monthsLabel: {
    id: 'dashboard.Expenditures.Recipient.monthsOptionLabel',
    defaultMessage: 'months',
  },
});

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);
export interface Recipient {
  id: number;
  recipient?: AnyUser;
  value: { id: number; amount?: number; tokenAddress?: number }[];
  delay?: {
    amount?: string;
    token?: string;
    id?: string;
  };
  isExpanded: boolean;
}
interface Props {
  recipient: Recipient;
  index: number;
}

const newToken = {
  id: 0,
  amount: undefined,
  tokenAddress: undefined,
};

const Recipient = ({ recipient, index }: Props) => {
  const { setFieldValue } = useFormikContext();
  const [valueId, setValueId] = useState(1);
  const { isExpanded, value: tokens } = recipient;

  return (
    <div className={styles.container}>
      {isExpanded && (
        <>
          <DialogSection appearance={{ border: 'bottom', margins: 'small' }}>
            <div className={styles.singleUserContainer}>
              <SingleUserPicker
                data={userData}
                label={MSG.defaultRecipientLabel}
                name={`recipients[${index}].recipient`}
                filter={filterUserSelection}
                renderAvatar={supRenderAvatar}
                dataTest="paymentRecipientPicker"
                itemDataTest="paymentRecipientItem"
                placeholder="Search"
                appearance={{
                  direction: 'horizontal',
                  size: 'small',
                  colorSchema: 'lightGrey',
                }}
                hasSearch
              />
            </div>
          </DialogSection>
          <FieldArray
            name={`recipients[${index}].value`}
            render={(arrayHelpers) => (
              <DialogSection
                appearance={{ border: 'bottom', margins: 'small' }}
              >
                {tokens?.map((token, idx) => (
                  <div className={styles.valueContainer} key={token.id}>
                    <div className={styles.inputContainer}>
                      <Input
                        name={`recipients[${index}].value[${idx}].amount`}
                        appearance={{
                          theme: 'underlined',
                          size: 'small',
                        }}
                        label={MSG.defaultValueLabel}
                        placeholder="Not set"
                        formattingOptions={{
                          numeral: true,
                          // @ts-ignore
                          tailPrefix: true,
                          numeralDecimalScale: 10,
                        }}
                        maxButtonParams={{
                          setFieldValue,
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
                            onClick={() => {
                              if (tokens?.length === 1) {
                                return;
                              }
                              arrayHelpers.remove(idx);
                            }}
                            appearance={{ theme: 'dangerLink' }}
                          >
                            <FormattedMessage {...MSG.removeTokenText} />
                          </Button>
                        )}
                      </div>
                      <TokenSymbolSelector
                        label=""
                        tokens={tokensData}
                        name={`recipients[${index}].value[${idx}].tokenAddress`}
                        elementOnly
                        appearance={{ alignOptions: 'right', theme: 'grey' }}
                      />
                      {tokens.length === idx + 1 && (
                        <Button
                          type="button"
                          onClick={() => {
                            arrayHelpers.push({
                              ...newToken,
                              id: String(valueId),
                            });
                            setValueId((idLocal) => idLocal + 1);
                          }}
                          appearance={{ theme: 'blue' }}
                          disabled={
                            token.amount === undefined ||
                            token.tokenAddress === undefined
                          }
                        >
                          <FormattedMessage {...MSG.addTokenText} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </DialogSection>
            )}
          />
          <DialogSection appearance={{ border: 'bottom', margins: 'small' }}>
            <div className={styles.delayContainer}>
              <div className={styles.delay}>
                <FormattedMessage {...MSG.defaultDelayLabel} />
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
                  elementOnly
                />
                <Select
                  name={`recipients[${index}].delay.time`}
                  appearance={{
                    theme: 'grey',
                    optionSize: 'large',
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
          </DialogSection>
        </>
      )}
    </div>
  );
};

export default Recipient;
