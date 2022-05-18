import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useField } from 'formik';
import Button from '~core/Button';
import Recipient from '../Recipient';

import styles from './Payments.css';
import { DialogSection } from '~core/Dialog';
import Icon from '~core/Icon';

const MSG = defineMessages({
  payments: {
    id: 'Payments.defaultPayment',
    defaultMessage: 'Payments',
  },
  recipient: {
    id: 'Payments.defaultRecipient',
    defaultMessage: 'Recipient',
  },
  addRecipientLabel: {
    id: 'Payments.defaultAddRecipientLabel',
    defaultMessage: 'Add recipient',
  },
});

const newRecipient = {
  id: 0,
  recipient: undefined,
  value: undefined,
  delay: undefined,
  isExpanded: true,
};

const Payments = () => {
  const [, { value: recipients }, { setValue }] = useField('payments');
  const [id, setId] = useState(1);

  const addRecipient = useCallback(() => {
    setValue([...recipients, { ...newRecipient, id: String(id) }]);
    setId((idLocal) => idLocal + 1);
  }, [id, recipients, setValue]);

  const onToogleButtonClick = useCallback(
    (currId) => {
      setValue(
        recipients.map((recip) =>
          recip.id === currId
            ? { ...recip, isExpanded: !recip.isExpanded }
            : recip,
        ),
      );
    },
    [recipients, setValue],
  );

  return (
    <>
      <div className={styles.recipientContainer}>
        <div className={styles.payments}>
          <FormattedMessage {...MSG.payments} />
        </div>
        {recipients.map((recipient, index) => (
          <div className={styles.singleRecipient}>
            <DialogSection appearance={{ border: 'bottom', margins: 'small' }}>
              <div className={styles.recipientLabel}>
                {recipient.isExpanded ? (
                  <>
                    <Button
                      type="button"
                      onClick={() => onToogleButtonClick(recipient.id)}
                      className={styles.signWrapper}
                    >
                      <span className={styles.minus} />
                    </Button>
                    <div className={styles.verticalDivider} />
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => onToogleButtonClick(recipient.id)}
                    className={styles.signWrapper}
                  >
                    <Icon
                      name="plus"
                      className={styles.plus}
                      onClick={() => onToogleButtonClick(recipient.id)}
                    />
                  </Button>
                )}
                {index + 1}. <FormattedMessage {...MSG.recipient} />
              </div>
            </DialogSection>
            <Recipient isExpanded={recipient.isExpanded} id={recipient.id} />
          </div>
        ))}
        <div className={styles.addRecipientWrapper}>
          <Button onClick={addRecipient} appearance={{ theme: 'blue' }}>
            <div className={styles.addRecipientLabel}>
              <div className={styles.circleSignWrapper}>
                <Icon name="plus" className={styles.plus} />
              </div>
              <FormattedMessage {...MSG.addRecipientLabel} />
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Payments;
