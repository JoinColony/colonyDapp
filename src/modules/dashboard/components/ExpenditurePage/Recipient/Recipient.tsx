import { FieldArray, useField, useFormikContext } from 'formik';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Button from '~core/Button';
import {
  FormSection,
  Input,
  InputLabel,
  Select,
  TokenSymbolSelector,
} from '~core/Fields';
import Icon from '~core/Icon';
import { ItemDataType } from '~core/OmniPicker';
import { Tooltip } from '~core/Popover';
import { filterUserSelection } from '~core/SingleUserPicker';
import UserAvatar from '~core/UserAvatar';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { AnyUser } from '~data/index';
import { Address } from '~types/index';
import { Recipient as RecipientType } from '../Payments/types';
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
  valueError: {
    id: 'dashboard.Expenditures.Recipient.valueError',
    defaultMessage: 'Value is required',
  },
});

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);
interface Props {
  recipient: RecipientType;
  index: number;
  subscribedUsers: AnyUser[];
  sidebarRef: HTMLElement | null;
}

const newToken = {
  amount: undefined,
  tokenAddress: undefined,
};

const Recipient = ({
  recipient,
  index,
  subscribedUsers,
  sidebarRef,
}: Props) => {
  const { setFieldValue } = useFormikContext();
  const { isExpanded, value: tokens } = recipient;
  const [, { error: tokenErrors }] = useField(`recipients[${index}].value`);
  const [, { error: amountError }] = useField(
    `recipients[${index}].delay.amount`,
  );
  const [, { error: timeError }] = useField(`recipients[${index}].delay.time`);

  return (
    <div className={styles.container}>
      {isExpanded && (
        <>
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.singleUserContainer}>
              <UserPickerWithSearch
                data={subscribedUsers}
                label={MSG.defaultRecipientLabel}
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
                  <div className={styles.valueContainer} key={idx}>
                    <div className={styles.inputContainer}>
                      <InputLabel label={MSG.defaultValueLabel} />
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
                          // mock, needs to be changed to the actual value
                          maxAmount: '0',
                          fieldName: `recipients[${index}].value[${idx}].amount`,
                        }}
                        elementOnly
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
                      <div className={styles.tokenSelectorWrapper}>
                        <TokenSymbolSelector
                          label=""
                          tokens={tokensData}
                          // eslint-disable-next-line max-len
                          name={`recipients[${index}].value[${idx}].tokenAddress`}
                          appearance={{ alignOptions: 'right', theme: 'grey' }}
                          elementOnly
                        />
                      </div>
                      {tokenErrors?.[idx] && (
                        <div className={styles.error}>
                          <FormattedMessage {...MSG.valueError} />
                        </div>
                      )}
                      {/* if last */}
                      {tokens.length === idx + 1 && (
                        <Button
                          type="button"
                          onClick={() => arrayHelpers.push(newToken)}
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
              </FormSection>
            )}
          />
          <FormSection appearance={{ border: 'bottom' }}>
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
            {(amountError || timeError) && (
              <div className={styles.error}>{timeError}</div>
            )}
          </FormSection>
        </>
      )}
    </div>
  );
};

export default Recipient;
