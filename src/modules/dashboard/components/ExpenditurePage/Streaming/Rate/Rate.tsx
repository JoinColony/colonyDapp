/* eslint-disable max-len */
import { FieldArray } from 'formik';
import { nanoid } from 'nanoid';
import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import {
  FormSection,
  Input,
  InputLabel,
  SelectHorizontal,
  TokenSymbolSelector,
} from '~core/Fields';
import { Colony } from '~data/index';

import { timeOptions } from '../constants';
import FieldError from '../FieldError';
import { newRate } from '../FundingSource/constants';
import { FundingSource } from '../types';

import styles from './Rate.css';

const MSG = defineMessages({
  rate: {
    id: 'dashboard.ExpenditurePage.Streaming.Rate.rate',
    defaultMessage: 'Rate',
  },
  notSet: {
    id: 'dashboard.ExpenditurePage.Streaming.Rate.notSet',
    defaultMessage: 'Not set',
  },
  time: {
    id: 'dashboard.ExpenditurePage.Streaming.Rate.time',
    defaultMessage: 'Rate time',
  },
  discard: {
    id: 'dashboard.ExpenditurePage.Streaming.Rate.discard',
    defaultMessage: 'Discard',
  },
  anotherToken: {
    id: 'dashboard.ExpenditurePage.Streaming.Rate.anotherToken',
    defaultMessage: 'Another token',
  },
});

const displayName = 'dashboard.ExpenditurePage.Streaming.Rate';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
  isLast?: boolean;
  fundingSource: FundingSource;
  index: number;
}

const Rate = ({ index, fundingSource, colony, sidebarRef }: Props) => {
  return (
    <FieldArray
      name={`streaming.fundingSource[${index}].rate`}
      render={({ push, remove }) => (
        <FormSection appearance={{ border: 'bottom' }}>
          {fundingSource.rate?.map((rateItem, rateIndex) => {
            return (
              <div className={styles.rateContainer} key={rateItem.id}>
                {rateIndex === 0 && (
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
                    {fundingSource.rate.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => remove(rateIndex)}
                        appearance={{ theme: 'dangerLink' }}
                        text={MSG.discard}
                      />
                    )}
                  </div>
                  <div className={styles.rate}>
                    <div className={styles.inputRateAmount}>
                      <Input
                        name={`streaming.fundingSource[${index}].rate[${rateIndex}].amount`}
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
                        name={`streaming.fundingSource[${index}].rate[${rateIndex}].token`}
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
                        name={`streaming.fundingSource[${index}].rate[${rateIndex}].time`}
                        label={MSG.time}
                        appearance={{
                          theme: 'alt',
                          width: 'content',
                        }}
                        options={timeOptions}
                        scrollContainer={sidebarRef}
                        placement="bottom"
                        elementOnly
                        withDropdownElelment
                        optionSizeLarge
                      />
                    </div>
                  </div>
                  <FieldError
                    name={`streaming.fundingSources[${index}].rate[${rateIndex}].amount`}
                  />
                </div>
              </div>
            );
          })}
        </FormSection>
      )}
    />
  );
};

Rate.displayName = displayName;

export default Rate;
