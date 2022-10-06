import React, { ReactNode, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import classNames from 'classnames';
import { parseInt } from 'lodash';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { FieldArray, useField } from 'formik';

import { Colony } from '~data/index';
import { FormSection, InputLabel, SelectOption } from '~core/Fields';
import DomainDropdown from '~core/DomainDropdown';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import ColorTag, { Color } from '~core/ColorTag';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';

import { FundingSource as FundingSourceType } from '../types';
import Limit from '../Limit';
import RateItem from '../RateItem';

import styles from './FundingSource.css';
import Limit from '../Limit';

const MSG = defineMessages({
  team: {
    id: 'dashboard.ExpenditurePage.Streaming.FundingSource.team',
    defaultMessage: 'Team',
  },
  limit: {
    id: 'dashboard.ExpenditurePage.Streaming.FundingSource.limit',
    defaultMessage: 'Limit',
  },
});

const displayName = 'dashboard.ExpenditurePage.Streaming.FundingSource';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
  isLast?: boolean;
  fundingSource: FundingSourceType;
  index: number;
}

const FundingSource = ({
  isLast,
  fundingSource,
  index,
  colony,
  sidebarRef,
}: Props) => {
  const [, { value }] = useField('streaming');

  const getDomainColor = useCallback<(domainId: string | undefined) => Color>(
    (domainId) => {
      const rootDomainColor: Color = Color.LightPink;
      const defaultColor: Color = Color.Yellow;
      if (domainId === String(ROOT_DOMAIN_ID)) {
        return rootDomainColor;
      }
      if (!colony || !domainId) {
        return defaultColor;
      }
      const domain = colony.domains.find(
        ({ ethDomainId }) => Number(domainId) === ethDomainId,
      );
      return domain ? domain.color : defaultColor;
    },
    [colony],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(
    (option, label) => {
      const optionValue = option?.value;
      const color = getDomainColor(optionValue);

      return (
        <div className={styles.activeItem}>
          <ColorTag color={color} />
          <div className={styles.activeItemLabel}>{label}</div>
        </div>
      );
    },
    [getDomainColor],
  );

  const filterDomains = useCallback((optionDomain) => {
    const optionDomainId = parseInt(optionDomain.value, 10);
    return optionDomainId !== COLONY_TOTAL_BALANCE_DOMAIN_ID;
  }, []);

  return (
    <>
      {fundingSource.isExpanded && (
        <div
          className={classNames(
            styles.formContainer,
            !isLast && styles.marginBottom,
          )}
        >
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.settingsRow}>
              <InputLabel
                label={MSG.team}
                appearance={{
                  direction: 'horizontal',
                }}
              />
              {colony && (
                <DomainDropdown
                  colony={colony}
                  name={`streaming.fundingSources[${index}].team`}
                  renderActiveOptionFn={renderActiveOption}
                  filterOptionsFn={filterDomains}
                  scrollContainer={sidebarRef}
                  placement="bottom"
                  withDropdownElement
                />
              )}
            </div>
          </FormSection>
          <FieldArray
            name={`streaming.fundingSources[${index}].rates`}
            render={({ push, remove }) => (
              <FormSection appearance={{ border: 'bottom' }}>
                {fundingSource.rates?.map((rateItem, rateIndex) => (
                  <RateItem
                    // eslint-disable-next-line max-len
                    name={`streaming.fundingSources[${index}].rates[${rateIndex}]`}
                    rateItem={rateItem}
                    index={rateIndex}
                    push={push}
                    remove={remove}
                    colony={colony}
                    sidebarRef={sidebarRef}
                    multipleTokens={fundingSource.rates.length > 1}
                    key={rateItem.id}
                  />
                ))}
              </FormSection>
            )}
          />
          {value.endDate.option === ExpenditureEndDateTypes.LimitIsReached && (
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.inputWrapper}>
                <InputLabel
                  label={MSG.limit}
                  appearance={{
                    direction: 'horizontal',
                  }}
                />
                {fundingSource.rates.map((rateItem, rateIndex) => {
                  return (
                    <Limit
                      // eslint-disable-next-line max-len
                      name={`streaming.fundingSources[${index}].rates[${rateIndex}].limit`}
                      colony={colony}
                      rate={rateItem}
                      key={rateItem.id}
                    />
                  );
                })}
              </div>
            </FormSection>
          )}
        </div>
      )}
    </>
  );
};

FundingSource.displayName = displayName;

export default FundingSource;
