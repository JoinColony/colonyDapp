import { useField } from 'formik';
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Button from '~core/Button';
import { DialogSection } from '~core/Dialog';
import { Input, Select, TokenSymbolSelector } from '~core/Fields';
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
});

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

interface Props {
  isExpanded: boolean;
  id: string;
}

const newToken = {
  id: 0,
  amount: undefined,
  tokenAddress: undefined,
};

const Recipient = ({ isExpanded, id }: Props) => {
  const [, { value: tokens }, { setValue }] = useField('value');
  const [valueId, setValueId] = useState(1);

  const addToken = useCallback(() => {
    setValue([...tokens, { ...newToken, id: String(valueId) }]);
    setValueId((idLocal) => idLocal + 1);
  }, [setValue, tokens, valueId]);

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
                  // size: 'small',
                  // colorSchema: 'lightGrey',
                }}
                // hasSearch
              />
            </div>
          </DialogSection>
          <DialogSection appearance={{ border: 'bottom', margins: 'small' }}>
            {tokens?.map((token) => (
              <div className={styles.valueContainer} key={token.id}>
                <Input
                  name={`amount-${token.id}`}
                  appearance={{
                    theme: 'underlined',
                    size: 'small',
                    align: 'right',
                  }}
                  label={MSG.defaultValueLabel}
                />
                <div className={styles.tokenWrapper}>
                  <TokenSymbolSelector
                    label=""
                    tokens={tokensData}
                    name={`tokenAddress-${token.id}`}
                    elementOnly
                    appearance={{ alignOptions: 'right', theme: 'grey' }}
                  />
                  <Button
                    type="button"
                    onClick={addToken}
                    appearance={{ theme: 'blue' }}
                  >
                    <FormattedMessage {...MSG.addTokenText} />
                  </Button>
                </div>
              </div>
            ))}
          </DialogSection>
          <DialogSection appearance={{ border: 'bottom', margins: 'small' }}>
            <div className={styles.valueContainer}>
              <Tooltip
                content={
                  <div>
                    <FormattedMessage {...MSG.defaultTooltipMessage} />
                  </div>
                }
                trigger="hover"
                placement="right-start"
              >
                <div className="styles.delay">
                  <FormattedMessage {...MSG.defaultDelayInfo} />
                </div>
              </Tooltip>
              <div className={styles.valueControlsContainer}>
                <div className={styles.inputContainer}>
                  <Input
                    name="delay"
                    appearance={{
                      colorSchema: 'grey',
                      size: 'small',
                    }}
                    label=""
                  />
                </div>
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
