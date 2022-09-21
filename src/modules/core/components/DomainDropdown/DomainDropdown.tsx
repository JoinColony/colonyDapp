import React, { ComponentProps, ReactNode, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { ALLDOMAINS_DOMAIN_SELECTION } from '~constants';
import { Select, SelectOption } from '~core/Fields';
import { Colony } from '~data/index';

import DomainDropdownItem from './DomainDropdownItem';

const MSG = defineMessages({
  labelDomainFilter: {
    id: 'DomainDropdown.labelDomainFilter',
    defaultMessage: 'Filter by Domain',
  },
});

interface Props {
  /** Current colony from which to extract the valid domains */
  colony: Colony;

  /** Optional form element name */
  name?: string;

  /** Optional domain to emphasize the current selected domain */
  currentDomainId?: number;

  /** Optional callback triggereded when the domain is being changed via the dropdown */
  onDomainChange?: (domainId: number) => any;

  /** Optional method to trigger when clicking the "Edit Domain" button   */
  onDomainEdit?: (domainId: number) => any;

  /** Optional component to display in the footer of the dropdown */
  footerComponent?: ReactNode;

  /** The optional component (rendered via a function) to use as a trigger in order to open the dropdown */
  renderActiveOptionFn?: (
    activeOption: SelectOption | undefined,
    activeOptionLabel: string,
  ) => ReactNode;

  /** Optional method to filter the options array */
  filterOptionsFn?: (option: SelectOption) => boolean;

  /** Toggle if to display the "All Domains" entry */
  showAllDomains?: boolean;

  /** Toggle if to show the domains descriptions text (if available) */
  showDescription?: boolean;

  /** Toggle if to set the domain dropdown in a disabled state (won't open) */
  disabled?: boolean;

  /** Provides value for data-test prop in select button used on cypress testing */
  dataTest?: string;

  /** Provides value for data-test prop in select items used on cypress testing */
  itemDataTest?: string;

  withDropdownElement?: boolean;
  scrollContainer?: HTMLElement | null;
  placement?: 'right' | 'bottom' | 'exact';
}

const displayName = 'DomainDropdown';

const DomainDropdown = ({
  colony,
  name = 'selectedDomainId',
  currentDomainId,
  onDomainChange,
  onDomainEdit,
  footerComponent,
  renderActiveOptionFn,
  filterOptionsFn,
  showAllDomains = true,
  showDescription = true,
  disabled = false,
  dataTest,
  itemDataTest,
  withDropdownElement = false,
  scrollContainer,
  placement,
}: Props) => {
  const handleSubmit = useCallback(
    (domainId: number) => {
      if (onDomainChange) {
        return onDomainChange(domainId);
      }
      return null;
    },
    [onDomainChange],
  );

  const options = useMemo<ComponentProps<typeof Select>['options']>(() => {
    const allDomainsOption: SelectOption = {
      children: (
        <DomainDropdownItem
          domain={ALLDOMAINS_DOMAIN_SELECTION}
          isSelected={currentDomainId === 0}
          onDomainEdit={onDomainEdit}
          showDescription={showDescription}
        />
      ),
      label: { id: 'domain.all' },
      value: '0',
    };
    const showAllDomainsOption = showAllDomains ? [allDomainsOption] : [];
    if (!colony) {
      return showAllDomainsOption;
    }
    const sortByDomainId = (
      { ethDomainId: firstDomainId },
      { ethDomainId: secondDomainId },
    ) => firstDomainId - secondDomainId;
    const domainOptions = [
      ...showAllDomainsOption,
      ...colony.domains
        /*
         * While this looks like an array, it's not a "true" one (this is the result from the subgraph query)
         * So we must first convert it to an array in order to sort it
         */
        .slice(0)
        .sort(sortByDomainId)
        .map((domain) => {
          const { ethDomainId, name: domainName } = domain;
          return {
            children: (
              <DomainDropdownItem
                domain={domain}
                isSelected={currentDomainId === ethDomainId}
                onDomainEdit={onDomainEdit}
                showDescription={showDescription}
              />
            ),
            label: domainName,
            value: `${ethDomainId}`,
          };
        }),
    ];
    if (filterOptionsFn) {
      return domainOptions.filter(filterOptionsFn);
    }
    return domainOptions;
  }, [
    colony,
    currentDomainId,
    onDomainEdit,
    showDescription,
    showAllDomains,
    filterOptionsFn,
  ]);

  return (
    <Select
      appearance={{
        borderedOptions: 'true',
        size: 'mediumLarge',
        theme: 'alt',
        width: 'content',
      }}
      elementOnly
      label={MSG.labelDomainFilter}
      name={name}
      onChange={(val) => {
        handleSubmit(Number(val));
      }}
      options={options}
      optionsFooter={footerComponent}
      renderActiveOption={renderActiveOptionFn}
      disabled={disabled}
      dataTest={dataTest}
      itemDataTest={itemDataTest}
      scrollContainer={scrollContainer}
      placement={placement}
      withDropdownElement={withDropdownElement}
    />
  );
};

DomainDropdown.displayName = displayName;

export default DomainDropdown;
