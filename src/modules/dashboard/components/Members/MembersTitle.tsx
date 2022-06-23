import React, { useCallback, Dispatch, useRef, SetStateAction } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { Select, Form } from '~core/Fields';

import styles from './MembersTitle.css';
import { query700 as query } from '~styles/queries.css';
import ColonyDomainSelector from '~dashboard/ColonyHome/ColonyDomainSelector';
import { FullColonyFragment } from '~data/generated';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Members.MembersTitle.title',
    defaultMessage: `{isMobile, select, 
      true {Members}
      other {Members: }
    }
  `,
  },
  search: {
    id: 'dashboard.Members.MembersTitle.search',
    defaultMessage: 'Search',
  },
  searchPlaceholder: {
    id: 'dashboard.Members.MembersTitle.searchPlaceholder',
    defaultMessage: 'Search...',
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
  handleDomainChange: (domainId: number) => void;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  handleSearch: (e: any) => void;
  colony: FullColonyFragment;
}

const displayName = 'dashboard.MembersTitle';

const MembersTitle = ({
  currentDomainId,
  handleDomainChange,
  domainSelectOptions,
  searchValue,
  handleSearch,
  colony,
}: Props) => {
  const { formatMessage } = useIntl();
  const searchInput = useRef<HTMLInputElement>(null);
  const handleFocusRef = useCallback(() => {
    searchInput?.current?.focus();
  }, [searchInput]);

  const handleMouseEnterRef = useCallback(() => {
    if (searchInput.current !== null) {
      searchInput.current.placeholder = formatMessage(MSG.searchPlaceholder);
    }
  }, [formatMessage]);

  const handleMouseLeaveRef = useCallback(() => {
    if (searchInput.current !== null) {
      searchInput.current.placeholder = '';
    }
  }, []);

  const handleMouseEnter = useCallback(
    (e) => {
      (e.target as HTMLInputElement).placeholder = formatMessage(
        MSG.searchPlaceholder,
      );
    },
    [formatMessage],
  );

  const handleMouseLeave = useCallback((e) => {
    (e.target as HTMLInputElement).placeholder = '';
  }, []);

  const isMobile = useMediaQuery({ query });
  return (
    <div className={styles.titleContainer}>
      <div className={styles.titleLeft}>
        <Heading
          text={MSG.title}
          appearance={{ size: 'medium', theme: 'dark' }}
          textValues={{ isMobile }}
        />
        {isMobile ? (
          <ColonyDomainSelector
            colony={colony}
            filteredDomainId={currentDomainId}
            onDomainChange={handleDomainChange}
          />
        ) : (
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
                onChange={(domainId) =>
                  handleDomainChange(parseInt(domainId, 10))
                }
                options={domainSelectOptions}
              />
            </div>
          </Form>
        )}
      </div>
      {!isMobile && (
        <div className={styles.searchContainer}>
          <input
            name="search"
            ref={searchInput}
            value={searchValue}
            className={styles.input}
            onChange={handleSearch}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
            onClick={handleFocusRef}
            onMouseEnter={handleMouseEnterRef}
            onMouseLeave={handleMouseLeaveRef}
          />
        </div>
      )}
    </div>
  );
};
MembersTitle.displayName = displayName;

export default MembersTitle;
