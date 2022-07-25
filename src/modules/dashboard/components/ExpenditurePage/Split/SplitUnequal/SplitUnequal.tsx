import { FieldArray, useField, useFormikContext } from 'formik';
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Decimal from 'decimal.js';

import { FormSection } from '~core/Fields';
import { AnyUser, Colony, useMembersSubscription } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { filterUserSelection } from '~core/SingleUserPicker';
import { supRenderAvatar } from '~dashboard/ExpenditurePage/Recipient/Recipient';
import Slider from '~core/Slider';

import styles from './SplitUnequal.css';

const MSG = defineMessages({
  deleteIconTitle: {
    id: 'dashboard.ExpenditurePage.Split.SplitUnequal.deleteIconTitle',
    defaultMessage: 'Delete recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.ExpenditurePage.Split.SplitUnequal.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
});

const displayName = 'dashboard.ExpenditurePage.SplitUnequal.Split';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const SplitUnequal = ({ sidebarRef, colony }: Props) => {
  const { values } = useFormikContext<ValuesType>();

  const [, { value: recipients }] = useField<
    { user: AnyUser; amount: number }[]
  >('split.recipients');

  const { colonyAddress } = colony || {};
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colonyAddress || '' },
  });

  const remainingToStake = useMemo(() => {
    const limitForRecipient = recipients.map((_, index) => {
      const sum = recipients.reduce((acc, recipient, idx) => {
        if (index === idx) {
          return acc;
        }
        return acc + Number(recipient.amount);
      }, 0);

      return new Decimal(100 - sum).div(100);
    });
    return limitForRecipient;
  }, [recipients]);

  return (
    <FieldArray
      name="split.recipients"
      render={({ push, remove }) => (
        <>
          {recipients?.map((recipient, index) => {
            return (
              <FormSection
                appearance={{ border: 'bottom' }}
                key={recipient?.user?.id || index}
              >
                <div className={styles.recipientWrapper}>
                  <div>
                    <UserPickerWithSearch
                      data={colonyMembers?.subscribedUsers || []}
                      label=""
                      name={`split.recipients[${index}].user`}
                      filter={filterUserSelection}
                      renderAvatar={supRenderAvatar}
                      placeholder="Search"
                      sidebarRef={sidebarRef}
                    />
                  </div>
                  <Icon
                    name="trash"
                    className={styles.deleteIcon}
                    onClick={() => remove(index)}
                    title={MSG.deleteIconTitle}
                  />
                </div>
                <div className={styles.sliderWrapper}>
                  <Slider
                    value={values?.split?.recipients?.[index].amount || 0}
                    name={`split.recipients[${index}].amount`}
                    step={1}
                    min={0}
                    max={100}
                    limit={remainingToStake[index]}
                    handleStyle={{
                      height: 18,
                      width: 18,
                    }}
                    trackStyle={{
                      height: 14,
                      width: 18,
                      transform: 'translateY(-5px)',
                      opacity: 0.85,
                    }}
                    railStyle={{
                      backgroundColor: styles.white,
                      height: 14,
                      position: 'absolute',
                      top: 0,
                      backgroundImage: 'none',
                      boxShadow: styles.boxShadow,
                      border: styles.border,
                    }}
                  />
                  <span className={styles.percent}>
                    {recipients[index].amount}%
                  </span>
                </div>
              </FormSection>
            );
          })}
          <Button
            onClick={() => push({ user: undefined, amount: 0 })}
            appearance={{ theme: 'blue' }}
          >
            <div className={styles.addRecipientLabel}>
              <Icon name="plus-circle" className={styles.circlePlusIcon} />
              <FormattedMessage {...MSG.addRecipientLabel} />
            </div>
          </Button>
        </>
      )}
    />
  );
};
SplitUnequal.displayName = displayName;

export default SplitUnequal;
