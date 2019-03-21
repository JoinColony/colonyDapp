/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React from 'react';

import styles from './StepConfirmAll.css';

import Heading from '~core/Heading';

type Row = {
  title: MessageDescriptor,
  valueKey: string | Array<string>,
};

type FormValues = {
  colonyName: string,
  username: string,
  tokenName: string,
  tokenSymbol: string,
};

type CardProps = {
  cardOptions: Array<Row>,
  values: FormValues,
};

const concatenateWithURL = (
  option: { title: MessageDescriptor, valueKey: string | Array<string> },
  values: FormValues,
) =>
  `${
    option.valueKey === `colonyName`
      ? `${values[option.valueKey]} (colony.io/${values[option.valueKey]} )`
      : `@${values[option.valueKey.toString()]}`
  }`;

const CardRow = ({ cardOptions, values }: CardProps): any[] =>
  cardOptions.map(option => (
    <div className={styles.cardRow} key={`option ${option.valueKey[0]}`}>
      <Heading
        appearance={{ size: 'tiny', weight: 'medium', margin: 'small' }}
        text={option.title}
      />
      <Heading
        appearance={{ size: 'normal', weight: 'medium', margin: 'small' }}
        text={
          typeof option.valueKey === 'string'
            ? concatenateWithURL(option, values)
            : `${values[option.valueKey[0]]} (${values[option.valueKey[1]]})`
        }
      />
    </div>
  ));

export default CardRow;
