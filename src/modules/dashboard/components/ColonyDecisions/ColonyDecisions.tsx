import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Select, Form } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';

import { Colony } from '~data/index';

import { SortOptions, SortSelectOptions } from './constants';
import styles from './ColonyDecisions.css';

const MSG = defineMessages({
  decisionsTitle: {
    id: 'dashboard.ColonyDecisions.decisionsTitle',
    defaultMessage: 'Decisions',
  },
  labelFilter: {
    id: 'dashboard.ColonyDecisions.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.ColonyDecisions.placeholderFilter',
    defaultMessage: 'Filter',
  },
  noDecisionsFound: {
    id: 'dashboard.ColonyDecisions.noDecisionsFound',
    defaultMessage: 'No decisions exist',
  },
  loading: {
    id: 'dashboard.ColonyDecisions.loading',
    defaultMessage: 'Loading decisions',
  },
});

type Props = {
  colony: Colony;
  /*
   * @NOTE Needed for filtering based on domain
   */
  ethDomainId?: number;
};

/* Temporary disable */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ColonyDecisions = ({ colony }: Props) => {
  // temp values, to be removed when queries are wired in
  const isLoading = false;
  const data = ['m'];

  if (isLoading) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  return (
    <div>
      {data.length > 0 ? (
        <>
          <div className={styles.bar}>
            <div className={styles.title}>
              <FormattedMessage {...MSG.decisionsTitle} />
            </div>
            <Form
              initialValues={{ filter: SortOptions.ENDING_SOONEST }}
              onSubmit={() => undefined}
            >
              <div className={styles.filter}>
                <Select
                  appearance={{ alignOptions: 'left', theme: 'alt' }}
                  elementOnly
                  label={MSG.labelFilter}
                  name="filter"
                  options={SortSelectOptions}
                  placeholder={MSG.placeholderFilter}
                />
              </div>
            </Form>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <FormattedMessage {...MSG.noDecisionsFound} />
        </div>
      )}
    </div>
  );
};

export default ColonyDecisions;
