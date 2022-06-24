import { FormikProps } from 'formik';
import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';
import Button from '~core/Button';

import { Form, Checkbox } from '~core/Fields';

import styles from './MembersFilter.css';

const displayName = 'dashboard.ColonyMembers.MembersFilter';

interface FormValues {
  filters: string[];
}

const MSG = defineMessage({
  filter: {
    id: 'dashboard.ColonyMembers.MembersFilter.filter',
    defaultMessage: 'Filter',
  },
  reset: {
    id: 'dashboard.ColonyMembers.MembersFilter.reset',
    defaultMessage: 'Reset',
  },
  contributors: {
    id: 'dashboard.ColonyMembers.MembersFilter.contributors',
    defaultMessage: 'Contributors',
  },
  watchers: {
    id: 'dashboard.ColonyMembers.MembersFilter.watchers',
    defaultMessage: 'Watchers',
  },
  verified: {
    id: 'dashboard.ColonyMembers.MembersFilter.verified',
    defaultMessage: 'Verified',
  },
  banned: {
    id: 'dashboard.ColonyMembers.MembersFilter.banned',
    defaultMessage: 'Banned',
  },
});

const filters = [
  {
    name: 'contributors',
    text: MSG.contributors,
  },
  {
    name: 'watchers',
    text: MSG.watchers,
  },
  {
    name: 'verified',
    text: MSG.verified,
  },
  {
    name: 'banned',
    text: MSG.banned,
  },
];

const MembersFilter = () => {
  return (
    <>
      <hr className={styles.divider} />
      <Form
        initialValues={{ filters: filters.map((item) => item.name) }}
        onSubmit={() => {}}
      >
        {({ resetForm }: FormikProps<FormValues>) => (
          <>
            <div className={styles.titleContainer}>
              <span className={styles.title}>
                <FormattedMessage {...MSG.filter} />
              </span>
              <Button
                text={MSG.reset}
                appearance={{ theme: 'blue' }}
                onClick={() => resetForm()}
              />
            </div>
            <div className={styles.checkboxes}>
              {filters.map((item) => (
                <Checkbox
                  value={item.name}
                  name="filters"
                  key={item.name}
                  label={item.text}
                />
              ))}
            </div>
          </>
        )}
      </Form>
    </>
  );
};

MembersFilter.displayName = displayName;

export default MembersFilter;
