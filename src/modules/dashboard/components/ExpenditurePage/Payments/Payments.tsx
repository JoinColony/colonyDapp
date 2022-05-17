import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Button from '~core/Button';
import Recipient from '../Recipient';

import styles from './Payments.css';
import { Recipient as RecipientType } from './types';
import Icon from '~core/Icon';

const MSG = defineMessages({
  defaultRecipient: {
    id: 'Payments.defaultRecipient',
    defaultMessage: 'Recipient',
  },
  defaultAddRecipientLabel: {
    id: 'Payments.defaultAddRecipientLabel',
    defaultMessage: 'Add recipient',
  },
});

const newRecipient = {
  id: 0,
  user: undefined,
  value: undefined,
  delay: undefined,
  isExpanded: true,
};

const Payments = () => {
  const [recipients, setRecipients] = useState<RecipientType[]>([
    { ...newRecipient, id: '0' },
  ]);
  const [id, setId] = useState(1);

  const addRecipient = useCallback(() => {
    setRecipients((value) => [...value, { ...newRecipient, id: String(id) }]);
    setId((idLocal) => idLocal + 1);
  }, [id]);

  const onToogleButtonClick = useCallback((currId) => {
    setRecipients((rec) =>
      rec.map((recip) =>
        recip.id === currId
          ? { ...recip, isExpanded: !recip.isExpanded }
          : recip,
      ),
    );
  }, []);

  return (
    <>
      <div className={styles.recipientContainer}>
        {recipients.map((recipient, index) => (
          <div className={styles.singleRecipient}>
            {recipient.isExpanded ? (
              <Icon
                name="circle-minus"
                title="Error"
                appearance={{ size: 'medium' }}
                onClick={() => onToogleButtonClick(recipient.id)}
              />
            ) : (
              <Icon
                name="circle-plus"
                title="Error"
                onClick={() => onToogleButtonClick(recipient.id)}
              />
            )}
            {index + 1}. Recipient
            <Recipient isExpanded={recipient.isExpanded} />
          </div>
        ))}
      </div>
      <Button onClick={addRecipient}>
        <FormattedMessage {...MSG.defaultAddRecipientLabel} />
      </Button>
    </>
  );
};

export default Payments;
