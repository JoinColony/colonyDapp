import { FieldArray, useField } from 'formik';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Button from '~core/Button';
import { FormSection, Toggle } from '~core/Fields';
import Icon from '~core/Icon';
import { filterUserSelection } from '~core/SingleUserPicker';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { AnyUser, Colony } from '~data/index';
import { useMembersSubscription } from '~data/generated';
import { supRenderAvatar } from '../Recipient/Recipient';

import styles from './Split.css';

const MSG = defineMessages({
  split: {
    id: 'dashboard.ExpenditurePage.Split.split',
    defaultMessage: 'Split',
  },
  equal: {
    id: 'dashboard.ExpenditurePage.Split.equal',
    defaultMessage: 'Equal',
  },
  unequal: {
    id: 'dashboard.ExpenditurePage.Split.unequal',
    defaultMessage: 'Unequal',
  },
  deleteIconTitle: {
    id: 'dashboard.ExpenditurePage.Split.deleteIconTitle',
    defaultMessage: 'Delete recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.ExpenditurePage.Split.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
});

const displayName = 'dashboard.ExpenditurePage.Split';

interface SplitValues {
  split: 'equal' | 'unequal';
  amount?: number;
  splitRecipients?: AnyUser[];
}

interface Props {
  sidebarRef: HTMLElement | null;
  colony?: Colony;
}

const Split = ({ sidebarRef, colony }: Props) => {
  const { colonyAddress } = colony || {};

  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colonyAddress || '' },
  });

  const [, { value: recipients }] = useField('splitRecipients');

  return (
    <div className={styles.paymentContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.split}>
          <FormattedMessage {...MSG.split} />
          <div className={styles.splitToggle}>
            <FormattedMessage {...MSG.equal} />
            <Toggle name="split" elementOnly />
            <FormattedMessage {...MSG.unequal} />
          </div>
        </div>
      </FormSection>
      <FormSection />
      <FormSection>
        <FieldArray
          name="splitRecipients"
          render={({ push, remove }) => (
            <>
              <div className={styles.recipientsWrapper}>
                {recipients?.map((recipient, index) => {
                  return (
                    <div className={styles.recipientWrapper}>
                      <div>
                        <UserPickerWithSearch
                          data={colonyMembers?.subscribedUsers || []}
                          label=""
                          name={`splitRecipients[${index}].recipient`}
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
                  );
                })}
              </div>
              <Button onClick={() => push({})} appearance={{ theme: 'blue' }}>
                <div className={styles.addRecipientLabel}>
                  <Icon name="plus-circle" className={styles.circlePlusIcon} />
                  <FormattedMessage {...MSG.addRecipientLabel} />
                </div>
              </Button>
            </>
          )}
        />
      </FormSection>
    </div>
  );
};

Split.displayName = displayName;

export default Split;
