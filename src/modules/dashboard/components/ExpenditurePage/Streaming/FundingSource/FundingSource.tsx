import React, { ReactNode, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import classNames from 'classnames';
import { parseInt } from 'lodash';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Colony } from '~data/index';
import { FormSection, Input, InputLabel, SelectOption } from '~core/Fields';
import DomainDropdown from '~core/DomainDropdown';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import ColorTag, { Color } from '~core/ColorTag';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { FundingSource as FundingSourceType } from '../types';

import Rate from '../Rate';
import styles from './FundingSource.css';

const MSG = defineMessages({
  team: {
    id: 'dashboard.ExpenditurePage.Streaming.FundingSource.team',
    defaultMessage: 'Team',
  },
  notSet: {
    id: 'dashboard.ExpenditurePage.Streaming.FundingSource.notSet',
    defaultMessage: 'Not set',
  },
  limit: {
    id: 'dashboard.ExpenditurePage.Streaming.FundingSource.limit',
    defaultMessage: 'Limit',
  },
});

const displayName = 'dashboard.ExpenditurePage.Streaming.FundingSource';

enum TimePeriod {
  Month = 'month',
  Week = 'week',
  Day = 'day',
  Hour = 'hour',
}

const timeOptions = [
  {
    label: MSG.month,
    value: TimePeriod.Month,
  },
  {
    label: MSG.week,
    value: TimePeriod.Week,
  },
  {
    label: MSG.day,
    value: TimePeriod.Day,
  },
  {
    label: MSG.hour,
    value: TimePeriod.Hour,
  },
];

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
      const value = option?.value;
      const color = getDomainColor(value);

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
          <Rate
            fundingSource={fundingSource}
            index={index}
            sidebarRef={sidebarRef}
            colony={colony}
          />
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.inputWrapper}>
              <InputLabel
                label={MSG.limit}
                appearance={{
                  direction: 'horizontal',
                }}
              />
              {fundingSource.rate.map((rateItem, rateIndex) => {
                const token = colony.tokens?.find(
                  (tokenItem) =>
                    rateItem.token && tokenItem.address === rateItem.token,
                );

                return (
                  <div className={styles.limitContainer} key={rateItem.id}>
                    <div className={styles.inputContainer}>
                      <Input
                        // eslint-disable-next-line max-len
                        name={`streaming.fundingSource[${index}].rate[${rateIndex}].limit`}
                        appearance={{
                          theme: 'underlined',
                          size: 'small',
                        }}
                        label={MSG.limit}
                        placeholder={MSG.notSet}
                        formattingOptions={{
                          numeral: true,
                          numeralDecimalScale: 10,
                        }}
                        elementOnly
                      />
                    </div>
                    {token && (
                      <div className={styles.tokeIconWrapper}>
                        <TokenIcon
                          className={styles.tokenIcon}
                          token={token}
                          name={token.name || token.address}
                        />
                        {token.symbol}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </FormSection>
        </div>
      )}
    </>
  );
};

FundingSource.displayName = displayName;

export default FundingSource;
