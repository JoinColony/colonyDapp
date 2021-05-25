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

  /** Toggle if to display the "All Domains" entry */
  showAllDomains?: boolean;

  /** Toggle if to show the domains descriptions text (if available) */
  showDescription?: boolean;
}

const displayName = 'DomainDropdown';

const DomainDropdown = ({
  colony,
  currentDomainId,
  onDomainChange,
  onDomainEdit,
  footerComponent,
  renderActiveOptionFn,
  showAllDomains = true,
  showDescription = true,
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
    return [
      ...showAllDomainsOption,
      ...colony.domains
        /*
         * While this looks like an array, it's not a "true" one (this is the result from the subgraph query)
         * So we must first convert it to an array in order to sort it
         */
        .slice(0)
        .sort(sortByDomainId)
        .map((domain) => {
          const { ethDomainId, name } = domain;
          return {
            children: (
              <DomainDropdownItem
                domain={domain}
                isSelected={currentDomainId === ethDomainId}
                onDomainEdit={onDomainEdit}
                showDescription={showDescription}
              />
            ),
            label: name,
            value: `${ethDomainId}`,
          };
        }),
    ];
  }, [colony, currentDomainId, onDomainEdit, showDescription, showAllDomains]);

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
      name="filteredDomainId"
      onChange={(val) => {
        handleSubmit(Number(val));
      }}
      options={options}
      optionsFooter={footerComponent}
      renderActiveOption={renderActiveOptionFn}
    />
  );
};

DomainDropdown.displayName = displayName;

export default DomainDropdown;
