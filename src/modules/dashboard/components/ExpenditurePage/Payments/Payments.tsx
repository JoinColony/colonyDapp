import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FieldArray, useField, useFormikContext } from 'formik';
import { nanoid } from 'nanoid';

import Button from '~core/Button';
import Icon from '~core/Icon';
import { FormSection } from '~core/Fields';
import { useMembersSubscription } from '~data/generated';
import { SpinnerLoader } from '~core/Preloaders';
import { Colony } from '~data/index';

import Recipient from '../Recipient';

import { newRecipient } from './constants';
import CollapseExpandButtons from './CollapseExpandButtons';
import styles from './Payments.css';

export const MSG = defineMessages({
  payments: {
    id: 'dashboard.ExpenditurePage.Payments.payments',
    defaultMessage: 'Payments',
  },
  recipient: {
    id: 'dashboard.ExpenditurePage.Payments.recipient',
    defaultMessage: 'Recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.ExpenditurePage.Payments.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
  deleteIconTitle: {
    id: 'dashboard.ExpenditurePage.Payments.deleteIconTitle',
    defaultMessage: 'Delete recipient',
  },
});

const displayName = 'dashboard.ExpenditurePage.Payments';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const Payments = ({ sidebarRef, colony }: Props) => {
  const [, { value: recipients }, { setValue }] = useField('recipients');
  const { setFieldTouched } = useFormikContext();

  const { colonyAddress } = colony || {};

  const { data: colonyMembers, loading } = useMembersSubscription({
    variables: { colonyAddress: colonyAddress || '' },
  });

  const newRecipientData = useMemo(() => {
    return {
      ...newRecipient,
      value: [
        {
          amount: undefined,
          tokenAddress: colony?.nativeTokenAddress,
          id: nanoid(),
        },
      ],
    };
  }, [colony]);

  const onToggleButtonClick = useCallback(
    (index) => {
      setValue(
        recipients?.map((recipient, idx) =>
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
                {recipients?.map((recipient, index) => (
                  <div className={styles.singleRecipient} key={recipient.id}>
                    <FormSection>
                      <div className={styles.recipientLabel}>
                        <CollapseExpandButtons
                          isExpanded={recipient.isExpanded}
                          onToogleButtonClick={() => onToggleButtonClick(index)}
                          isLastItem={index === recipients?.length - 1}
                        />
                        {index + 1}: <FormattedMessage {...MSG.recipient} />
                        {recipients?.length > 1 && (
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
                      colony={colony}
                    />
                  </div>
                ))}
                <Button
                  onClick={() => {
                    push({ ...newRecipientData, id: nanoid() });
                    setFieldTouched(
                      `recipients[${recipients.length}].value[0].amount`,
                    );
                  }}
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

Payments.displayName = displayName;

export default Payments;
