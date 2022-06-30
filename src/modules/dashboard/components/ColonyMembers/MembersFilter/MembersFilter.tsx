import { FormikProps } from 'formik';
import React, { useMemo } from 'react';
import { defineMessage, FormattedMessage, MessageDescriptor } from 'react-intl';

import Button from '~core/Button';
import { Form, Checkbox } from '~core/Fields';

import styles from './MembersFilter.css';

const displayName = 'dashboard.ColonyMembers.MembersFilter';

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

export enum MEMEBERS_FILTERS {
  CONTRIBUTORS = 'contributors',
  WATCHERS = 'watchers',
  VERIFIED = 'verified',
  BANNED = 'banned',
}

interface FormValues {
  filters: MEMEBERS_FILTERS[];
}

interface Filter {
  name: MEMEBERS_FILTERS;
  text: MessageDescriptor;
}

const filters: Filter[] = [
  {
    name: MEMEBERS_FILTERS.CONTRIBUTORS,
    text: MSG.contributors,
  },
  {
    name: MEMEBERS_FILTERS.WATCHERS,
    text: MSG.watchers,
  },
  {
    name: MEMEBERS_FILTERS.VERIFIED,
    text: MSG.verified,
  },
  {
    name: MEMEBERS_FILTERS.BANNED,
    text: MSG.banned,
  },
];

interface Props {
  handleFiltersCallback: (filters: MEMEBERS_FILTERS[]) => void;
  isRoot: boolean;
}

const MembersFilter = ({ handleFiltersCallback, isRoot }: Props) => {
  const filtersList = useMemo(() => (isRoot ? filters : filters.slice(2)), [
    isRoot,
  ]);

  const filterNames = useMemo(() => filtersList.map((item) => item.name), [
    filtersList,
  ]);

  return (
    <>
      <hr className={styles.divider} />
      <Form
        initialValues={{ filters: filterNames }}
        onSubmit={() => {}}
        enableReinitialize
      >
        {({ resetForm, values }: FormikProps<FormValues>) => {
          handleFiltersCallback(values.filters);
          return (
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
                {filtersList.map((item) => (
                  <Checkbox
                    value={item.name}
                    name="filters"
                    key={item.name}
                    label={item.text}
                  />
                ))}
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
};

MembersFilter.displayName = displayName;

export default MembersFilter;
