import React, { useCallback } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';
import { FieldArray, useField } from 'formik';
import { useParams } from 'react-router';
import Button from '~core/Button';
import Recipient from '../Recipient';

import styles from './Payments.css';
import Icon from '~core/Icon';
import { FormSection } from '~core/Fields';
import { newRecipient } from './constants';
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
  minusIconTitle: {
    id: 'dashboard.Expenditures.Payments.minusIconTitle',
    defaultMessage: 'Collapse a single recipient settings',
  },
  plusIconTitle: {
    id: 'dashboard.Expenditures.Payments.plusIconTitle',
    defaultMessage: 'Expand a single recipient settings',
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
                <div className={styles.singleRecipient} key={recipient.id}>
                  <FormSection appearance={{ border: 'bottom' }}>
                    <div className={styles.recipientLabel}>
                      {recipient.isExpanded ? (
                        <>
                          <Icon
                            name="minus"
                            onClick={() => onToogleButtonClick(index)}
                            className={styles.signWrapper}
                            title={MSG.minusIconTitle}
                          />
                          <div className={styles.verticalDivider} />
                        </>
                      ) : (
                        <Icon
                          name="plus"
                          onClick={() => onToogleButtonClick(index)}
                          className={styles.signWrapper}
                          title={MSG.plusIconTitle}
                        />
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
                    <Icon
                      name="circle-plus"
                      className={styles.circlePlusIcon}
                      viewBox="0 0 16 16"
                    />
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
