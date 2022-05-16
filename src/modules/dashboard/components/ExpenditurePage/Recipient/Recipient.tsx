import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { DialogSection } from '~core/Dialog';
import { Form, Input, Select, TokenSymbolSelector } from '~core/Fields';
import { Tooltip } from '~core/Popover';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { userData } from '../TopParameters/consts';
import { supRenderAvatar } from '../TopParameters/TopParameters';
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
});

const Recipient = () => {
  return (
    <div className={styles.container}>
      <Form initialValues={{}} initialErrors={{}} onSubmit={() => {}}>
        <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
          <div className={styles.singleUserContainer}>
            <SingleUserPicker
              data={userData}
              label={MSG.defaultRecipientLabel}
              name="owner"
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
        <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
          <div className={styles.valueContainer}>
            <Input
              name="value"
              appearance={{
                theme: 'underlined',
                size: 'small',
                align: 'right',
              }}
              label={MSG.defaultValueLabel}
            />
            <TokenSymbolSelector
              label=""
              tokens={tokensData}
              name="tokenAddress"
              elementOnly
              appearance={{ alignOptions: 'right', theme: 'grey' }}
            />
          </div>
        </DialogSection>
        <DialogSection appearance={{ border: 'bottom', size: 'small' }}>
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
      </Form>
    </div>
  );
};

export default Recipient;
