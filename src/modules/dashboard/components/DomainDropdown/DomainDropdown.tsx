import React, {
  ComponentProps,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { defineMessages } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import ColorTag, { Color } from '~core/ColorTag';
import { Form, Select, SelectOption } from '~core/Fields';
import { useColonyDomainsQuery } from '~data/index';
import { Address } from '~types/index';

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
  colonyAddress: Address;
  filteredDomainId?: number;
}

const allDomainsColor: Color = Color.Yellow;

const displayName = 'dashboard.DomainDropdown';

const DomainDropdown = ({ colonyAddress, filteredDomainId }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDomain, setSelectedDomain] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = useCallback((values: FormValues) => {
    // do stuff
    // eslint-disable-next-line no-console
    console.log(values);
  }, []);

  const { data } = useColonyDomainsQuery({
    variables: { colonyAddress },
  });

  const getDomainColor = useCallback<(domainId: string | undefined) => Color>(
    (domainId) => {
      const defaultColor: Color = Color.Black;
      if (domainId === '0') {
        return allDomainsColor;
      }
      if (!data || !domainId) {
        return defaultColor;
      }
      const domain = data.colony.domains.find(
        ({ ethDomainId }) => Number(domainId) === ethDomainId,
      );
      /*
       * @TODO Shouldn't have to check typeof domain.color once its return value is guaranteed via graphqlq typedefs
       */
      return domain && typeof domain.color === 'number'
        ? domain.color
        : defaultColor;
    },
    [data],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(
    (option, label) => {
      const value = option ? option.value : undefined;
      const color = getDomainColor(value);
      return (
        <div className={styles.activeItem}>
          {color && (
            <>
              <ColorTag color={color} />{' '}
            </>
          )}
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
          domain={{
            id: '0',
            color: allDomainsColor,
            ethDomainId: 0,
            name: 'All Domains',
            ethParentDomainId: null,
          }}
        />
      ),
      label: { id: 'domain.all' },
      value: '0',
    };
    if (!data) {
      return [allDomainsOption];
    }
    return [
      allDomainsOption,
      ...data.colony.domains.map((domain) => {
        const { ethDomainId, name } = domain;
        return {
          children: <DomainSelectItem domain={domain} />,
          label: name,
          value: `${ethDomainId}`,
        };
      }),
    ];
  }, [data]);

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
        onChange={(val) => setSelectedDomain(Number(val))}
        options={options}
        optionsFooter={<CreateDomainButton />}
        renderActiveOption={renderActiveOption}
      />
    </Form>
  );
};

DomainDropdown.displayName = displayName;

export default DomainDropdown;
