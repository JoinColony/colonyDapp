/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React from 'react';

import styles from './StepConfirmAll.css';

import Heading from '~core/Heading';

type Row = {
  title: MessageDescriptor,
  valueKey: string | Array<string>,
};

type CardProps = {
  cardOptions: Array<Row>,
  values: {},
};

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
            ? values[option.valueKey]
            : `${values[option.valueKey[0]]} (${values[option.valueKey[1]]})`
        }
      />
    </div>
  ));

export default CardRow;
