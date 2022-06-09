import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection, Input, InputLabel, Select } from '~core/Fields';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { Recipient as RecipientType } from '../Payments/types';

import styles from './LockedRecipient.css';

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

interface Props {
  recipient: RecipientType;
}

const LockedRecipient = ({ recipient }: Props) => {
  const {
    isExpanded,
    value: tokens,
    user: { walletAddress, username },
  } = recipient;

  return (
    <div className={styles.container}>
      {isExpanded && (
        <>
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.userContainer}>
              <InputLabel
                label={MSG.defaultRecipientLabel}
                appearance={{
                  direction: 'horizontal',
                }}
              />
              <div className={styles.userAvatarContainer}>
                <UserAvatar address={walletAddress} size="xs" notSet={false} />
                <div className={styles.userName}>
                  <UserMention username={username || ''} />
                </div>
              </div>
            </div>
          </FormSection>
          <FormSection appearance={{ border: 'bottom' }}>
            {tokens?.map((token, idx) => (
              <div className={styles.valueContainer} key={idx}>
                <div className={styles.inputContainer}>
                  <InputLabel label={MSG.defaultValueLabel} />
                  {token.amount}
                  {/* {token.tokenAddress && (
                    <TokenIcon
                      token="0"
                      name={undefined}
                      size="xxs"
                    />
                  )} */}
                </div>
              </div>
            ))}
          </FormSection>
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
                  name=""
                  appearance={{
                    colorSchema: 'grey',
                    size: 'small',
                  }}
                  label=""
                  formattingOptions={{ numericOnly: true }}
                  elementOnly
                />
                <Select
                  name=""
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
        </>
      )}
    </div>
  );
};

export default LockedRecipient;
