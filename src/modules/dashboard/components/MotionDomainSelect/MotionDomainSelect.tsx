import React, { ReactNode, useCallback } from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Form, SelectOption } from '~core/Fields';
import DomainDropdown from '~core/DomainDropdown';

import { Colony } from '~data/index';

import styles from './MotionDomainSelect.css';

interface Props {
  colony: Colony;
  initialSelectedDomain?: number;
  disabled?: boolean;
  name?: string;
  handleSubmit?: () => any;
  onDomainChange?: (domainId: number) => any;
}

const displayName = 'dashboard.MotionDomainSelect';

const MotionDomainSelect = ({
  initialSelectedDomain = ROOT_DOMAIN_ID,
  colony,
  disabled = false,
  name = 'motionDomainId',
  handleSubmit = () => {},
  onDomainChange,
}: Props) => {
  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >((option, label) => <div className={styles.activeItem}>{label}</div>, []);

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
      onSubmit={handleSubmit}
    >
      <div className={styles.main}>
        <DomainDropdown
          colony={colony}
          name={name}
          currentDomainId={initialSelectedDomain}
          renderActiveOptionFn={renderActiveOption}
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
