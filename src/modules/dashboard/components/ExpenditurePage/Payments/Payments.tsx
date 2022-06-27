import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FieldArray, useField } from 'formik';
import { useParams } from 'react-router';
import { nanoid } from 'nanoid';
import classNames from 'classnames';

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
import { SpinnerLoader } from '~core/Preloaders';

const MSG = defineMessages({
  payments: {
    id: 'dashboard.ExpenditurePage.Payments.payments',
    defaultMessage: 'Add payments',
  },
  recipient: {
    id: 'dashboard.ExpenditurePage.Payments.recipient',
    defaultMessage: 'Recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.ExpenditurePage.Payments.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
  minusIconTitle: {
    id: 'dashboard.ExpenditurePage.Payments.minusIconTitle',
    defaultMessage: 'Collapse a single recipient settings',
  },
  plusIconTitle: {
    id: 'dashboard.ExpenditurePage.Payments.plusIconTitle',
    defaultMessage: 'Expand a single recipient settings',
  },
  deleteIconTitle: {
    id: 'dashboard.ExpenditurePage.Payments.deleteIconTitle',
    defaultMessage: 'Delete recipient',
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

  const { data: colonyMembers, loading } = useMembersSubscription({
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
        {loading ? (
          <SpinnerLoader appearance={{ size: 'medium' }} />
        ) : (
          <FieldArray
            name="recipients"
            render={({ push, remove }) => (
              <>
                {recipients.map((recipient, index) => (
                  <div className={styles.singleRecipient} key={recipient.id}>
                    <FormSection>
                      <div className={styles.recipientLabel}>
                        {recipient.isExpanded ? (
                          <>
                            <Icon
                              name="collapse"
                              onClick={() => onToogleButtonClick(index)}
                              className={styles.signWrapper}
                              title={MSG.minusIconTitle}
                            />
                            <div
                              className={classNames(styles.verticalDivider, {
                                [styles.dividerInLastItem]:
                                  index === recipients?.length - 1,
                              })}
                            />
                          </>
                        ) : (
                          <Icon
                            name="expand"
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
                            title={MSG.deleteIconTitle}
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
                      isLast={index === recipients?.length - 1}
                    />
                  </div>
                ))}
                <Button
                  onClick={() => push({ ...newRecipient, id: nanoid() })}
                  appearance={{ theme: 'blue' }}
                >
                  <div className={styles.addRecipientLabel}>
                    <Icon
                      name="plus-circle"
                      className={styles.circlePlusIcon}
                    />
                    <FormattedMessage {...MSG.addRecipientLabel} />
                  </div>
                </Button>
              </>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Payments;
