import React, { Dispatch, SetStateAction } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { Select, Form } from '~core/Fields';

import styles from './MembersTitle.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Members.MembersTitle.title',
    defaultMessage: 'Members: ',
  },
  search: {
    id: 'dashboard.Members.MembersTitle.search',
    defaultMessage: 'Search',
  },
  searchPlaceholder: {
    id: 'dashboard.Members.MembersTitle.searchPlaceholder',
    defaultMessage: 'Search ...',
  },
  labelFilter: {
    id: 'dashboard.Members.MembersTitle.labelFilter',
    defaultMessage: 'Filter',
  },
});

interface Props {
  currentDomainId: number;
  domainSelectOptions: {
    value: string;
    label: string;
  }[];
  handleDomainChange: (e: any) => void;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  handleSearch: (e: any) => void;
}

const displayName = 'dashboard.MembersTitle';

const MembersTitle = ({
  currentDomainId,
  handleDomainChange,
  domainSelectOptions,
  searchValue,
  handleSearch,
}: Props) => {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.titleContainer}>
      <div className={styles.titleLeft}>
        <Heading
          text={MSG.title}
          appearance={{ size: 'medium', theme: 'dark' }}
        />
        <Form
          initialValues={{ filter: currentDomainId.toString() }}
          onSubmit={() => {}}
        >
          <div className={styles.titleSelect}>
            <Select
              appearance={{
                alignOptions: 'right',
                size: 'mediumLarge',
                theme: 'alt',
              }}
              elementOnly
              label={MSG.labelFilter}
              name="filter"
              onChange={handleDomainChange}
              options={domainSelectOptions}
            />
          </div>
        </Form>
      </div>
      <div className={styles.searchContainer}>
        <input
          name="search"
          value={searchValue}
          className={styles.input}
          onChange={handleSearch}
          onMouseEnter={(e) => {
            (e.target as HTMLInputElement).placeholder = formatMessage(
              MSG.searchPlaceholder,
            );
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLInputElement).placeholder = '';
            // e.target.placeholder = '';
          }}
        />
        {searchValue && (
          <button
            className={styles.clearButton}
            onClick={handleSearch}
            type="button"
          >
            <Icon
              appearance={{ size: 'normal' }}
              name="close"
              title={{ id: 'button.close' }}
            />
          </button>
        )}
        <Icon
          appearance={{ size: 'normal' }}
          className={styles.icon}
          name="search"
          title={MSG.search}
        />
      </div>
    </div>
  );
};
MembersTitle.displayName = displayName;

export default MembersTitle;
