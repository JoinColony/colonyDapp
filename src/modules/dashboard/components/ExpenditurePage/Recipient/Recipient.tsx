import { FieldArray, useField } from 'formik';
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
    id: 'Recipient.defaultRecipientLabel',
    defaultMessage: 'Recipient',
  },
  defaultValueLabel: {
    id: 'Recipient.defaultValueLabel',
    defaultMessage: 'Value',
  },
  defaultDelayInfo: {
    id: 'Recipient.defaultDelayInfo',
    defaultMessage: 'Claim delay',
  },
  defaultTooltipMessage: {
    id: 'Recipient.defaultTooltipMessage',
    defaultMessage: `Security delay for claiming funds.

    F.ex. once the work is finished,  
    recipient has to wait before funds can be claimed. `,
  },
  addTokenText: {
    id: 'Recipient.addToken',
    defaultMessage: 'Another token',
  },
  removeTokenText: {
    id: 'Recipient.removeToken',
    defaultMessage: 'Discard',
  },
  maxText: {
    id: 'Recipient.maxText',
    defaultMessage: 'Max',
  },
});

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

interface Props {
  isExpanded: boolean;
  id: string;
  index: number;
}

const newToken = {
  id: 0,
  amount: undefined,
  tokenAddress: undefined,
};

const Recipient = ({ isExpanded, id, index }: Props) => {
  const [, { value }] = useField('recipients');
  const [valueId, setValueId] = useState(1);
  const tokens = value[id]?.value;

  return (
    <div className={styles.container}>
      {isExpanded && (
        <>
          <DialogSection appearance={{ border: 'bottom', margins: 'small' }}>
            <div className={styles.singleUserContainer}>
              <SingleUserPicker
                data={userData}
                label={MSG.defaultRecipientLabel}
                name={`recipient-${id}`}
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
                    <Input
                      name={`recipients[${index}].value[${idx}].amount`}
                      appearance={{
                        theme: 'underlined',
                        size: 'small',
                      }}
                      label={MSG.defaultValueLabel}
                      placeholder="Not set"
                    />
                    <div className={styles.tokenWrapper}>
                      <Button
                        type="button"
                        onClick={() => {
                          if (tokens?.length === 1) {
                            return;
                          }
                          arrayHelpers.remove(idx);
                        }}
                        appearance={{ theme: 'blue' }}
                      >
                        <div className={styles.removeWrapper}>
                          <FormattedMessage {...MSG.removeTokenText} />
                        </div>
                      </Button>
                      <TokenSymbolSelector
                        label=""
                        tokens={tokensData}
                        name={`recipients[${index}].value[${idx}].tokenAddress`}
                        elementOnly
                        appearance={{ alignOptions: 'right', theme: 'grey' }}
                      />
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
                      >
                        <FormattedMessage {...MSG.addTokenText} />
                      </Button>
                    </div>
                  </div>
                ))}
              </DialogSection>
            )}
          />
          <DialogSection appearance={{ border: 'bottom', margins: 'small' }}>
            <div className={styles.delayContainer}>
              <div className={styles.delay}>
                <FormattedMessage {...MSG.defaultDelayInfo} />
                <Tooltip
                  content={
                    <div>
                      <FormattedMessage {...MSG.defaultTooltipMessage} />
                    </div>
                  }
                  trigger="hover"
                  placement="right-start"
                >
                  <Icon name="tooltip" />
                </Tooltip>
              </div>

              <div className={styles.delayControlsContainer}>
                <Input
                  name="delay"
                  appearance={{
                    colorSchema: 'grey',
                    size: 'small',
                  }}
                  label=""
                  elementOnly
                />
                <Select
                  name="delayQuantity"
                  appearance={{ theme: 'grey' }}
                  label=""
                  options={[
                    {
                      label: 'hour',
                      value: 'hour',
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
