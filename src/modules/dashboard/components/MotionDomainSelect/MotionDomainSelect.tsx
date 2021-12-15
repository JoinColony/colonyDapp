import React, { ReactNode, useCallback } from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { useIntl, defineMessages } from 'react-intl';

import { Form, SelectOption } from '~core/Fields';
import DomainDropdown from '~core/DomainDropdown';

import { Colony } from '~data/index';

import styles from './MotionDomainSelect.css';

const MSG = defineMessages({
  createDomain: {
    id: 'dashboard.MotionDomainSelect.createDomain',
    defaultMessage: 'Create motion in ',
  },
});

interface Props {
  colony: Colony;
  initialSelectedDomain?: number;
  name?: string;
  onDomainChange?: (domainId: number) => any;
  filterDomains?: (option: SelectOption) => boolean;
  disabled?: boolean;
}

const displayName = 'dashboard.MotionDomainSelect';

const MotionDomainSelect = ({
  initialSelectedDomain = ROOT_DOMAIN_ID,
  colony,
  name = 'motionDomainId',
  onDomainChange,
  filterDomains,
  disabled = false,
}: Props) => {
  const { formatMessage } = useIntl();
  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(
    (option, label) => {
      /*
       * @NOTE This is so that the active item is displayed as `Root/Current Domain`
       * when a subdomain is selected
       */
      let displayLabel =
        parseInt(option?.value || `${ROOT_DOMAIN_ID}`, 10) === ROOT_DOMAIN_ID
          ? `${formatMessage(MSG.createDomain)} ${label}`
          : `${formatMessage(MSG.createDomain)} ${formatMessage({
              id: 'domain.root',
            })}/${label}`;
      /*
       * @NOTE If the filtering function removed our previously selected option,
       * reset the selection back to Root
       */
      if (!option) {
        displayLabel = `${formatMessage({ id: 'domain.root' })}`;
      }
      return <div className={styles.activeItem}>{displayLabel}</div>;
    },
    [formatMessage],
  );

  return (
    /*
     * @NOTE This form's single purpouse is to display the correct active select value
     * It's not wired to anything, and will not send the value anywhere, but since
     * it has an underlying `Select` component, it won't work otherwise
     */
    <Form
      initialValues={{
        motionDomainId: String(initialSelectedDomain),
      }}
      enableReinitialize
      onSubmit={() => {}}
    >
      <div className={styles.main}>
        <DomainDropdown
          colony={colony}
          name={name}
          currentDomainId={initialSelectedDomain}
          renderActiveOptionFn={renderActiveOption}
          filterOptionsFn={filterDomains}
          onDomainChange={onDomainChange}
          showAllDomains={false}
          showDescription={false}
          disabled={disabled}
        />
      </div>
    </Form>
  );
};

MotionDomainSelect.displayName = displayName;

export default MotionDomainSelect;
