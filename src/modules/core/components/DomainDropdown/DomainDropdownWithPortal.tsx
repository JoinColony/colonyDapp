import React, { ComponentProps, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { ALLDOMAINS_DOMAIN_SELECTION } from '~constants';
import { Select, SelectOption } from '~core/Fields';
import SelectWithPortalDropdown from '~core/Fields/Select/SelectWithPortalDropdown';
import { Props as DomainDropdownProps } from './DomainDropdown';

import DomainDropdownItem from './DomainDropdownItem';

const MSG = defineMessages({
  labelDomainFilter: {
    id: 'DomainDropdown.labelDomainFilter',
    defaultMessage: 'Filter by Domain',
  },
});

interface Props extends DomainDropdownProps {
  scrollContainer: HTMLElement | null;
  placement: 'bottom' | 'right';
}

const displayName = 'DomainDropdown';

const DomainDropdownWithPortal = ({
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
    <SelectWithPortalDropdown
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
    />
  );
};

DomainDropdownWithPortal.displayName = displayName;

export default DomainDropdownWithPortal;
