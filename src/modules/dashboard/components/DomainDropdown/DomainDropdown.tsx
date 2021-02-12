import React, {
  ComponentProps,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { defineMessages } from 'react-intl';
import { ColonyVersion } from '@colony/colony-js';

import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  ALLDOMAINS_DOMAIN_SELECTION,
  ALLOWED_NETWORKS,
} from '~constants';
import ColorTag, { Color } from '~core/ColorTag';
import { Form, Select, SelectOption } from '~core/Fields';
import { Colony, useLoggedInUser } from '~data/index';

import CreateDomainButton from './CreateDomainButton';
import DomainSelectItem from './DomainSelectItem';

import styles from './DomainDropdown.css';

const MSG = defineMessages({
  labelDomainFilter: {
    id: 'dashboard.DomainDropdown.labelDomainFilter',
    defaultMessage: 'Filter by Domain',
  },
});

interface FormValues {
  filteredDomainId: string;
}

interface Props {
  filteredDomainId?: number;
  onDomainChange?: (domainId: number) => any;
  colony: Colony;
}

const allDomainsColor: Color = Color.Yellow;

const displayName = 'dashboard.DomainDropdown';

const DomainDropdown = ({
  filteredDomainId,
  onDomainChange,
  colony,
}: Props) => {
  const { networkId } = useLoggedInUser();

  const [, setSelectedDomain] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const handleSubmit = useCallback(
    (domainId: number) => {
      if (onDomainChange) {
        return onDomainChange(domainId);
      }
      return null;
    },
    [onDomainChange],
  );

  const getDomainColor = useCallback<(domainId: string | undefined) => Color>(
    (domainId) => {
      const defaultColor: Color = Color.LightPink;
      if (domainId === '0') {
        return allDomainsColor;
      }
      if (!colony || !domainId) {
        return defaultColor;
      }
      const domain = colony.domains.find(
        ({ ethDomainId }) => Number(domainId) === ethDomainId,
      );
      /*
       * @TODO Shouldn't have to check typeof domain.color once its return value is guaranteed via graphqlq typedefs
       */
      return domain && typeof domain.color === 'number'
        ? domain.color
        : defaultColor;
    },
    [colony],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(
    (option, label) => {
      const value = option ? option.value : undefined;
      const color = getDomainColor(value);
      return (
        <div className={styles.activeItem}>
          <ColorTag color={color} />{' '}
          <div className={styles.activeItemLabel}>{label}</div>
        </div>
      );
    },
    [getDomainColor],
  );

  const options = useMemo<ComponentProps<typeof Select>['options']>(() => {
    const allDomainsOption: SelectOption = {
      children: (
        <DomainSelectItem
          domain={ALLDOMAINS_DOMAIN_SELECTION}
          colony={colony}
        />
      ),
      label: { id: 'domain.all' },
      value: '0',
    };
    if (!colony) {
      return [allDomainsOption];
    }
    const sortByDomainId = (
      { ethDomainId: firstDomainId },
      { ethDomainId: secondDomainId },
    ) => firstDomainId - secondDomainId;
    return [
      allDomainsOption,
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
            children: <DomainSelectItem domain={domain} colony={colony} />,
            label: name,
            value: `${ethDomainId}`,
          };
        }),
    ];
  }, [colony]);

  const isNetworkAllowed = !!ALLOWED_NETWORKS[networkId || 1];
  const isSupportedColonyVersion =
    parseInt(colony.version, 10) >= ColonyVersion.CeruleanLightweightSpaceship;

  return (
    <Form<FormValues>
      initialValues={{
        filteredDomainId: filteredDomainId ? `${filteredDomainId}` : '0',
      }}
      onSubmit={() => {}}
    >
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
          setSelectedDomain(Number(val));
          handleSubmit(Number(val));
        }}
        options={options}
        optionsFooter={
          isSupportedColonyVersion && isNetworkAllowed ? (
            <CreateDomainButton colony={colony} />
          ) : null
        }
        renderActiveOption={renderActiveOption}
      />
    </Form>
  );
};

DomainDropdown.displayName = displayName;

export default DomainDropdown;
