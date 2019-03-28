/* @flow */

import type { MessageDescriptor } from 'react-intl';

import type { UserType } from '~immutable';

import React from 'react';
import { compose } from 'recompose';

import styles from './StepConfirmAllInput.css';

import Heading from '~core/Heading';

import { withCurrentUser } from '../../../users/hocs';
import { withImmutablePropsToJS } from '~utils/hoc';

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
  currentUser: UserType,
};

const concatenateWithURL = (
  option: { title: MessageDescriptor, valueKey: string | Array<string> },
  values: FormValues,
  currentUser?: UserType,
) =>
  `${
    option.valueKey === `colonyName`
      ? `${values[option.valueKey]} (colony.io/${values[option.valueKey]})`
      : `@${
          currentUser && currentUser.profile && currentUser.profile.username
            ? currentUser.profile.username
            : values[option.valueKey.toString()]
        }`
  }`;

const CardRow = ({ cardOptions, values, currentUser }: CardProps): any[] =>
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
            ? concatenateWithURL(option, values, currentUser)
            : `${values[option.valueKey[0]]} (${values[option.valueKey[1]]})`
        }
      />
    </div>
  ));

export default compose(
  withCurrentUser,
  withImmutablePropsToJS,
)(CardRow);
