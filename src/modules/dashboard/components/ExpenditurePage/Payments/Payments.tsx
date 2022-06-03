import React, { useCallback } from 'react';
import classNames from 'classnames';

import { defineMessages, FormattedMessage } from 'react-intl';
import { FieldArray, useField } from 'formik';
import { useParams } from 'react-router';
import Button from '~core/Button';
import Recipient from '../Recipient';

import styles from './Payments.css';
import Icon from '~core/Icon';
import { FormSection } from '~core/Fields';
import { newRecipient } from './consts';
import {
  useColonyFromNameQuery,
  useMembersSubscription,
} from '~data/generated';

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

interface Props {
  sidebarRef: HTMLElement | null;
}

const Payments = ({ sidebarRef }: Props) => {
  const [, { value: recipients }, { setValue }] = useField('recipients');
  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData } = useColonyFromNameQuery({
    variables: { address: '', name: colonyName },
  });
  const { colonyAddress } = colonyData || {};

  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colonyAddress || '' },
  });

  const onToogleButtonClick = useCallback(
    (index) => {
      setValue(
        recipients.map((recipient, idx) =>
          index === idx
            ? { ...recipient, isExpanded: !recipient.isExpanded }
            : recipient,
        ),
      );
    },
    [recipients, setValue],
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
                <div
                  className={styles.singleRecipient}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                >
                  <FormSection appearance={{ border: 'bottom' }}>
                    <div className={styles.recipientLabel}>
                      {recipient.isExpanded ? (
                        <>
                          <Button
                            type="button"
                            onClick={() => onToogleButtonClick(index)}
                            className={styles.signWrapper}
                          >
                            <span className={styles.minus} />
                          </Button>
                          <div className={styles.verticalDivider} />
                        </>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => onToogleButtonClick(index)}
                          className={styles.signWrapper}
                        >
                          <Icon
                            name="plus"
                            className={styles.plus}
                            onClick={() => onToogleButtonClick(index)}
                          />
                        </Button>
                      )}
                      {index + 1}: <FormattedMessage {...MSG.recipient} />
                      {recipients.length > 1 && (
                        <Icon
                          name="trash"
                          className={styles.deleteIcon}
                          onClick={() => remove(index)}
                          title="Delete recipient"
                        />
                      )}
                    </div>
                  </FormSection>
                  <Recipient
                    {...{
                      recipient,
                      index,
                      sidebarRef,
                    }}
                    subscribedUsers={colonyMembers?.subscribedUsers || []}
                  />
                </div>
              ))}
              <div className={styles.addRecipientWrapper}>
                <Button
                  onClick={() => push(newRecipient)}
                  appearance={{ theme: 'blue' }}
                >
                  <div className={styles.addRecipientLabel}>
                    <div className={styles.circleSignWrapper}>
                      <Icon
                        name="plus"
                        className={classNames(
                          styles.plus,
                          styles.circlePlusIcon,
                        )}
                      />
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
