/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React from 'react';

import styles from './StepConfirmAll.css';

import Heading from '~core/Heading';

type Row = {
  title: MessageDescriptor,
  valueKey: string,
};

type CardProps = {
  cardOptions: Array<Row>,
  values: {},
};

const CardRow = ({ cardOptions, values }: CardProps): any[] =>
  cardOptions.map(option => (
    <div className={styles.cardRow} key={`option ${option.valueKey}`}>
      <Heading
        appearance={{ size: 'normal', weight: 'medium', margin: 'none' }}
        text={option.title}
      />
      <Heading
        appearance={{ size: 'normal', weight: 'thin', margin: 'none' }}
        text={values[option.valueKey]}
      />
    </div>
  ));

export default CardRow;
