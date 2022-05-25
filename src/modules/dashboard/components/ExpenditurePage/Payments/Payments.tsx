import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FieldArray, useField } from 'formik';
import Button from '~core/Button';
import Recipient from '../Recipient';

import styles from './Payments.css';
import Icon from '~core/Icon';
import { value } from '~dashboard/ActionsPage/DetailsWidget/DetailsWidget.css';
import { FormSection } from '~core/Fields';

const MSG = defineMessages({
  payments: {
    id: 'dashboard.Expenditures.Payments.defaultPayment',
    defaultMessage: 'Add payments',
  },
  recipient: {
    id: 'dashboard.Expenditures.Payments.defaultRrecipient',
    defaultMessage: 'Recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.Expenditures.Payments.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
});

const Payments = () => {
  const [, { value: recipients }, { setValue }] = useField('recipients');
  const [id, setId] = useState(1);

  const newRecipient = {
    id: 0,
    recipient: undefined,
    value: [
      { id: value.length + 1, amount: undefined, tokenAddress: undefined },
    ],
    delay: undefined,
    isExpanded: true,
  };

  const onToogleButtonClick = useCallback(
    (currId) => {
      setValue(
        recipients.map((recipient) =>
          recipient.id === currId
            ? { ...recipient, isExpanded: !recipient.isExpanded }
            : recipient,
        ),
      );
    },
    [recipients, setValue],
  );

  const addRecipient = useCallback(
    (push: (obj: any) => void) => {
      push({
        ...newRecipient,
        id: String(id),
      });
      setId((idLocal) => idLocal + 1);
    },
    [id, newRecipient],
  );

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.recipientContainer}>
        <div className={styles.payments}>
          <FormattedMessage {...MSG.payments} />
        </div>
        <FieldArray
          name="recipients"
          render={({ push, remove }) => (
            <>
              {recipients.map((recipient, index) => (
                <div className={styles.singleRecipient}>
                  <FormSection appearance={{ border: 'bottom' }}>
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
                      {index + 1}: <FormattedMessage {...MSG.recipient} />
                      {recipients.length > 1 && (
                        <Icon
                          name="trash"
                          className={styles.deleteIcon}
                          onClick={() => remove(index)}
                        />
                      )}
                    </div>
                  </FormSection>
                  <Recipient {...{ recipient, index }} />
                </div>
              ))}
              <div className={styles.addRecipientWrapper}>
                <Button
                  onClick={() => addRecipient(push)}
                  appearance={{ theme: 'blue' }}
                >
                  <div className={styles.addRecipientLabel}>
                    <div className={styles.circleSignWrapper}>
                      <Icon name="plus" className={styles.plus} />
                    </div>
                    <FormattedMessage {...MSG.addRecipientLabel} />
                  </div>
                </Button>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default Payments;
