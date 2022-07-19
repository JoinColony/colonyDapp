import { FieldArray, useField } from 'formik';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FormSection, Toggle } from '~core/Fields';
import styles from './Split.css';
import { Colony } from '~data/index';
import { useMembersSubscription } from '~data/generated';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { filterUserSelection } from '~core/SingleUserPicker';
import { supRenderAvatar } from '../Recipient/Recipient';
import Icon from '~core/Icon';
import Button from '~core/Button';

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

interface Props {
  sidebarRef: HTMLElement | null;
  colony?: Colony;
}

const Split = ({ sidebarRef, colony }: Props) => {
  const { colonyAddress } = colony || {};

  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colonyAddress || '' },
  });

  const [, { value: splitUnequal }] = useField('split.unequal');
  const [, { value: recipients }] = useField('split.recipients');

  return (
    <div className={styles.splitContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.split}>
          <FormattedMessage {...MSG.split} />
          <div className={styles.splitToggle}>
            <div
              className={classNames(styles.splitLabel, {
                [styles.activeOption]: !splitUnequal,
              })}
            >
              <FormattedMessage {...MSG.equal} />
            </div>
            <Toggle name="split.unequal" elementOnly />
            <div
              className={classNames(styles.splitLabel, {
                [styles.activeOption]: splitUnequal,
              })}
            >
              <FormattedMessage {...MSG.unequal} />
            </div>
          </div>
        </div>
      </FormSection>
      <FormSection>
        <FieldArray
          name="split.recipients"
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
                          name={`split.recipients[${index}].recipient`}
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
