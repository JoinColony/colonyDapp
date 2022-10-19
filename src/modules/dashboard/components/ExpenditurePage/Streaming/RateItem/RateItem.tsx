import { useField } from 'formik';
import { nanoid } from 'nanoid';
import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import {
  Input,
  InputLabel,
  InputStatus,
  SelectHorizontal,
  TokenSymbolSelector,
} from '~core/Fields';
import { Colony } from '~data/index';

import { timeOptions } from '../constants';
import { newRate } from '../FundingSource/constants';
import { Rate } from '../types';

import styles from './RateItem.css';

const MSG = defineMessages({
  rate: {
    id: 'dashboard.ExpenditurePage.Streaming.RateItem.rate',
    defaultMessage: 'Rate',
  },
  notSet: {
    id: 'dashboard.ExpenditurePage.Streaming.RateItem.notSet',
    defaultMessage: 'Not set',
  },
  time: {
    id: 'dashboard.ExpenditurePage.Streaming.RateItem.time',
    defaultMessage: 'Rate time',
  },
  discard: {
    id: 'dashboard.ExpenditurePage.Streaming.RateItem.discard',
    defaultMessage: 'Discard',
  },
  anotherToken: {
    id: 'dashboard.ExpenditurePage.Streaming.RateItem.anotherToken',
    defaultMessage: 'Another token',
  },
});

const displayName = 'dashboard.ExpenditurePage.Streaming.RateItem';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
  index: number;
  name: string;
  push: (obj: any) => void;
  remove: <T>(index: number) => T | undefined;
  rateItem: Rate;
  multipleTokens: boolean;
}

const RateItem = ({
  colony,
  sidebarRef,
  push,
  remove,
  rateItem,
  index,
  name,
  multipleTokens,
}: Props) => {
  const [, { error }] = useField(`${name}.amount`);

  return (
    <div className={styles.rateContainer} key={rateItem.id}>
      {index === 0 && (
        <div className={styles.labelButtonWrapper}>
          <InputLabel
            label={MSG.rate}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <Button
            onClick={() => {
              push({
                ...{
                  ...newRate,
                  token: colony.nativeTokenAddress,
                  id: nanoid(),
                },
              });
            }}
            appearance={{ theme: 'blue' }}
            text={MSG.anotherToken}
          />
        </div>
      )}
      <div>
        <div className={styles.removeWrapper}>
          {multipleTokens && (
            <Button
              type="button"
              onClick={() => remove(index)}
              appearance={{ theme: 'dangerLink' }}
              text={MSG.discard}
            />
          )}
        </div>
        <div className={styles.rate}>
          <div className={styles.inputRateAmount}>
            <Input
              name={`${name}.amount`}
              appearance={{
                theme: 'underlined',
                size: 'small',
              }}
              label={MSG.rate}
              placeholder={MSG.notSet}
              formattingOptions={{
                numeral: true,
              }}
              elementOnly
            />
          </div>
          <div className={styles.tokenWrapper}>
            <TokenSymbolSelector
              label=""
              tokens={colony.tokens}
              name={`${name}.token`}
              appearance={{
                alignOptions: 'right',
                theme: 'grey',
              }}
              elementOnly
            />
          </div>
          <span className={styles.slash}>/</span>
          <div className={styles.selectWrapper}>
            <SelectHorizontal
              name={`${name}.time`}
              label={MSG.time}
              appearance={{
                theme: 'alt',
                width: 'content',
              }}
              options={timeOptions}
              scrollContainer={sidebarRef}
              placement="bottom"
              elementOnly
              withDropdownElement
              optionSizeLarge
            />
          </div>
        </div>
        <InputStatus error={error} />
      </div>
    </div>
  );
};

RateItem.displayName = displayName;

export default RateItem;
